import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Volume2, Share2, Users, Eye, Settings, Maximize2, PanelLeftClose, PanelLeftOpen, Copy, Monitor } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CompactMovieRoulette from "./CompactMovieRoulette";
import CompactMovieHistory from "./CompactMovieHistory";

const StreamingDashboard = () => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useLocalStorage('dashboard_panel_collapsed', false);
  const [isStudioMode, setIsStudioMode] = useLocalStorage('dashboard_studio_mode', false);
  const [silentMode, setSilentMode] = useLocalStorage('dashboard_silent_mode', false);
  const { toast } = useToast();

  const copyOverlayUrl = useCallback(() => {
    const overlayUrl = `${window.location.origin}/overlay/roulette`;
    navigator.clipboard.writeText(overlayUrl);
    
    if (!silentMode) {
      toast({
        title: "Link copiado!",
        description: "URL do overlay copiada para área de transferência"
      });
    }
  }, [silentMode, toast]);

  const togglePanel = useCallback(() => {
    setIsPanelCollapsed(!isPanelCollapsed);
  }, [isPanelCollapsed, setIsPanelCollapsed]);

  // Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'p':
          e.preventDefault();
          togglePanel();
          break;
        case 'f':
          e.preventDefault();
          // Toggle fullscreen would go here
          break;
        case 'h':
          e.preventDefault();
          setIsStudioMode(!isStudioMode);
          break;
        case 'escape':
          e.preventDefault();
          if (isStudioMode) setIsStudioMode(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePanel, isStudioMode, setIsStudioMode]);
  return (
    <div className={`flex h-screen bg-background ${isStudioMode ? 'studio-mode' : ''}`}>
      <PanelGroup direction="horizontal" className="h-full">
        {/* Main Streaming Area */}
        <Panel defaultSize={isPanelCollapsed ? 100 : 70} minSize={50}>
          <div className="h-full p-4 space-y-4">
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={copyOverlayUrl}
                  className="gap-2"
                >
                  <Monitor className="w-4 h-4" />
                  Overlay OBS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={togglePanel}
                  className="gap-2"
                >
                  {isPanelCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                  {isPanelCollapsed ? 'Mostrar' : 'Ocultar'} Painel
                </Button>
                <Button 
                  variant={isStudioMode ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setIsStudioMode(!isStudioMode)}
                >
                  Modo Estúdio
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
        </Panel>

        {/* Sidebar Panel */}
        {!isPanelCollapsed && (
          <>
            <PanelResizeHandle className="w-2 bg-border hover:bg-border/80 transition-colors" />
            <Panel defaultSize={30} minSize={20} maxSize={50}>
              <div className="h-full border-l border-border bg-card p-4">
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
                      <CompactMovieRoulette silentMode={silentMode} />
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
            </Panel>
          </>
        )}
      </PanelGroup>

      {/* Hotkeys Help (only show in studio mode) */}
      {isStudioMode && (
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs text-white/80 space-y-1">
          <div><kbd className="bg-white/20 px-1 rounded">P</kbd> Toggle painel</div>
          <div><kbd className="bg-white/20 px-1 rounded">H</kbd> Modo estúdio</div>
          <div><kbd className="bg-white/20 px-1 rounded">ESC</kbd> Sair modo estúdio</div>
        </div>
      )}
    </div>
  );
};

export default StreamingDashboard;