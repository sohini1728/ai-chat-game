'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CharacterSelection from '@/components/character-selection'

export default function StartGame() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const [turns, setTurns] = useState(10)
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  const handleStart = () => {
    if (selectedCharacter) {
      router.push(`/chat?mode=${mode}&character=${selectedCharacter.id}&turns=${turns}`)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Start Game: {mode}</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Game Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="turns">Number of Turns</Label>
          <Input
            id="turns"
            type="number"
            value={turns}
            onChange={(e) => setTurns(parseInt(e.target.value))}
            min={1}
            max={20}
          />
        </CardContent>
      </Card>
      <CharacterSelection onSelect={setSelectedCharacter} />
      <Button onClick={handleStart} disabled={!selectedCharacter} className="mt-4">
        Start Game
      </Button>
    </div>
  )
}

