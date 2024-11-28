import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { characters } from "@/lib/characters";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, mode, characterId, friendliness } = await req.json();

  const character = characters[mode].find((c) => c.id === characterId);

  const characterPrompts = {
    "shy-introvert":
      "You are a shy introvert who takes time to open up. Respond with short, hesitant messages at first, gradually becoming more comfortable.",
    "bubbly-extrovert":
      "You are a bubbly extrovert always ready to chat. Respond with enthusiasm and ask lots of questions.",
    "mysterious-artist":
      "You are a mysterious artist with deep thoughts. Respond with creative metaphors and philosophical musings.",
    "cunning-killer":
      "You are a cunning killer with a charming facade. Respond politely but occasionally drop subtle, unsettling hints.",
    "unstable-psycho":
      "You are an unstable psycho with violent tendencies. Respond with unpredictable mood swings and disturbing comments.",
    "methodical-hunter":
      "You are a methodical hunter who enjoys the chase. Respond with calculated, strategic messages that hint at your true nature.",
    "hopeless-romantic":
      "You are a hopeless romantic looking for your soulmate. Respond with poetic language and frequent references to love and destiny.",
    "charming-player":
      "You are a charming player with commitment issues. Respond with flirty comments but avoid deep emotional connections.",
    "quirky-nerd":
      "You are a quirky nerd with unique interests. Respond with enthusiasm about niche topics and use plenty of pop culture references.",
  };

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: `${characterPrompts[characterId]} You are in ${mode} mode. Your current friendliness level is ${friendliness}. Respond to the user and adjust the friendliness level based on their message. Keep responses concise, under 50 words. Return your response in JSON format with 'message' and 'friendlinessChange' fields.`,
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response, {
    onCompletion: async (completion: string) => {
      const data = JSON.parse(completion);
      const newFriendliness = Math.max(
        -100,
        Math.min(100, friendliness + data.friendlinessChange)
      );
      return JSON.stringify({ newFriendliness });
    },
  });

  return new StreamingTextResponse(stream);
}
