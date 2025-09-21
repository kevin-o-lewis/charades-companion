import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-[var(--game-gradient)] bg-clip-text text-transparent">
            Charades
          </h1>
          <p className="text-muted-foreground">
            Create or join a room to start playing
          </p>
        </div>

        <div className="space-y-4">
          <Card 
            className="cursor-pointer transition-all hover:shadow-[var(--game-shadow)] hover:scale-105 mobile-touch"
            onClick={() => navigate('/create-room')}
          >
            <CardHeader className="text-center pb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-2">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Create Room</CardTitle>
              <CardDescription>
                Set up a new game room and invite others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full mobile-touch bg-[var(--game-gradient)] hover:opacity-90 shadow-[var(--game-shadow)]"
                size="lg"
              >
                Create New Room
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:shadow-[var(--game-shadow)] hover:scale-105 mobile-touch"
            onClick={() => navigate('/join-room')}
          >
            <CardHeader className="text-center pb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mx-auto mb-2">
                <LogIn className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-xl">Join Room</CardTitle>
              <CardDescription>
                Enter a room code to join an existing game
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full mobile-touch border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                size="lg"
              >
                Join Existing Room
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/offline')}
            className="text-muted-foreground hover:text-foreground"
          >
            Play Offline Instead
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;