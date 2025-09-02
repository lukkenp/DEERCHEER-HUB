import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Clock } from "lucide-react";

const MovieHistory = () => {
  const watchedMovies = [
    {
      title: "Matrix",
      rating: 9.5,
      date: "2024-08-30",
      duration: "2h 16min",
      genre: "Ficção Científica"
    },
    {
      title: "Parasita",
      rating: 9.8,
      date: "2024-08-28",
      duration: "2h 12min",
      genre: "Thriller"
    },
    {
      title: "Cidade de Deus",
      rating: 9.2,
      date: "2024-08-25",
      duration: "2h 10min",
      genre: "Drama"
    },
    {
      title: "Pulp Fiction",
      rating: 9.0,
      date: "2024-08-22",
      duration: "2h 34min",
      genre: "Crime"
    },
    {
      title: "O Poderoso Chefão",
      rating: 9.7,
      date: "2024-08-20",
      duration: "2h 55min",
      genre: "Drama"
    },
    {
      title: "Vingadores: Ultimato",
      rating: 8.5,
      date: "2024-08-18",
      duration: "3h 1min",
      genre: "Ação"
    }
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return "text-gaming-cyan";
    if (rating >= 8) return "text-gaming-blue";
    if (rating >= 7) return "text-gaming-purple";
    return "text-gaming-pink";
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 9) return "Obra-Prima";
    if (rating >= 8) return "Excelente";
    if (rating >= 7) return "Muito Bom";
    return "Bom";
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Histórico de <span className="bg-gradient-secondary bg-clip-text text-transparent">Filmes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Confira todos os filmes que já assistimos juntos e as avaliações do streamer.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-card border-primary/20 p-4 shadow-card text-center">
              <p className="text-2xl font-bold text-gaming-purple">{watchedMovies.length}</p>
              <p className="text-sm text-muted-foreground">Filmes Assistidos</p>
            </Card>
            <Card className="bg-gradient-card border-primary/20 p-4 shadow-card text-center">
              <p className="text-2xl font-bold text-gaming-blue">
                {(watchedMovies.reduce((acc, movie) => acc + movie.rating, 0) / watchedMovies.length).toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">Nota Média</p>
            </Card>
            <Card className="bg-gradient-card border-primary/20 p-4 shadow-card text-center">
              <p className="text-2xl font-bold text-gaming-cyan">
                {watchedMovies.filter(movie => movie.rating >= 9).length}
              </p>
              <p className="text-sm text-muted-foreground">Obras-Prima</p>
            </Card>
          </div>

          {/* Movies Grid */}
          <div className="grid gap-4">
            {watchedMovies.map((movie, index) => (
              <Card 
                key={index} 
                className="bg-gradient-card border-primary/20 p-6 shadow-card hover:shadow-glow transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {movie.title}
                      </h3>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {movie.genre}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(movie.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {movie.duration}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {getRatingBadge(movie.rating)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className={`w-5 h-5 fill-current ${getRatingColor(movie.rating)}`} />
                      <span className={`text-xl font-bold ${getRatingColor(movie.rating)}`}>
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieHistory;