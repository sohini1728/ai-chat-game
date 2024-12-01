"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { characters, Character, Mode } from "@/lib/characters";
import SurpriseMeCard from "@/components/SurpriseMeCard";

interface CharacterSelectionProps {
  onSelect: (character: Character) => void;
  mode: Mode | "surprise";
}

export default function CharacterSelection({
  onSelect,
  mode,
}: CharacterSelectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "surprise") {
      // Select first character by default
      const firstCharacter = characters[mode][0];
      if (firstCharacter) {
        setSelectedId(firstCharacter.id);
        onSelect(firstCharacter);
      }
    }
  }, [mode, onSelect]);

  const handleSelect = (character: Character) => {
    setSelectedId(character.id);
    onSelect(character);
  };

  if (mode === "surprise") {
    return (
      <SurpriseMeCard
        onSelect={(character) => {
          // Handle surprise me selection
          const randomMode = Object.keys(characters)[Math.floor(Math.random() * Object.keys(characters).length)];
          const randomCharacter = characters[randomMode][Math.floor(Math.random() * characters[randomMode].length)];
          onSelect(randomCharacter);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Choose Your Character</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {characters[mode].map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardContainer>
                <CardBody
                  className={`relative group/card border-purple-800/60 bg-purple-950/30 backdrop-blur-sm dark:hover:shadow-2xl w-auto h-auto rounded-xl p-6 border ${
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
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}