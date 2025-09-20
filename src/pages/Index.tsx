import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrepTimer } from "@/components/PrepTimer";
import { ActTimer } from "@/components/ActTimer";
import { ScoreBoard } from "@/components/ScoreBoard";
import { Play, RotateCcw, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Team {
  name: string;
  rounds: number[];
  totalScore: number;
}

type GamePhase = 'setup' | 'preparation' | 'acting' | 'results';

const Index = () => {
  const [teams, setTeams] = useState<Team[]>([
    { name: "Team A", rounds: [], totalScore: 0 },
    { name: "Team B", rounds: [], totalScore: 0 }
  ]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [roundNumber, setRoundNumber] = useState(1);
  const { toast } = useToast();

  const updateTeamName = (index: number, name: string) => {
    setTeams(teams.map((team, i) => 
      i === index ? { ...team, name } : team
    ));
  };

  const startGame = () => {
    if (teams.some(team => !team.name.trim())) {
      toast({
        title: "Team names required",
        description: "Please enter names for both teams.",
        variant: "destructive",
      });
      return;
    }
    setGamePhase('preparation');
    setCurrentTeam(0);
    setRoundNumber(1);
  };

  const skipToActing = () => {
    setGamePhase('acting');
  };

  const saveRound = (elapsedTime: number) => {
    const updatedTeams = teams.map((team, index) => {
      if (index === currentTeam) {
        const newRounds = [...team.rounds, elapsedTime];
        const newTotalScore = newRounds.reduce((sum, time) => sum + time, 0);
        return {
          ...team,
          rounds: newRounds,
          totalScore: newTotalScore
        };
      }
      return team;
    });

    setTeams(updatedTeams);
    
    // Switch to next team's preparation phase
    const nextTeam = (currentTeam + 1) % 2;
    setCurrentTeam(nextTeam);
    setGamePhase('preparation');
    setRoundNumber(roundNumber + 1);

    toast({
      title: "Round saved!",
      description: `${teams[currentTeam].name} completed in ${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')}. Now ${teams[nextTeam].name}'s turn!`,
    });
  };

  const onPrepTimeUp = () => {
    toast({
      title: "Preparation time up!",
      description: "Moving to acting phase.",
    });
    setGamePhase('acting');
  };

  const onActTimeUp = () => {
    toast({
      title: "Acting time up!",
      description: "Time expired! Save the round to continue.",
      variant: "destructive",
    });
  };

  const viewResults = () => {
    setGamePhase('results');
  };

  const startNewGame = () => {
    setTeams([
      { name: teams[0].name, rounds: [], totalScore: 0 },
      { name: teams[1].name, rounds: [], totalScore: 0 }
    ]);
    setCurrentTeam(0);
    setGamePhase('preparation');
    setRoundNumber(1);
  };

  const backToSetup = () => {
    setGamePhase('setup');
  };

  // Setup Phase
  if (gamePhase === 'setup') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Charades Companion
            </h1>
            <p className="text-muted-foreground">
              Set up your teams and start playing!
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team1">Team 1 Name</Label>
                <Input
                  id="team1"
                  value={teams[0].name}
                  onChange={(e) => updateTeamName(0, e.target.value)}
                  placeholder="Enter team 1 name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team2">Team 2 Name</Label>
                <Input
                  id="team2"
                  value={teams[1].name}
                  onChange={(e) => updateTeamName(1, e.target.value)}
                  placeholder="Enter team 2 name"
                />
              </div>

              <div className="text-center pt-4">
                <Button onClick={startGame} size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Start Game
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Each team alternates turns acting out clues</li>
              <li>• Preparation phase: 1:00 to prepare (can skip early)</li>
              <li>• Acting phase: 3:00 to act out the clue</li>
              <li>• Lower total time wins!</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Results Phase
  if (gamePhase === 'results') {
    const winner = teams.reduce((prev, current) => {
      if (current.totalScore === 0) return prev;
      if (prev.totalScore === 0) return current;
      return current.totalScore < prev.totalScore ? current : prev;
    });

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Game Results</h1>
            {winner.totalScore > 0 && (
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
                <Trophy className="h-8 w-8" />
                {winner.name} Wins!
              </div>
            )}
          </div>

          <ScoreBoard teams={teams} />

          <div className="flex justify-center gap-4">
            <Button onClick={startNewGame} size="lg">
              <Play className="h-4 w-4 mr-2" />
              New Game
            </Button>
            <Button onClick={backToSetup} size="lg" variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Back to Setup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Game Phase (Preparation or Acting)
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-primary">
            {teams[currentTeam].name}
          </div>
          <div className="text-lg text-muted-foreground">
            Round {Math.ceil(roundNumber / 2)} • {gamePhase === 'preparation' ? 'Preparation Phase' : 'Acting Phase'}
          </div>
        </div>

        {gamePhase === 'preparation' && (
          <PrepTimer 
            onSkipToActing={skipToActing}
            onTimeUp={onPrepTimeUp}
          />
        )}

        {gamePhase === 'acting' && (
          <ActTimer 
            onSaveRound={saveRound}
            onTimeUp={onActTimeUp}
          />
        )}

        <ScoreBoard teams={teams} currentTeam={currentTeam} />

        <div className="flex justify-center gap-4">
          <Button onClick={viewResults} variant="outline">
            View Results
          </Button>
          <Button onClick={backToSetup} variant="outline">
            Back to Setup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;