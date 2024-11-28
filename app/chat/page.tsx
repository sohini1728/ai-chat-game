'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useChat } from 'ai/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function ChatScreen() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const characterId = searchParams.get('character')
  const totalTurns = parseInt(searchParams.get('turns') || '10')

  const [character, setCharacter] = useState(null)
  const [friendliness, setFriendliness] = useState(0)
  const [currentTurn, setCurrentTurn] = useState(0)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { mode, characterId, friendliness },
    onResponse: (response) => {
      const data = JSON.parse(response)
      setFriendliness(data.newFriendliness)
      setCurrentTurn(currentTurn + 1)
    },
  })

  useEffect(() => {
    // Fetch character details
    const fetchCharacter = async () => {
      const res = await fetch(`/api/characters/${characterId}`)
      const data = await res.json()
      setCharacter(data)
    }
    fetchCharacter()
  }, [characterId])

  const friendlinessColor = friendliness < 0 ? 'bg-red-500' : 'bg-green-500'

  return (
    <div className="container mx-auto p-4 flex h-screen">
      <div className="w-3/4 pr-4">
        <div className="h-[calc(100vh-200px)] overflow-y-auto mb-4 bg-accent rounded-lg p-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {message.content}
              </div>
              {message.role === 'assistant' && message.friendlinessChange && (
                <div className="text-sm text-muted-foreground mt-1">
                  Friendliness change: {message.friendlinessChange > 0 ? '+' : ''}{message.friendlinessChange}
                </div>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading || currentTurn >= totalTurns}
          />
          <Button type="submit" disabled={isLoading || currentTurn >= totalTurns}>
            Send
          </Button>
        </form>
      </div>
      <div className="w-1/4">
        {character && (
          <Card>
            <CardHeader>
              <CardTitle>{character.name}</CardTitle>
              <CardDescription>{character.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="font-bold mb-2">Friendliness</h3>
              <Progress
                value={Math.abs(friendliness)}
                max={100}
                className={friendlinessColor}
              />
              <p className="mt-2">
                {friendliness < 0 ? friendliness : `+${friendliness}`} / 100
              </p>
              <h3 className="font-bold mt-4 mb-2">Turns</h3>
              <p>{currentTurn} / {totalTurns}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

