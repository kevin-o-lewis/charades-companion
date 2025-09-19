import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trophy } from "lucide-react";

interface Team {
  name: string;
  score: number;
}

interface ScoreBoardProps {
  teams: Team[];
  onScoreChange: (teamIndex: number, change: number) => void;
}

export const ScoreBoard = ({ teams, onScoreChange }: ScoreBoardProps) => {
  const maxScore = Math.max(...teams.map(t => t.score));
  const leaders = teams.filter(t => t.score === maxScore && maxScore > 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Score Board
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {teams.map((team, index) => {
          const isLeader = leaders.includes(team) && leaders.length === 1;
          return (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                isLeader
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center gap-2">
                {isLeader && <Trophy className="h-4 w-4 text-primary" />}
                <span className="font-medium">{team.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onScoreChange(index, -1)}
                  disabled={team.score <= 0}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="text-2xl font-bold min-w-[3rem] text-center">
                  {team.score}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onScoreChange(index, 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};