import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, RotateCcw } from "lucide-react";

interface GameCardProps {
  clue: string;
  onNext: () => void;
  onSkip: () => void;
  canGoNext: boolean;
}

export const GameCard = ({ clue, onNext, onSkip, canGoNext }: GameCardProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleNext = () => {
    setIsRevealed(false);
    onNext();
  };

  const handleSkip = () => {
    setIsRevealed(false);
    onSkip();
  };

  return (
    <Card className="w-full max-w-md mx-auto relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{ background: "var(--game-gradient)" }}
      />
      <CardContent className="p-8 text-center relative z-10">
        {!isRevealed ? (
          <div className="space-y-6">
            <div className="h-32 flex items-center justify-center">
              <EyeOff className="h-16 w-16 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Tap to reveal your charades clue
            </p>
            <Button 
              onClick={handleReveal}
              size="lg"
              className="w-full"
              style={{ background: "var(--game-gradient)" }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Reveal Clue
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-32 flex items-center justify-center">
              <p className="text-2xl font-bold text-center leading-tight">
                {clue}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSkip}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Skip
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canGoNext}
                size="lg"
                className="flex-1 bg-success hover:bg-success/90"
              >
                Got It!
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};