import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Calendar, Clock, Trash2, Download, X } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

interface MovieHistory {
  id: string;
  title: string;
  timestamp: number;
}

const CompactMovieHistory = () => {
  const [movieHistory, setMovieHistory] = useLocalStorage<MovieHistory[]>('movie_history', []);
  const { toast } = useToast();

  const clearHistory = () => {
    setMovieHistory([]);
    toast({
      title: "Histórico limpo!",
      description: "Todo o histórico de filmes foi removido."
    });
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(movieHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'historico-filmes.json';
    link.click();
  };

  const removeFromHistory = (id: string) => {
    setMovieHistory(movieHistory.filter(movie => movie.id !== id));
  };

  const totalMovies = movieHistory.length;
  const uniqueMovies = new Set(movieHistory.map(m => m.title)).size;
  const recentMovies = movieHistory.slice(0, 5).length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-primary">{totalMovies}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-accent">{uniqueMovies}</div>
            <div className="text-xs text-muted-foreground">Únicos</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-gaming-pink">{recentMovies}</div>
            <div className="text-xs text-muted-foreground">Recentes</div>
          </CardContent>
        </Card>
      </div>

      {/* Movies List */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5" />
              Histórico de Filmes
            </CardTitle>
            <div className="flex gap-1">
              <Button 
                onClick={exportHistory} 
                variant="outline" 
                size="sm" 
                disabled={movieHistory.length === 0}
              >
                <Download className="w-3 h-3" />
              </Button>
              <Button 
                onClick={clearHistory} 
                variant="outline" 
                size="sm" 
                disabled={movieHistory.length === 0}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {movieHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Nenhum filme sorteado ainda</p>
              <p className="text-xs">Os filmes sorteados aparecerão aqui</p>
            </div>
          ) : (
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {movieHistory.map((movie, index) => (
                  <div
                    key={movie.id}
                    className="p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-background/70 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{movie.title}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          #{index + 1} - Sorteado
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromHistory(movie.id)}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(movie.timestamp).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(movie.timestamp).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompactMovieHistory;