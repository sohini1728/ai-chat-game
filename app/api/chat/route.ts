import OpenAI from "openai";
import { characters, Mode } from "@/lib/characters";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, mode, characterId, friendliness } = await req.json();

  if (!characters[mode as Mode]) {
    return new Response("Invalid mode", { status: 400 });
  }

  const character = characters[mode as Mode].find((c) => c.id === characterId);

  if (!character) {
    return new Response("Character not found", { status: 404 });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: `${character.prompt} You are in ${mode} mode. Your current friendliness level is ${friendliness}. Respond to the user and adjust the friendliness level based on their message. Keep responses concise, under 50 words. Return your response in JSON format with 'message' and 'friendlinessChange' fields.`,
      },
      ...messages,
    ],
  });

  let finalResponse = "";
  for await (const chunk of response) {
    const textPart = chunk.choices[0]?.delta?.content || "";
    finalResponse += textPart;
  }

  const data = JSON.parse(finalResponse);
  const newFriendliness = Math.max(
    -100,
    Math.min(100, friendliness + data.friendlinessChange)
  );

  return new Response(JSON.stringify({ newFriendliness }), {
    headers: { "Content-Type": "application/json" },
  });
}
