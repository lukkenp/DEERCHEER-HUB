import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Shuffle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CompactMovieRoulette = () => {
  const [movies, setMovies] = useState<string[]>([]);
  const [newMovie, setNewMovie] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const { toast } = useToast();

  const addMovie = () => {
    if (newMovie.trim() && !movies.includes(newMovie.trim())) {
      setMovies([...movies, newMovie.trim()]);
      setNewMovie("");
      toast({
        title: "Filme adicionado!",
        description: `"${newMovie.trim()}" foi adicionado ao sorteio.`,
      });
    }
  };

  const removeMovie = (movieToRemove: string) => {
    setMovies(movies.filter(movie => movie !== movieToRemove));
  };

  const spinRoulette = () => {
    if (movies.length === 0) {
      toast({
        title: "Adicione filmes",
        description: "Você precisa adicionar pelo menos um filme para sortear.",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * movies.length);
      const winner = movies[randomIndex];
      setSelectedMovie(winner);
      setIsSpinning(false);
      
      toast({
        title: "🎬 Filme sorteado!",
        description: `O filme escolhido é: "${winner}"`,
      });
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
            {isSpinning ? 'Sorteando...' : 'Sortear Filme'}
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