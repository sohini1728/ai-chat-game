"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import CharacterSelection from "@/components/character-selection";
import { toast } from "sonner";
import { Mode } from "@/lib/characters";

export default function StartGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as Mode) || "defaultMode";
  const [turns, setTurns] = useState(10);
  const [selectedCharacter, setSelectedCharacter] = useState<{ id: string } | null>(null);

  const handleStart = () => {
    if (selectedCharacter) {
      router.push(
        `/chat?mode=${mode}&character=${selectedCharacter.id}&turns=${turns}`
      );
    } else {
      toast.error("Character not selected", {
        description: "Please select a character before starting the game.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-2xl mx-auto px-4 py-8 space-y-6"
    >
      <h1 className="text-4xl font-extrabold text-center tracking-tight mb-8">
        Start Game: <span className="text-primary">{mode}</span>
      </h1>
      <Card className="border-2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Game Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="turns" className="text-lg">Number of Turns: {turns}</Label>
            <Slider
              id="turns"
              min={5}
              max={20}
              step={1}
              value={[turns]}
              onValueChange={(value) => setTurns(value[0])}
              className="my-4"
            />
          </div>
        </CardContent>
      </Card>
      <CharacterSelection mode={mode} onSelect={setSelectedCharacter} />
      <Button onClick={handleStart} className="w-full text-lg py-6 font-semibold">
        Start Game
      </Button>
    </motion.div>
  );
}
