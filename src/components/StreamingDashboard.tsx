import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Volume2, Share2, Users, Eye, Settings, Maximize2 } from "lucide-react";
import CompactMovieRoulette from "./CompactMovieRoulette";
import CompactMovieHistory from "./CompactMovieHistory";

const StreamingDashboard = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Main Streaming Area - 70% width */}
      <div className="flex-1 p-4 space-y-4">
        {/* Stream Info Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Noite do Cinema - Clássicos</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>AO VIVO</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>1,247 espectadores</span>
              </div>
              <Badge variant="outline" className="bg-gradient-primary text-primary-foreground border-primary">
                Filme em Votação
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Video Player Area */}
        <Card className="flex-1 bg-gradient-card border-border shadow-card">
          <CardContent className="p-0 h-full">
            <div className="relative h-full bg-black rounded-lg overflow-hidden">
              {/* Video Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/20 to-gaming-blue/20 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                    <Play className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Stream de Filmes
                    </h3>
                    <p className="text-white/70">
                      Área de transmissão - Conecte sua câmera ou software de streaming
                    </p>
                  </div>
                </div>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <span className="text-white/80 text-sm">02:35:42</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600 text-white">
                      <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                      REC
                    </Badge>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - 30% width */}
      <div className="w-96 border-l border-border bg-card p-4">
        <Tabs defaultValue="roulette" className="h-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="roulette" className="text-xs">
              🎲 Roleta
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              📚 Histórico
            </TabsTrigger>
            <TabsTrigger value="community" className="text-xs">
              👥 Chat
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="roulette" className="h-full m-0">
              <CompactMovieRoulette />
            </TabsContent>

            <TabsContent value="history" className="h-full m-0">
              <CompactMovieHistory />
            </TabsContent>

            <TabsContent value="community" className="h-full m-0">
              <Card className="h-full bg-gradient-card border-border">
                <CardContent className="p-4 h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Chat da Comunidade</h3>
                      <p className="text-muted-foreground text-sm">
                        Funcionalidade em desenvolvimento
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Em breve: chat ao vivo, enquetes e interação com viewers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default StreamingDashboard;