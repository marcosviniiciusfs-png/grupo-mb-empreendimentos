const DEFAULT_PIXEL_ID = "2864957293877250";
const DEFAULT_GRAPH_VERSION = "v25.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

const normalize = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const sha256 = async (value) => {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const parseCurrency = (value = "") => {
  const numbers = value.replace(/\D/g, "");
  return numbers ? Number(numbers) / 100 : undefined;
};

const getClientIp = (request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return request.headers.get("cf-connecting-ip") || undefined;
};

const normalizeBrazilPhone = (phone = "") => {
  const cleanPhone = phone.replace(/\D/g, "");
  if (!cleanPhone) return "";
  return cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const traceId = crypto.randomUUID().slice(0, 8).toUpperCase();

    try {
      if (!env.META_CAPI_ACCESS_TOKEN) {
        return jsonResponse(
          { error: "META_CAPI_ACCESS_TOKEN is not configured", traceId },
          500
        );
      }

      let leadData;
      try {
        leadData = await request.json();
      } catch {
        return jsonResponse({ error: "Invalid JSON payload", traceId }, 400);
      }

      const missing = [];
      if (!leadData.event_id) missing.push("event_id");
      if (!leadData.nome?.trim()) missing.push("nome");
      if (!leadData.telefone?.trim()) missing.push("telefone");
      if (!leadData.source_url?.trim()) missing.push("source_url");

      if (missing.length > 0) {
        return jsonResponse(
          { error: `Missing required fields: ${missing.join(", ")}`, traceId },
          400
        );
      }

      const [firstName = "", ...lastNameParts] = normalize(leadData.nome).split(/\s+/);
      const lastName = lastNameParts.join(" ");
      const phone = normalizeBrazilPhone(leadData.telefone);
      const city = normalize(leadData.cidade);
      const value = parseCurrency(leadData.valor_pretendido);

      const userData = {
        ph: [await sha256(phone)],
        client_ip_address: getClientIp(request),
        client_user_agent: leadData.user_agent,
      };

      if (firstName) userData.fn = [await sha256(firstName)];
      if (lastName) userData.ln = [await sha256(lastName)];
      if (city) userData.ct = [await sha256(city)];
      if (leadData.fbp) userData.fbp = leadData.fbp;
      if (leadData.fbc) userData.fbc = leadData.fbc;

      const customData = {
        content_name: "Simulador Grupo MB Empreendimentos",
        content_category: leadData.tipo_bem,
        currency: "BRL",
        tipo_bem: leadData.tipo_bem,
        valor_pretendido: leadData.valor_pretendido,
        valor_entrada: leadData.valor_entrada,
        parcela_ideal: leadData.parcela_ideal,
        cidade: leadData.cidade,
        tempo_aquisicao: leadData.tempo_aquisicao,
      };

      if (typeof value === "number") customData.value = value;

      const metaPayload = {
        data: [
          {
            event_name: "Lead",
            event_time: leadData.event_time || Math.floor(Date.now() / 1000),
            event_id: leadData.event_id,
            action_source: leadData.action_source || "website",
            event_source_url: leadData.source_url,
            user_data: userData,
            custom_data: customData,
          },
        ],
      };

      if (env.META_TEST_EVENT_CODE) {
        metaPayload.test_event_code = env.META_TEST_EVENT_CODE;
      }

      const pixelId = env.META_PIXEL_ID || DEFAULT_PIXEL_ID;
      const graphVersion = env.META_GRAPH_API_VERSION || DEFAULT_GRAPH_VERSION;
      const metaResponse = await fetch(
        `https://graph.facebook.com/${graphVersion}/${pixelId}/events?access_token=${env.META_CAPI_ACCESS_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metaPayload),
        }
      );

      const responseText = await metaResponse.text();
      let responseBody = responseText;
      try {
        responseBody = JSON.parse(responseText);
      } catch {
        // Keep plain text response.
      }

      if (!metaResponse.ok) {
        return jsonResponse(
          {
            error: `Meta CAPI error: ${metaResponse.status}`,
            details: responseBody,
            traceId,
          },
          500
        );
      }

      return jsonResponse({ success: true, meta: responseBody, traceId });
    } catch (error) {
      return jsonResponse(
        {
          error: error instanceof Error ? error.message : "Unknown error",
          traceId,
        },
        500
      );
    }
  },
};
