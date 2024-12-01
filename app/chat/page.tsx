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

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      mode,
      characterId,
      friendliness,
      totalTurns,
    },
    onResponse: async (response) => {
      const json = await response.json();
      if (json.message && typeof json.friendlinessChange === "number") {
        // Manually add the AI response message
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: json.message,
            friendlinessChange: json.friendlinessChange,
          },
        ]);

        setFriendliness((prev) => {
          const newFriendliness = Math.max(
            -100,
            Math.min(100, prev + json.friendlinessChange)
          );
          if (currentTurn + 1 >= totalTurns) {
            toast.success(`Final friendliness: ${newFriendliness}`);
            setTimeout(() => router.push("/modes"), 5000);
          }
          return newFriendliness;
        });
        setCurrentTurn((prev) => prev + 1);
      }
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
    <div className="container mx-auto p-4 flex flex-col md:flex-row h-screen gap-4">
      <div className="w-full md:w-3/4 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto mb-4 bg-accent/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
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
                  className={`inline-block p-3 rounded-2xl max-w-[80%] shadow-md ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary text-secondary-foreground rounded-bl-none"
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
                          {((message as ExtendedMessage).friendlinessChange ??
                            0) > 0
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
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading || currentTurn >= totalTurns}
            className="text-lg p-6 rounded-xl"
          />
          <Button
            type="submit"
            disabled={isLoading || currentTurn >= totalTurns}
            className="px-8 rounded-xl"
          >
            Send
          </Button>
        </form>
      </div>
      <div className="w-full md:w-1/4">
        {character && (
          <Card className="h-full flex flex-col border-2 rounded-xl shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center text-2xl gap-2">
                {/* <span className="text-4xl">{character.emoji}</span> */}
                {character.name}
              </CardTitle>
              <CardDescription className="text-base">
                {character.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6">
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Friendliness</h3>
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.abs(friendliness)}%` }}
                  transition={{ duration: 0.5 }}
                >
                  <Progress
                    value={Math.abs(friendliness)}
                    max={100}
                    className={`h-3 ${friendlinessColor}`}
                  />
                </motion.div>
                <p className="mt-2 text-xl font-bold">
                  {friendliness < 0 ? friendliness : `+${friendliness}`} / 100
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-2">
                <h3 className="font-bold text-lg">Game Progress</h3>
                <Progress
                  value={(currentTurn / totalTurns) * 100}
                  className="h-3"
                />
                <p className="text-center text-lg font-bold">
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
