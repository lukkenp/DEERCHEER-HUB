import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Shuffle, X, Download, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Props {
  silentMode?: boolean;
}

interface MovieHistory {
  id: string;
  title: string;
  timestamp: number;
}

const CompactMovieRoulette = ({ silentMode = false }: Props) => {
  const [movies, setMovies] = useLocalStorage<string[]>('roulette_movies', []);
  const [newMovie, setNewMovie] = useState("");
  const [selectedMovie, setSelectedMovie] = useLocalStorage<string | null>('roulette_last', null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [movieHistory, setMovieHistory] = useLocalStorage<MovieHistory[]>('movie_history', []);
  const { toast } = useToast();

  const addMovie = () => {
    if (newMovie.trim() && !movies.includes(newMovie.trim())) {
      setMovies([...movies, newMovie.trim()]);
      setNewMovie("");
      
      if (!silentMode) {
        toast({
          title: "Filme adicionado!",
          description: `"${newMovie.trim()}" foi adicionado ao sorteio.`,
        });
      }
    }
  };

  const removeMovie = (movieToRemove: string) => {
    setMovies(movies.filter(movie => movie !== movieToRemove));
  };

  const clearMovies = () => {
    setMovies([]);
    setSelectedMovie(null);
    localStorage.removeItem('roulette_spinning');
    
    if (!silentMode) {
      toast({
        title: "Lista limpa!",
        description: "Todos os filmes foram removidos."
      });
    }
  };

  const exportMovies = () => {
    const dataStr = JSON.stringify(movies, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'filmes-roleta.json';
    link.click();
  };

  const importMovies = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (Array.isArray(imported)) {
            setMovies([...new Set([...movies, ...imported])]);
            if (!silentMode) {
              toast({
                title: "Filmes importados!",
                description: `${imported.length} filmes foram adicionados.`
              });
            }
          }
        } catch (error) {
          if (!silentMode) {
            toast({
              title: "Erro na importação",
              description: "Arquivo inválido.",
              variant: "destructive"
            });
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const spinRoulette = () => {
    if (movies.length === 0) {
      if (!silentMode) {
        toast({
          title: "Adicione filmes",
          description: "Você precisa adicionar pelo menos um filme para sortear.",
          variant: "destructive",
        });
      }
      return;
    }

    setIsSpinning(true);
    localStorage.setItem('roulette_spinning', 'true');
    
    // Global hotkey R for spin
    document.addEventListener('keydown', function spinHotkey(e) {
      if (e.key.toLowerCase() === 'r' && !isSpinning) {
        e.preventDefault();
        document.removeEventListener('keydown', spinHotkey);
      }
    });
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * movies.length);
      const winner = movies[randomIndex];
      setSelectedMovie(winner);
      setIsSpinning(false);
      localStorage.removeItem('roulette_spinning');
      
      // Add to history
      const historyEntry: MovieHistory = {
        id: Date.now().toString(),
        title: winner,
        timestamp: Date.now()
      };
      setMovieHistory([historyEntry, ...movieHistory.slice(0, 49)]); // Keep last 50

      if (!silentMode) {
        toast({
          title: "🎬 Filme sorteado!",
          description: `O filme escolhido é: "${winner}"`,
        });
      }
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Add Movie Section */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Filme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Nome do filme..."
              value={newMovie}
              onChange={(e) => setNewMovie(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMovie()}
              className="text-sm"
            />
            <Button 
              onClick={addMovie} 
              size="sm"
              className="bg-gradient-primary hover:shadow-glow transition-all"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-1">
            <Button onClick={exportMovies} variant="outline" size="sm" disabled={movies.length === 0}>
              <Download className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm" asChild>
              <label className="cursor-pointer">
                <Upload className="w-3 h-3" />
                <input
                  type="file"
                  accept=".json"
                  onChange={importMovies}
                  className="hidden"
                />
              </label>
            </Button>
            <Button onClick={clearMovies} variant="outline" size="sm" disabled={movies.length === 0}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roulette Section */}
      <Card className="bg-gradient-card border-border">
        <CardContent className="pt-6 space-y-4">
          <div className="text-center">
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4 ${
              isSpinning ? 'animate-spin' : ''
            }`}>
              <Shuffle className="w-8 h-8 text-primary-foreground" />
            </div>
            
            {selectedMovie && !isSpinning && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Filme selecionado:</p>
                <Badge variant="outline" className="text-sm px-3 py-1 bg-gradient-accent">
                  {selectedMovie}
                </Badge>
              </div>
            )}
            
            {isSpinning && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Sorteando filme...
              </p>
            )}
          </div>
          
          <Button 
            onClick={spinRoulette} 
            disabled={isSpinning || movies.length === 0}
            className="w-full bg-gradient-secondary hover:shadow-glow transition-all"
          >
            {isSpinning ? 'Sorteando...' : 'Sortear Filme (R)'}
          </Button>
        </CardContent>
      </Card>

      {/* Movies List */}
      {movies.length > 0 && (
        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Filmes no Sorteio ({movies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {movies.map((movie, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-background/50">
                  <span className="text-sm">{movie}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeMovie(movie)}
                    className="h-6 w-6 p-0 hover:bg-destructive/20"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompactMovieRoulette;