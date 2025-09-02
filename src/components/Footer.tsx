import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Heart, Shield, Zap } from "lucide-react";
import streamerLogo from "@/assets/streamer-hub-logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-background to-background/50 py-16 border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={streamerLogo} alt="Streamer Hub" className="w-12 h-12 rounded-lg shadow-neon" />
              <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Streamer Hub
              </h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              A plataforma exclusiva que conecta streamers brasileiros com seus assinantes mais fiéis. 
              Experiências únicas, conteúdo premium e uma comunidade engajada.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="gaming" size="sm">
                Entrar com Kick
              </Button>
              <Button variant="neon" size="sm">
                Login Twitch
              </Button>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Gamepad2 className="w-3 h-3" />
                Transmissões Privadas
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3 h-3" />
                Sorteio de Filmes
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-3 h-3" />
                Comunidade Exclusiva
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                Conteúdo Seguro
              </li>
            </ul>
          </div>

          {/* Status */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Status</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-gaming-cyan rounded-full"></div>
                <span className="text-muted-foreground">Plataforma Online</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-gaming-purple rounded-full"></div>
                <span className="text-muted-foreground">500+ Assinantes Ativos</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-gaming-blue rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">Live Ativa Agora</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Streamer Hub. Construído com ❤️ para a comunidade brasileira de streaming.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Integração Twitch ✓</span>
              <span>Integração Kick ✓</span>
              <span>Privacidade ✓</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;