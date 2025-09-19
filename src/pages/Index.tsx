import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClueInput } from "@/components/ClueInput";
import { GameCard } from "@/components/GameCard";
import { GameTimer } from "@/components/GameTimer";
import { ScoreBoard } from "@/components/ScoreBoard";
import { Play, Settings, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [clues, setClues] = useState<string[]>([]);
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [teams, setTeams] = useState([
    { name: "Team A", score: 0 },
    { name: "Team B", score: 0 }
  ]);
  const [gameStarted, setGameStarted] = useState(false);
  const [roundTime, setRoundTime] = useState(60);
  const { toast } = useToast();

  const addClue = (clue: string) => {
    setClues([...clues, clue]);
  };

  const removeClue = (index: number) => {
    setClues(clues.filter((_, i) => i !== index));
  };

  const startGame = () => {
    if (clues.length < 3) {
      toast({
        title: "Need more clues",
        description: "Add at least 3 clues to start the game.",
        variant: "destructive",
      });
      return;
    }
    setGameStarted(true);
    setCurrentClueIndex(0);
  };

  const nextClue = () => {
    if (currentClueIndex < clues.length - 1) {
      setCurrentClueIndex(currentClueIndex + 1);
    } else {
      // Reset to beginning
      setCurrentClueIndex(0);
      toast({
        title: "Round complete!",
        description: "All clues used. Starting over...",
      });
    }
  };

  const skipClue = () => {
    nextClue();
  };

  const onScoreChange = (teamIndex: number, change: number) => {
    setTeams(teams.map((team, index) =>
      index === teamIndex
        ? { ...team, score: Math.max(0, team.score + change) }
        : team
    ));
  };

  const onTimeUp = () => {
    toast({
      title: "Time's up!",
      description: "Switch teams and keep playing!",
    });
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Charades Game
            </h1>
            <p className="text-muted-foreground">
              Add your own clues and start playing!
            </p>
          </div>

          <Tabs defaultValue="clues" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="clues">
                <Settings className="h-4 w-4 mr-2" />
                Setup Clues
              </TabsTrigger>
              <TabsTrigger value="teams">
                <Users className="h-4 w-4 mr-2" />
                Teams
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clues" className="space-y-4">
              <ClueInput
                clues={clues}
                onAddClue={addClue}
                onRemoveClue={removeClue}
              />
              {clues.length >= 3 && (
                <div className="text-center">
                  <Button onClick={startGame} size="lg">
                    <Play className="h-4 w-4 mr-2" />
                    Start Game
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="teams">
              <ScoreBoard teams={teams} onScoreChange={onScoreChange} />
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Game Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Round Duration</label>
                      <select
                        value={roundTime}
                        onChange={(e) => setRoundTime(Number(e.target.value))}
                        className="px-3 py-1 border rounded-md bg-background"
                      >
                        <option value={30}>30 seconds</option>
                        <option value={60}>1 minute</option>
                        <option value={90}>1.5 minutes</option>
                        <option value={120}>2 minutes</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setGameStarted(false)}
            className="mb-4"
          >
            Back to Setup
          </Button>
        </div>

        <GameTimer
          duration={roundTime}
          onTimeUp={onTimeUp}
        />

        <GameCard
          clue={clues[currentClueIndex]}
          onNext={nextClue}
          onSkip={skipClue}
          canGoNext={true}
        />

        <ScoreBoard teams={teams} onScoreChange={onScoreChange} />
      </div>
    </div>
  );
};

export default Index;
