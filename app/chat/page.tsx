"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useChat, Message } from "ai/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { characters } from "@/lib/characters";
import { Character } from "@/lib/characters";

type ExtendedMessage = Message & {
  friendlinessChange?: number;
};

export default function ChatScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") as keyof typeof characters;
  const characterId = searchParams.get("character");
  const totalTurns = parseInt(searchParams.get("turns") || "10");

  const [character, setCharacter] = useState<Character | null>(null);
  const [friendliness, setFriendliness] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: { mode, characterId, friendliness },
      onResponse: async (response) => {
        const data = await response.json();
        const { friendlinessChange } = data;
        setFriendliness((prev) => {
          const newFriendliness = Math.max(
            -100,
            Math.min(100, prev + friendlinessChange)
          );
          if (currentTurn + 1 >= totalTurns) {
            toast.success(`Final friendliness: ${newFriendliness}`);
            setTimeout(() => router.push("/"), 5000);
          }
          return newFriendliness;
        });
        setCurrentTurn((prev) => prev + 1);
      },
    });

  useEffect(() => {
    if (mode) {
      const selectedCharacter = characters[mode].find(
        (c) => c.id === characterId
      );
      setCharacter(selectedCharacter || null);
    }
  }, [mode, characterId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const friendlinessColor = friendliness < 0 ? "bg-red-500" : "bg-green-500";

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-3/4 pr-0 md:pr-4 mb-4 md:mb-0">
        <div className="h-[calc(100vh-200px)] overflow-y-auto mb-4 bg-accent rounded-lg p-4">
          <AnimatePresence>
            {messages.map((message: ExtendedMessage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "assistant" &&
                  (message as ExtendedMessage).friendlinessChange && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Friendliness change:{" "}
                      {(message as ExtendedMessage).friendlinessChange !==
                        undefined && (
                        <>
                          {(message as ExtendedMessage).friendlinessChange ??
                          0 > 0
                            ? "+"
                            : ""}
                          {(message as ExtendedMessage).friendlinessChange}
                        </>
                      )}
                    </div>
                  )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading || currentTurn >= totalTurns}
          />
          <Button
            type="submit"
            disabled={isLoading || currentTurn >= totalTurns}
          >
            Send
          </Button>
        </form>
      </div>
      <div className="w-full md:w-1/4">
        {character && (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <span className="text-4xl mr-2">{character.emoji}</span>
                {character.name}
              </CardTitle>
              <CardDescription>{character.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <h3 className="font-bold mb-2">Friendliness</h3>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${Math.abs(friendliness)}%` }}
                transition={{ duration: 0.5 }}
              >
                <Progress
                  value={Math.abs(friendliness)}
                  max={100}
                  className={friendlinessColor}
                />
              </motion.div>
              <p className="mt-2 text-lg font-semibold">
                {friendliness < 0 ? friendliness : `+${friendliness}`} / 100
              </p>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <h3 className="font-bold mb-2">Game Progress</h3>
                <Progress
                  value={(currentTurn / totalTurns) * 100}
                  className="mb-2"
                />
                <p className="text-center text-lg font-semibold">
                  Turn {currentTurn} / {totalTurns}
                </p>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
