"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

  const getFriendlinessDisplay = () => {
    if (friendliness >= 0) {
      return {
        barWidth: friendliness,
        color: "bg-primary",
        scale: "0 to 100",
        style: { marginLeft: "0%" },
      };
    } else {
      return {
        barWidth: Math.abs(friendliness),
        color: "bg-destructive",
        scale: "-100 to 0",
        style: { marginLeft: `${100 - Math.abs(friendliness)}%` },
      };
    }
  };

  const { barWidth, color, scale, style } = getFriendlinessDisplay();

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
      <div className="rounded-full bg-primary/10 p-4">
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
          className="h-8 w-8 text-primary"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold">Start the Conversation</h3>
      <p className="text-muted-foreground max-w-sm">
        Begin your chat with {character?.name}. Your goal is to build a friendly
        relationship through conversation.
      </p>
    </div>
  );

  return (
    <div className="container mx-auto p-8 flex flex-col md:flex-row h-screen gap-4">
      <div className="w-full md:w-3/4 flex flex-col h-full">
        <div className="mb-4">
          <Link href="/modes">
            <Button
              variant="outline"
              className="bg-background/40 backdrop-blur-sm border-purple-800/60 hover:bg-background/60"
            >
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
        </div>
        <div className="flex-1 overflow-y-auto mb-4 bg-background/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
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
                    (message as ExtendedMessage).friendlinessChange !==
                      undefined && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Friendliness change:{" "}
                        {(() => {
                          const change = (message as ExtendedMessage)
                            .friendlinessChange;
                          if (change === undefined) return "0";
                          if (change === 0) return "0";
                          return change > 0 ? `+${change}` : `${change}`;
                        })()}
                      </div>
                    )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading || currentTurn >= totalTurns}
            className="text-lg p-6 rounded-2xl border-2 border-muted-foreground/20 focus:border-primary"
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
          <Card className="h-full flex flex-col bg-muted/50 backdrop-blur-sm border rounded-xl shadow-lg">
            <CardHeader className="space-y-4 bg-background/60 rounded-t-lg">
              <div className="space-y-2">
                <CardTitle className="flex items-center text-2xl gap-2">
                  {character.name}
                </CardTitle>
                <CardDescription className="text-base">
                  {character.description}
                </CardDescription>
              </div>
              {character.image && (
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-grow space-y-6 pt-6 bg-background/60">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Friendliness</h3>
                  <span className="text-sm text-muted-foreground">{scale}</span>
                </div>
                <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full ${color}`}
                    style={style}
                  />
                </div>
                <p className="mt-2 text-xl font-bold text-center">
                  {friendliness < 0 ? friendliness : `+${friendliness}`} / 100
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-background/60 rounded-b-lg pt-6">
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
