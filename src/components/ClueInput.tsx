import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClueInputProps {
  clues: string[];
  onAddClue: (clue: string) => void;
  onRemoveClue: (index: number) => void;
}

export const ClueInput = ({ clues, onAddClue, onRemoveClue }: ClueInputProps) => {
  const [newClue, setNewClue] = useState("");
  const { toast } = useToast();

  const handleAddClue = () => {
    if (newClue.trim()) {
      if (clues.length >= 50) {
        toast({
          title: "Maximum clues reached",
          description: "You can have up to 50 clues per game.",
          variant: "destructive",
        });
        return;
      }
      onAddClue(newClue.trim());
      setNewClue("");
      toast({
        title: "Clue added!",
        description: `"${newClue.trim()}" has been added to your game.`,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddClue();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Your Clues
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter a charades clue..."
            value={newClue}
            onChange={(e) => setNewClue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleAddClue} disabled={!newClue.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {clues.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {clues.length} clue{clues.length !== 1 ? 's' : ''} added
            </p>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {clues.map((clue, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-secondary rounded-md"
                >
                  <span className="text-sm">{clue}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveClue(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};