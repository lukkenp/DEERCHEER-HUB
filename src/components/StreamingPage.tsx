import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, MessageSquare, Share2, Volume2 } from "lucide-react";

const StreamingPage = () => {
  const currentViewers = 247;
  const currentMovie = "Matrix";

  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge className="bg-gradient-primary text-primary-foreground mb-4 px-4 py-1">
            🔴 AO VIVO
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Sessão Privada: <span className="bg-gradient-accent bg-clip-text text-transparent">{currentMovie}</span>
          </h2>
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{currentViewers} assinantes assistindo</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>Apenas assinantes</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Video Player Area */}
          <Card className="bg-gradient-card border-primary/20 shadow-glow mb-8">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {/* Placeholder for video stream */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto shadow-glow">
                    <Volume2 className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <p className="text-lg font-semibold mb-2">Stream Ativo</p>
                  <p className="text-muted-foreground">
                    Conecte-se via Jitsi Meet ou Mux para assistir o filme
                  </p>
                  <Button className="mt-4 bg-gradient-primary hover:shadow-glow transition-all">
                    Entrar na Transmissão
                  </Button>
                </div>
              </div>

              {/* Stream Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    HD 1080p
                  </Badge>
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    Audio: PT-BR
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="bg-black/50 border-white/20 text-white">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="bg-black/50 border-white/20 text-white">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Stream Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card border-primary/20 p-6 shadow-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-gaming-purple" />
                Assinantes Online
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
                  <span className="text-sm">@joaogamer123</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-secondary rounded-full"></div>
                  <span className="text-sm">@mariafan</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-accent rounded-full"></div>
                  <span className="text-sm">@pedrocinema</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  +{currentViewers - 3} outros assinantes...
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-card border-primary/20 p-6 shadow-card">
              <h3 className="font-semibold mb-4">Detalhes do Filme</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Título:</span>
                  <span>Matrix</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ano:</span>
                  <span>1999</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duração:</span>
                  <span>2h 16min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gênero:</span>
                  <span>Ficção Científica</span>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-card border-primary/20 p-6 shadow-card">
              <h3 className="font-semibold mb-4">Próximas Sessões</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>Pulp Fiction</span>
                  <Badge variant="outline" className="text-xs">Sexta 20h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Parasita</span>
                  <Badge variant="outline" className="text-xs">Sáb 19h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Vingadores</span>
                  <Badge variant="outline" className="text-xs">Dom 18h</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StreamingPage;