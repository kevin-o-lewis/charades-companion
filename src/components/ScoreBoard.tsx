import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Clock } from "lucide-react";

interface Team {
  name: string;
  rounds: number[];
  totalScore: number;
}

interface ScoreBoardProps {
  teams: Team[];
  currentTeam?: number;
}

export const ScoreBoard = ({ teams, currentTeam }: ScoreBoardProps) => {
  const minScore = Math.min(...teams.map(t => t.totalScore).filter(score => score > 0));
  const leaders = teams.filter(t => t.totalScore === minScore && t.totalScore > 0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          const isCurrentTeam = currentTeam === index;
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all ${
                isCurrentTeam
                  ? 'border-primary bg-primary/10'
                  : isLeader
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isLeader && <Trophy className="h-4 w-4 text-primary" />}
                  <span className={`font-medium ${isCurrentTeam ? 'text-primary font-bold' : ''}`}>
                    {team.name}
                  </span>
                  {isCurrentTeam && <span className="text-sm text-primary">(Current Turn)</span>}
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {team.totalScore > 0 ? formatTime(team.totalScore) : '-'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Time {team.rounds.length > 0 && `(${team.rounds.length} rounds)`}
                  </div>
                </div>
              </div>
              
              {team.rounds.length > 0 && (
                <div className="space-y-1">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Round Times:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {team.rounds.map((time, roundIndex) => (
                      <span
                        key={roundIndex}
                        className="text-xs bg-muted px-2 py-1 rounded"
                      >
                        R{roundIndex + 1}: {formatTime(time)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {teams.some(t => t.totalScore > 0) && (
          <div className="text-center text-sm text-muted-foreground pt-2 border-t">
            Lower total time wins!
          </div>
        )}
      </CardContent>
    </Card>
  );
};