import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Calendar, Clock } from "lucide-react";

const watchedMovies = [
  {
    title: "Interstellar",
    genre: "Ficção Científica",
    watchDate: "2024-01-15",
    duration: "169 min",
    rating: 9.5,
  },
  {
    title: "The Dark Knight",
    genre: "Ação",
    watchDate: "2024-01-10",
    duration: "152 min",
    rating: 9.2,
  },
  {
    title: "Inception",
    genre: "Thriller",
    watchDate: "2024-01-05",
    duration: "148 min",
    rating: 9.0,
  },
  {
    title: "Pulp Fiction",
    genre: "Crime",
    watchDate: "2023-12-28",
    duration: "154 min",
    rating: 8.8,
  },
  {
    title: "The Matrix",
    genre: "Ficção Científica",
    watchDate: "2023-12-20",
    duration: "136 min",
    rating: 8.5,
  },
];

const getRatingColor = (rating: number): string => {
  if (rating >= 9) return "bg-gradient-accent text-accent-foreground";
  if (rating >= 8) return "bg-gradient-primary text-primary-foreground";
  if (rating >= 7) return "bg-gradient-secondary text-secondary-foreground";
  return "bg-muted text-muted-foreground";
};

const CompactMovieHistory = () => {
  const totalMovies = watchedMovies.length;
  const averageRating = (
    watchedMovies.reduce((sum, movie) => sum + movie.rating, 0) / totalMovies
  ).toFixed(1);
  const masterpieces = watchedMovies.filter((movie) => movie.rating >= 9).length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-primary">{totalMovies}</div>
            <div className="text-xs text-muted-foreground">Filmes</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-accent">{averageRating}</div>
            <div className="text-xs text-muted-foreground">Média</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-gaming-pink">{masterpieces}</div>
            <div className="text-xs text-muted-foreground">Obras-primas</div>
          </CardContent>
        </Card>
      </div>

      {/* Movies List */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5" />
            Histórico de Filmes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {watchedMovies.map((movie, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-background/70 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{movie.title}</h4>
                      <Badge variant="outline" className="text-xs mt-1">
                        {movie.genre}
                      </Badge>
                    </div>
                    <Badge className={`text-xs ${getRatingColor(movie.rating)}`}>
                      {movie.rating}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(movie.watchDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {movie.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompactMovieHistory;