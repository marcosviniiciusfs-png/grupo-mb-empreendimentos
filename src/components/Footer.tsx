import { Phone, MapPin, Clock, Instagram } from "lucide-react";
import grupoMbLogo from "@/assets/grupo-mb-logo.png";
import facebookIcon from "@/assets/facebook.png";

const Footer = () => {
  return (
    <footer id="contato" className="bg-[hsl(var(--header-footer))] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo e Descrição */}
          <div>
            <div className="flex flex-col items-center md:items-start gap-2 mb-4">
              <div className="h-20 w-40 overflow-visible flex items-center justify-center md:justify-start">
                <img
                  src={grupoMbLogo}
                  alt="Grupo MB Empreendimentos"
                  className="h-20 w-auto max-w-none origin-center md:origin-left scale-[2.25]"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://www.facebook.com/profile.php?id=61579785880482#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors"
                aria-label="Facebook do Grupo MB Empreendimentos">
                
                <img src={facebookIcon} alt="Facebook" className="w-8 h-8" />
              </a>
              <a
                href="https://www.instagram.com/vivacapitalconsorcios?igsh=NWx0NHR3dHZsZG12"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors"
                aria-label="Instagram do Grupo MB Empreendimentos">
                
                <Instagram className="w-8 h-8" />
              </a>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-xl font-bold mb-4">Fale Conosco</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-white/90">(41) 99874-6589</p>
                </div>
              </div>
            </div>
          </div>

          {/* Localização e Horário */}
          <div>
            <h3 className="text-xl font-bold mb-4">Localização</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white/90">
                    Curitiba - Paraná, Rua Marechal Deodoro 869, bairro Centro<br />
                    CEP: 80010-010
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Horário de Atendimento</p>
                  <p className="text-white/90">
                    Segunda à Sexta: 8h às 18h<br />
                    Sábado: 8h às 12h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/90 text-sm">
              © 2026 Grupo MB Empreendimentos. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <button className="text-white/90 hover:text-white transition-colors">
                Política de Privacidade
              </button>
              <button className="text-white/90 hover:text-white transition-colors">
                Termos de Uso
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;
