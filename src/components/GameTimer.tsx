import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

interface GameTimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
}

export const GameTimer = ({ duration, onTimeUp, onStart, onPause, onReset }: GameTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp]);

  const handleStart = () => {
    setIsRunning(true);
    onStart?.();
  };

  const handlePause = () => {
    setIsRunning(false);
    onPause?.();
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    onReset?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;
  const isLowTime = timeLeft <= 10;

  return (
    <Card className="w-full">
      <CardContent className="p-6 text-center space-y-4">
        <div className="relative">
          <div 
            className={`text-4xl font-bold transition-colors duration-300 ${
              isLowTime ? 'text-destructive animate-pulse' : 'text-primary'
            }`}
          >
            {formatTime(timeLeft)}
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-linear ${
                isLowTime ? 'bg-destructive' : 'bg-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex gap-2 justify-center">
          {!isRunning ? (
            <Button onClick={handleStart} disabled={timeLeft === 0}>
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};