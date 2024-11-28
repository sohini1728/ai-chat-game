import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const gameModes = [
  { name: 'Befriend', description: 'Try to make a new friend!', href: '/start?mode=befriend' },
  { name: 'Escape Murderer', description: 'Can you outsmart a killer?', href: '/start?mode=escape' },
  { name: 'Romance', description: 'Find your AI soulmate', href: '/start?mode=romance' },
]

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">AI Chat Game</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gameModes.map((mode) => (
          <Card key={mode.name}>
            <CardHeader>
              <CardTitle>{mode.name}</CardTitle>
              <CardDescription>{mode.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={mode.href}>
                <Button className="w-full">Play</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}

