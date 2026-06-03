import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ThankYou = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "PageView");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <CheckCircle className="w-16 h-16 text-primary" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Obrigado!
          </h1>
          <p className="text-lg text-muted-foreground">
            Sua solicitacao foi enviada com sucesso! Em breve entraremos em contato via WhatsApp.
          </p>
        </div>

        <div className="pt-4">
          <Link to="/">
            <Button className="bg-primary hover:bg-primary-hover">
              Voltar para o inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
