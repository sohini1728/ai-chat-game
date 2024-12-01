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
import Link from "next/link";

export default function StartGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as Mode) || "defaultMode";
  const [turns, setTurns] = useState(10);
  const [selectedCharacter, setSelectedCharacter] = useState<{
    id: string;
  } | null>(null);

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
      className="container max-w-5xl mx-auto px-4 py-8 space-y-12"
    >
      <div className="flex items-center justify-between mb-8">
        <Link href="/modes">
          <Button variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Modes
          </Button>
        </Link>
        <h1 className="text-4xl md:text-6xl font-black text-center tracking-wider uppercase">
          <span className="text-primary font-black uppercase">{mode}</span>
        </h1>
      </div>
      <Card className="border-2 border-purple-800/60 bg-purple-950/30 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Game Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="turns" className="text-lg">
              Number of Turns: {turns}
            </Label>
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
      <Button
        onClick={handleStart}
        className="w-full text-lg py-6 font-semibold"
      >
        Start Game
      </Button>
    </motion.div>
  );
}
