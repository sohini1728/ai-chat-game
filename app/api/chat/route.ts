import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, mode, characterId, friendliness } = await req.json()

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      { role: 'system', content: `You are a ${characterId} in ${mode} mode. Your current friendliness level is ${friendliness}. Respond to the user and adjust the friendliness level based on their message. Return your response in JSON format with 'message' and 'friendlinessChange' fields.` },
      ...messages
    ],
  })

  const stream = OpenAIStream(response, {
    onCompletion: async (completion: string) => {
      const data = JSON.parse(completion)
      const newFriendliness = Math.max(-100, Math.min(100, friendliness + data.friendlinessChange))
      return JSON.stringify({ newFriendliness })
    },
  })

  return new StreamingTextResponse(stream)
}

