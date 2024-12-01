"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { characters, Character, Mode } from "@/lib/characters";

const modes = Object.keys(characters).map((mode) => ({
  label: mode.charAt(0).toUpperCase() + mode.slice(1),
  value: mode,
}));

interface CharacterSelectionProps {
  onSelect: (character: Character) => void;
  mode?: Mode;
}

const ModeSelector = ({
  selectedMode,
  onSelect,
}: {
  selectedMode: Mode;
  onSelect: (mode: Mode) => void;
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
    {modes.map((mode) => (
      <button
        key={mode.value}
        className={`relative p-4 rounded-xl transition-all duration-200 ${
          selectedMode === mode.value
            ? "bg-primary text-white scale-105 shadow-lg"
            : "bg-accent hover:bg-accent/80 dark:bg-gray-800 dark:hover:bg-gray-700"
        }`}
        onClick={() => onSelect(mode.value as Mode)}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">{mode.label}</span>
        </div>
        {selectedMode === mode.value && (
          <motion.div
            layoutId="activeMode"
            className="absolute inset-0 rounded-xl border-2 border-primary"
            initial={false}
            transition={{ type: "spring", duration: 0.6 }}
          />
        )}
      </button>
    ))}
  </div>
);

export default function CharacterSelection({
  onSelect,
  mode = "befriend",
}: CharacterSelectionProps) {
  const [selectedMode, setSelectedMode] = useState<Mode>(mode);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Select first character by default
    const firstCharacter = characters[selectedMode][0];
    if (firstCharacter) {
      setSelectedId(firstCharacter.id);
      onSelect(firstCharacter);
    }
  }, [selectedMode, onSelect]);

  const handleModeChange = (mode: Mode) => {
    setSelectedMode(mode);
    setSelectedId(null);
  };

  const handleSelect = (character: Character) => {
    setSelectedId(character.id);
    onSelect(character);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Select a Mode and Character</h2>
      <ModeSelector selectedMode={selectedMode} onSelect={handleModeChange} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {characters[selectedMode].map((character, index) => (
          <motion.div
            key={character.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CardContainer>
              <CardBody
                className={`bg-gray-50 relative group/card dark:hover:shadow-2xl dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-6 border ${
                  selectedId === character.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleSelect(character)}
              >
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  {character.name}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  {character.description}
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <Image
                    src={character.image}
                    height={400}
                    width={400}
                    className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                    alt={character.name}
                  />
                </CardItem>
                {/* <CardItem
                  translateZ={20}
                  as="button"
                  onClick={() => handleSelect(character)}
                  className="px-4 py-2 mt-4 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  Select Character
                </CardItem> */}
              </CardBody>
            </CardContainer>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
