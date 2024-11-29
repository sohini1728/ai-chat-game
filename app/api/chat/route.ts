import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { characters, Mode } from "@/lib/characters";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, mode, characterId, friendliness, totalTurns } =
    await req.json();

  const character = characters[mode as Mode].find((c) => c.id === characterId);

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: [
      {
        role: "system",
        content: `${character?.prompt} You are in ${mode} mode. Your current friendliness level is ${friendliness}. Respond to the user and adjust the friendliness level based on their message. Keep responses concise, under 50 words. The game has a total of ${totalTurns} turns.`,
      },
      ...messages,
    ],
    // onFinish: async (completion: string) => {
    //   const friendlinessChange = calculateFriendlinessChange(
    //     completion,
    //     mode,
    //     characterId
    //   );
    //   const newFriendliness = Math.max(
    //     -100,
    //     Math.min(100, friendliness + friendlinessChange)
    //   );
    //   return JSON.stringify({ newFriendliness, friendlinessChange });
    // },
  });

  return result.toDataStreamResponse();
}
