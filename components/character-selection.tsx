"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { characters, Character, Mode } from "@/lib/characters";

interface CharacterSelectionProps {
  mode: Mode;
  onSelect: (character: Character) => void;
}

export default function CharacterSelection({
  mode,
  onSelect,
}: CharacterSelectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (character: Character) => {
    setSelectedId(character.id);
    onSelect(character);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select a Character</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {characters[mode].map((character, index) => (
          <motion.div
            key={character.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 ${
                selectedId === character.id
                  ? "ring-2 ring-primary"
                  : "hover:bg-accent"
              }`}
              onClick={() => handleSelect(character)}
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-4xl mr-2">{character.emoji}</span>
                  {character.name}
                </CardTitle>
                <CardDescription>{character.description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
