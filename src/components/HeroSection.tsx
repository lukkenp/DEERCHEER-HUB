import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Users, Film, Trophy } from "lucide-react";
import heroImage from "@/assets/hero-streaming.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Sua Comunidade,
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Sua Experiência
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A plataforma exclusiva para assinantes. Assista filmes em sessões privadas, 
            participe de sorteios interativos e conecte-se com sua comunidade favorita.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all text-lg px-8 py-6"
            >
              <Play className="w-5 h-5 mr-2" />
              Entrar na Live Privada
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/30 hover:bg-primary/10 text-lg px-8 py-6"
            >
              <Film className="w-5 h-5 mr-2" />
              Ver Sorteio de Filmes
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="bg-gradient-card border-primary/20 p-6 shadow-card backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Users className="w-8 h-8 text-gaming-purple" />
                <span className="text-3xl font-bold">500+</span>
              </div>
              <p className="text-muted-foreground">Assinantes Ativos</p>
            </Card>

            <Card className="bg-gradient-card border-primary/20 p-6 shadow-card backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Film className="w-8 h-8 text-gaming-blue" />
                <span className="text-3xl font-bold">120+</span>
              </div>
              <p className="text-muted-foreground">Filmes Assistidos</p>
            </Card>

            <Card className="bg-gradient-card border-primary/20 p-6 shadow-card backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Trophy className="w-8 h-8 text-gaming-cyan" />
                <span className="text-3xl font-bold">4.9★</span>
              </div>
              <p className="text-muted-foreground">Avaliação Média</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Animated Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;