import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface MovieHistory {
  id: string;
  title: string;
  timestamp: number;
}

const OverlayRoulette = () => {
  const [selectedMovie, setSelectedMovie] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const checkForUpdates = () => {
      try {
        const lastSelected = localStorage.getItem('roulette_last');
        const spinning = localStorage.getItem('roulette_spinning');
        
        if (lastSelected && lastSelected !== selectedMovie) {
          setSelectedMovie(lastSelected);
        }
        
        setIsSpinning(spinning === 'true');
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
    };

    // Check immediately
    checkForUpdates();

    // Poll for updates every 500ms
    const interval = setInterval(checkForUpdates, 500);

    return () => clearInterval(interval);
  }, [selectedMovie]);

  if (!selectedMovie && !isSpinning) {
    return null; // Transparent when no movie selected
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent p-8">
      <div className="text-center space-y-6">
        {isSpinning ? (
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-spin">
              <Trophy className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="bg-black/80 backdrop-blur-sm rounded-lg px-8 py-4 border border-primary/30">
              <p className="text-white text-2xl font-bold animate-pulse">
                Sorteando filme...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="bg-black/90 backdrop-blur-sm rounded-lg px-8 py-6 border-2 border-primary/50 shadow-glow">
              <p className="text-primary text-sm font-medium mb-2">🎬 FILME SORTEADO</p>
              <h1 className="text-white text-3xl font-bold">
                {selectedMovie}
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverlayRoulette;