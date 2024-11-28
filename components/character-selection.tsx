import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const characters = [
  { id: 'human', name: 'Friendly Human', description: 'A regular person looking for a chat.' },
  { id: 'dog', name: 'Playful Dog', description: 'A cute dog that communicates through actions.' },
  { id: 'alien', name: 'Curious Alien', description: 'An extraterrestrial being trying to understand Earth.' },
  { id: 'robot', name: 'Logical Robot', description: 'A machine learning about human emotions.' },
]

export default function CharacterSelection({ onSelect }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select a Character</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characters.map((character) => (
          <Card
            key={character.id}
            className="cursor-pointer hover:bg-accent"
            onClick={() => onSelect(character)}
          >
            <CardHeader>
              <CardTitle>{character.name}</CardTitle>
              <CardDescription>{character.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

