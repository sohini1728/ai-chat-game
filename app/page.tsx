import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const gameModes = [
  { name: 'Befriend', description: 'Try to make a new friend!', href: '/start?mode=befriend' },
  { name: 'Escape Murderer', description: 'Can you outsmart a killer?', href: '/start?mode=escape' },
  { name: 'Romance', description: 'Find your AI soulmate', href: '/start?mode=romance' },
  { name: 'Debate', description: 'Engage in a battle of wits!', href: '/start?mode=debate' },
  { name: 'Investigate', description: 'Solve the mystery!', href: '/start?mode=investigate' },
  { name: 'Solve', description: 'Crack the code!', href: '/start?mode=solve' },
  { name: 'Create', description: 'Unleash your creativity!', href: '/start?mode=create' },
  { name: 'Explore', description: 'Embark on an adventure!', href: '/start?mode=explore' },
  { name: 'Survive', description: 'Stay alive!', href: '/start?mode=survive' },
  { name: 'Thrill', description: 'Feel the rush!', href: '/start?mode=thrill' },
  { name: 'Mystery', description: 'Unravel the enigma!', href: '/start?mode=mystery' },
  { name: 'Dream', description: 'Enter the subconscious!', href: '/start?mode=dream' },
];

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

