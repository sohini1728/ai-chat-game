import { generateObject, Message } from "ai";
import { openai } from "@ai-sdk/openai";
import { characters, Mode } from "@/lib/characters";
import { z } from "zod";

export const runtime = "edge";

const responseSchema = z.object({
  message: z.string().describe("The response message to the user"),
  friendlinessChange: z
    .number()
    .min(-10)
    .max(10)
    .describe("How much the friendliness level changes (-10 to +10)"),
});

export async function POST(req: Request) {
  const { messages, mode, characterId, friendliness, totalTurns } =
    await req.json();

  const character = characters[mode as Mode].find((c) => c.id === characterId);

  //@ts-expect-error: known issue for "Type instantiation is excessively deep and possibly infinite."
  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: responseSchema,
    system: `${character?.prompt} You are in ${mode} mode. Your current friendliness level is ${friendliness}. Respond to the user and adjust the friendliness level based on their message. Keep responses concise, under 50 words. The game has a total of ${totalTurns} turns.`,
    messages: messages.map((m: Message) => ({
      role: m.role,
      content: m.content,
    })),
    temperature: 0.7,
  });

  console.log("result", result);
  return new Response(JSON.stringify(result.object), {
    headers: { "Content-Type": "application/json" },
  });
}
