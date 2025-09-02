import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Film, Plus, Shuffle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MovieRoulette = () => {
  const [movies, setMovies] = useState([
    "O Poderoso Chefão",
    "Pulp Fiction", 
    "Matrix",
    "Cidade de Deus",
    "Parasita",
    "Vingadores: Ultimato"
  ]);
  const [newMovie, setNewMovie] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const { toast } = useToast();

  const addMovie = () => {
    if (newMovie.trim() && !movies.includes(newMovie.trim())) {
      setMovies([...movies, newMovie.trim()]);
      setNewMovie("");
      toast({
        title: "Filme adicionado!",
        description: `"${newMovie}" foi adicionado ao sorteio.`,
      });
    }
  };

  const spinRoulette = () => {
    if (movies.length === 0) return;
    
    setIsSpinning(true);
    setSelectedMovie("");
    
    // Simulate spinning animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setSelectedMovie(movies[randomIndex]);
      setIsSpinning(false);
      toast({
        title: "🎬 Filme Sorteado!",
        description: `O filme escolhido foi: "${movies[randomIndex]}"`,
      });
    }, 2000);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sorteio de <span className="bg-gradient-accent bg-clip-text text-transparent">Filmes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sugira seus filmes favoritos e deixe a sorte decidir o que assistir na próxima sessão!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Add Movie Section */}
          <Card className="bg-gradient-card border-primary/20 p-6 mb-8 shadow-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-gaming-purple" />
              Sugerir Filme
            </h3>
            <div className="flex gap-3">
              <Input
                placeholder="Digite o nome do filme..."
                value={newMovie}
                onChange={(e) => setNewMovie(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addMovie()}
                className="flex-1 bg-background/50 border-primary/20"
              />
              <Button onClick={addMovie} className="bg-gradient-primary hover:shadow-glow transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </Card>

          {/* Roulette Wheel */}
          <Card className="bg-gradient-card border-primary/20 p-8 mb-8 shadow-card text-center">
            <div className={`relative mx-auto mb-6 ${isSpinning ? 'animate-spin' : ''}`}>
              <div className="w-48 h-48 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center">
                {selectedMovie ? (
                  <div className="text-center">
                    <Film className="w-12 h-12 mx-auto mb-2 text-primary-foreground" />
                    <p className="font-semibold text-primary-foreground text-sm">{selectedMovie}</p>
                  </div>
                ) : (
                  <Zap className="w-16 h-16 text-primary-foreground" />
                )}
              </div>
            </div>

            <Button
              onClick={spinRoulette}
              disabled={isSpinning || movies.length === 0}
              size="lg"
              className="bg-gradient-accent hover:shadow-glow transition-all text-lg px-8"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              {isSpinning ? "Girando..." : "Sortear Filme"}
            </Button>

            {selectedMovie && !isSpinning && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="text-lg font-semibold text-gaming-purple mb-2">🏆 Filme Sorteado:</h4>
                <p className="text-2xl font-bold">{selectedMovie}</p>
              </div>
            )}
          </Card>

          {/* Movies List */}
          <Card className="bg-gradient-card border-primary/20 p-6 shadow-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Film className="w-5 h-5 text-gaming-blue" />
              Filmes no Sorteio ({movies.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {movies.map((movie, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 px-3 py-1"
                >
                  {movie}
                </Badge>
              ))}
            </div>
            {movies.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                Nenhum filme adicionado ainda. Seja o primeiro a sugerir!
              </p>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MovieRoulette;