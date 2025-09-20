import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Save } from "lucide-react";

interface ActTimerProps {
  onSaveRound: (elapsedTime: number) => void;
  onTimeUp: () => void;
}

export const ActTimer = ({ onSaveRound, onTimeUp }: ActTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(180); // 3:00 in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(180);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for timer expiration sound
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D0un0gBjiR1/LNeSsFJHfH8N2QQAoUXbPq66hWFAlFnt/0u3wfBzuP1fPNeSsFJHfH8N2QQAoUXbPq66hWFAlFnt/0u3wfBz');
    
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            if (audioRef.current) {
              audioRef.current.play().catch(() => {
                // Fallback if audio fails
                console.log("Audio playback failed");
              });
            }
            onTimeUp();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, onTimeUp]);

  const handleStart = () => {
    if (!isRunning && timeLeft === 180) {
      setStartTime(180);
    }
    setIsRunning(true);
  };
  
  const handlePause = () => setIsRunning(false);
  
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(180);
    setStartTime(180);
  };

  const handleSave = () => {
    const elapsedTime = startTime - timeLeft;
    onSaveRound(elapsedTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressValue = ((180 - timeLeft) / 180) * 100;
  const isLowTime = timeLeft <= 30 && timeLeft > 0;

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Acting Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={isLowTime ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressValue / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl font-bold ${isLowTime ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-2">
          {!isRunning ? (
            <Button onClick={handleStart} size="lg" disabled={timeLeft === 0}>
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={handlePause} size="lg" variant="secondary">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button onClick={handleReset} size="lg" variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="text-center">
          <Button onClick={handleSave} size="lg" variant="default" disabled={startTime - timeLeft === 0}>
            <Save className="h-4 w-4 mr-2" />
            Save Round
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};