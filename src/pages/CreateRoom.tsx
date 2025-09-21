import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Settings, Users, Clock, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreateRoom = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [settings, setSettings] = useState({
    prepTime: 60,
    actingTime: 180,
    cluesPerTeam: 4,
  });

  const generateRoomCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const createRoom = async () => {
    setIsCreating(true);
    try {
      const roomCode = generateRoomCode();
      
      const { data: room, error } = await supabase
        .from('rooms')
        .insert({
          code: roomCode,
          creator_id: 'temp-user-id', // TODO: Replace with actual user ID when auth is implemented
          prep_time: settings.prepTime,
          acting_time: settings.actingTime,
          clues_per_team: settings.cluesPerTeam,
          status: 'waiting'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Room Created!",
        description: `Room code: ${roomCode}`,
      });

      navigate(`/room/${room.id}`, { 
        state: { 
          roomCode, 
          isCreator: true,
          settings 
        } 
      });
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
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
          <h1 className="text-2xl font-bold">Create Room</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Game Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prepTime" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Preparation Time (seconds)
              </Label>
              <Input
                id="prepTime"
                type="number"
                value={settings.prepTime}
                onChange={(e) => setSettings(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 60 }))}
                min="30"
                max="300"
                className="mobile-touch"
              />
              <p className="text-sm text-muted-foreground">
                Time for teams to read and understand the clue
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actingTime" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Acting Time (seconds)
              </Label>
              <Input
                id="actingTime"
                type="number"
                value={settings.actingTime}
                onChange={(e) => setSettings(prev => ({ ...prev, actingTime: parseInt(e.target.value) || 180 }))}
                min="60"
                max="600"
                className="mobile-touch"
              />
              <p className="text-sm text-muted-foreground">
                Time for teams to act out the clue
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cluesPerTeam" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Clues per Team
              </Label>
              <Input
                id="cluesPerTeam"
                type="number"
                value={settings.cluesPerTeam}
                onChange={(e) => setSettings(prev => ({ ...prev, cluesPerTeam: parseInt(e.target.value) || 4 }))}
                min="2"
                max="20"
                className="mobile-touch"
              />
              <p className="text-sm text-muted-foreground">
                Recommended: 2x the number of players per team
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            onClick={createRoom}
            disabled={isCreating}
            className="w-full mobile-touch bg-[var(--game-gradient)] hover:opacity-90 shadow-[var(--game-shadow)]"
            size="lg"
          >
            {isCreating ? "Creating Room..." : "Create Room"}
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

export default CreateRoom;