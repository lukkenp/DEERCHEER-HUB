import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gamepad2, Users, Film, History } from "lucide-react";
import { Link } from "react-router-dom";
import streamerLogo from "@/assets/streamer-hub-logo.jpg";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={streamerLogo} alt="Streamer Hub" className="w-10 h-10 rounded-lg shadow-neon" />
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Streamer Hub
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="gap-2" asChild>
            <Link to="/dashboard">
              <Gamepad2 className="w-4 h-4" />
              Live Stream
            </Link>
          </Button>
          <Button variant="ghost" className="gap-2" asChild>
            <Link to="/dashboard">
              <Film className="w-4 h-4" />
              Movie Roulette
            </Link>
          </Button>
          <Button variant="ghost" className="gap-2" asChild>
            <Link to="/dashboard">
              <History className="w-4 h-4" />
              History
            </Link>
          </Button>
          <Button variant="ghost" className="gap-2" asChild>
            <Link to="/dashboard">
              <Users className="w-4 h-4" />
              Community
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button className="bg-gradient-primary hover:shadow-glow transition-all" asChild>
            <Link to="/login">Entrar no Hub</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;