import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LogIn, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const JoinRoom = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const joinRoom = async () => {
    if (!roomCode.trim() || roomCode.length !== 4) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 4-digit room code.",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      const { data: room, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', roomCode.trim())
        .single();

      if (error) {
        toast({
          title: "Room Not Found",
          description: "Please check the room code and try again.",
          variant: "destructive",
        });
        return;
      }

      if (room.status !== 'waiting' && room.status !== 'setup') {
        toast({
          title: "Room Unavailable",
          description: "This room is not accepting new players.",
          variant: "destructive",
        });
        return;
      }

      // Check if room already has 2 teams
      const { data: teams } = await supabase
        .from('teams')
        .select('*')
        .eq('room_id', room.id);

      if (teams && teams.length >= 2) {
        toast({
          title: "Room Full",
          description: "This room already has 2 teams.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Room Found!",
        description: "Joining room...",
      });

      navigate(`/room/${room.id}`, { 
        state: { 
          roomCode: room.code, 
          isCreator: false,
          settings: {
            prepTime: room.prep_time,
            actingTime: room.acting_time,
            cluesPerTeam: room.clues_per_team
          }
        } 
      });
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: "Error",
        description: "Failed to join room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setRoomCode(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      joinRoom();
    }
  };

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
          <h1 className="text-2xl font-bold">Join Room</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mx-auto mb-2">
              <Hash className="w-6 h-6 text-accent" />
            </div>
            <CardTitle>Enter Room Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomCode">4-Digit Room Code</Label>
              <Input
                id="roomCode"
                type="text"
                value={roomCode}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="0000"
                className="text-center text-2xl font-mono tracking-widest mobile-touch"
                maxLength={4}
                autoFocus
              />
              <p className="text-sm text-muted-foreground text-center">
                Ask the room creator for this code
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            onClick={joinRoom}
            disabled={isJoining || roomCode.length !== 4}
            className="w-full mobile-touch bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {isJoining ? "Joining..." : "Join Room"}
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full mobile-touch"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;