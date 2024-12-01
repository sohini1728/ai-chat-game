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

const modes = Object.keys(characters).map((mode) => ({
  label: mode.charAt(0).toUpperCase() + mode.slice(1),
  value: mode,
}));

interface CharacterSelectionProps {
  onSelect: (character: Character) => void;
  mode?: Mode;
}

export default function CharacterSelection({ onSelect, mode = "befriend" }: CharacterSelectionProps) {
  const [selectedMode, setSelectedMode] = useState<Mode>(mode);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleModeChange = (mode: Mode) => {
    setSelectedMode(mode);
    setSelectedId(null);
  };

  const handleSelect = (character: Character) => {
    setSelectedId(character.id);
    onSelect(character);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select a Mode and Character</h2>
      <div className="flex flex-wrap mb-4">
        {modes.map((mode) => (
          <button
            key={mode.value}
            className={`px-4 py-2 rounded-lg ${
              selectedMode === mode.value
                ? "bg-primary text-white"
                : "bg-accent text-primary hover:bg-accent-dark"
            }`}
            onClick={() => handleModeChange(mode.value as Mode)}
          >
            {mode.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {characters[selectedMode].map((character, index) => (
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