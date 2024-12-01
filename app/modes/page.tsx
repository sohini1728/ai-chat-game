"use client";

import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Smile,
  Skull,
  Heart,
  Target,
  Search,
  Puzzle,
  Palette,
  Compass,
  Zap,
  Book,
  BrainCircuit,
} from "lucide-react";
import Link from "next/link";
import SurpriseMeCard from "@/components/SurpriseMeCard";

export default function Home() {
  const words = [
    {
      text: "SIMUCHAT",
      className: "text-7xl font-black tracking-wider text-white",
    },
  ];

  const gameModes = [
    {
      name: "Befriend",
      description: "Try to make a new friend!",
      href: "/start?mode=befriend",
      icon: <Smile className="h-8 w-8" />,
    },
    {
      name: "Escape Murderer",
      description: "Can you outsmart a killer?",
      href: "/start?mode=escape",
      icon: <Skull className="h-8 w-8" />,
    },
    {
      name: "Romance",
      description: "Find your AI soulmate",
      href: "/start?mode=romance",
      icon: <Heart className="h-8 w-8 fill-current" />,
    },
    {
      name: "Debate",
      description: "Engage in a battle of wits!",
      href: "/start?mode=debate",
      icon: <Target className="h-8 w-8" />,
    },
    {
      name: "Investigate",
      description: "Solve the mystery!",
      href: "/start?mode=investigate",
      icon: <Search className="h-8 w-8" />,
    },
    {
      name: "Solve",
      description: "Crack the code!",
      href: "/start?mode=solve",
      icon: <Puzzle className="h-8 w-8" />,
    },
    {
      name: "Create",
      description: "Unleash your creativity!",
      href: "/start?mode=create",
      icon: <Palette className="h-8 w-8" />,
    },
    {
      name: "Explore",
      description: "Embark on an adventure!",
      href: "/start?mode=explore",
      icon: <Compass className="h-8 w-8" />,
    },
    {
      name: "Survive",
      description: "Stay alive!",
      href: "/start?mode=survive",
      icon: <Zap className="h-8 w-8" />,
    },
    {
      name: "Thrill",
      description: "Feel the rush!",
      href: "/start?mode=thrill",
      icon: <Book className="h-8 w-8" />,
    },
    {
      name: "Mystery",
      description: "Unravel the enigma!",
      href: "/start?mode=mystery",
      icon: <BrainCircuit className="h-8 w-8" />,
    },
    {
      name: "Dream",
      description: "Enter the subconscious!",
      href: "/start?mode=dream",
      icon: <BrainCircuit className="h-8 w-8" />,
    },
  ];

  const handleSurpriseMe = () => {
    const randomMode = gameModes[Math.floor(Math.random() * gameModes.length)];
    window.location.href = randomMode.href;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-6xl w-full space-y-12 relative">
        <div className="text-center space-y-6 relative">
          <TypewriterEffectSmooth
            words={words}
            className="flex justify-center items-center"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 px-4">
          {gameModes.map((mode) => (
            <Card
              key={mode.name}
              className="group bg-black/40 border-purple-500/20 backdrop-blur-sm hover:bg-black/60 transition-all duration-300 hover:scale-105 hover:border-purple-500/40"
            >
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-purple-100 group-hover:text-purple-300 transition-colors">
                      {mode.name}
                    </h2>
                    <p className="text-purple-200/60 group-hover:text-purple-200/80 transition-colors">
                      {mode.description}
                    </p>
                  </div>
                  <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
                    {mode.icon}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={mode.href} className="w-full">
                  <Button
                    className="w-full bg-purple-600/80 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/40"
                    size="lg"
                  >
                    Play Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}

          <Card
            className="group bg-black/40 border-purple-500/20 backdrop-blur-sm hover:bg-black/60 transition-all duration-300 hover:scale-105 hover:border-purple-500/40"
          >
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-purple-100 group-hover:text-purple-300 transition-colors">
                  😮 Surprise Me!
                </h2>
                <p className="text-purple-200/60 group-hover:text-purple-200/80 transition-colors">
                  Let fate decide your adventure!
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSurpriseMe}
                className="w-full bg-purple-600/80 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/40"
                size="lg"
              >
                Surprise Me! 🤯
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}