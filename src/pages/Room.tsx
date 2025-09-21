import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, Settings, Clock, Target, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Room {
  id: string;
  code: string;
  creator_id: string;
  prep_time: number;
  acting_time: number;
  clues_per_team: number;
  status: string;
  current_team: string | null;
  current_phase: string | null;
}

interface Team {
  id: string;
  room_id: string;
  name: string;
  position: number;
  captain_id: string;
  is_ready: boolean;
  total_score: number;
}

const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamName, setTeamName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [currentUserTeam, setCurrentUserTeam] = useState<Team | null>(null);

  const { roomCode, isCreator, settings } = location.state || {};

  useEffect(() => {
    if (!roomId) return;

    // Fetch room data
    const fetchRoomData = async () => {
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) {
        console.error('Error fetching room:', roomError);
        toast({
          title: "Error",
          description: "Room not found.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setRoom(roomData);

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('room_id', roomId)
        .order('position');

      if (!teamsError && teamsData) {
        setTeams(teamsData);
      }
    };

    fetchRoomData();

    // Set up real-time subscriptions
    const roomChannel = supabase
      .channel('room-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setRoom(payload.new as Room);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teams',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTeams(prev => [...prev, payload.new as Team].sort((a, b) => a.position - b.position));
          } else if (payload.eventType === 'UPDATE') {
            setTeams(prev => prev.map(team => 
              team.id === payload.new.id ? payload.new as Team : team
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
    };
  }, [roomId, navigate, toast]);

  const copyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      toast({
        title: "Copied!",
        description: "Room code copied to clipboard",
      });
    }
  };

  const createTeam = async () => {
    if (!teamName.trim() || !room) return;

    setIsJoining(true);
    try {
      const position = teams.length + 1;
      
      const { data: team, error } = await supabase
        .from('teams')
        .insert({
          room_id: room.id,
          name: teamName.trim(),
          position,
          captain_id: 'temp-user-id', // TODO: Replace with actual user ID
          is_ready: false,
          total_score: 0
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentUserTeam(team);
      setTeamName("");

      toast({
        title: "Team Created!",
        description: `You are now captain of "${team.name}"`,
      });

      // Update room status to setup if this is the second team
      if (teams.length === 1) {
        await supabase
          .from('rooms')
          .update({ status: 'setup' })
          .eq('id', room.id);
      }
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="mobile-touch"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Room {roomCode}</h1>
        </div>

        {/* Room Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Room Settings
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyRoomCode}
                className="mobile-touch"
              >
                <Copy className="w-4 h-4 mr-1" />
                {roomCode}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                Prep Time
              </span>
              <Badge variant="secondary">{room.prep_time}s</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                Acting Time
              </span>
              <Badge variant="secondary">{room.acting_time}s</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4" />
                Clues per Team
              </span>
              <Badge variant="secondary">{room.clues_per_team}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Teams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Teams ({teams.length}/2)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className={`p-3 rounded-lg border-2 ${
                  currentUserTeam?.id === team.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{team.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={team.is_ready ? "default" : "secondary"}>
                      {team.is_ready ? "Ready" : "Setting up"}
                    </Badge>
                    {currentUserTeam?.id === team.id && (
                      <Badge variant="outline">You</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {teams.length < 2 && !currentUserTeam && (
              <div className="space-y-3 pt-3 border-t">
                <Label htmlFor="teamName">Create Your Team</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="mobile-touch"
                  maxLength={30}
                />
                <Button
                  onClick={createTeam}
                  disabled={!teamName.trim() || isJoining}
                  className="w-full mobile-touch bg-[var(--game-gradient)] hover:opacity-90"
                >
                  {isJoining ? "Creating..." : "Join as Team Captain"}
                </Button>
              </div>
            )}

            {teams.length === 2 && room.status === 'setup' && (
              <div className="text-center pt-3 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  Both teams have joined! Ready to set up clues.
                </p>
                <Button 
                  className="w-full mobile-touch bg-[var(--game-gradient)] hover:opacity-90"
                  onClick={() => navigate(`/room/${room.id}/clues`)}
                >
                  Continue to Clue Setup
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {room.status === 'waiting' && teams.length === 0 && (
          <Card>
            <CardContent className="text-center py-6">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Waiting for Teams</h3>
              <p className="text-sm text-muted-foreground">
                Share the room code with other players so they can join.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Room;