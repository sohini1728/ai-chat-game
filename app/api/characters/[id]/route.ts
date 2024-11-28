import { NextResponse } from 'next/server'

const characters = {
  human: { name: 'Friendly Human', description: 'A regular person looking for a chat.' },
  dog: { name: 'Playful Dog', description: 'A cute dog that communicates through actions.' },
  alien: { name: 'Curious Alien', description: 'An extraterrestrial being trying to understand Earth.' },
  robot: { name: 'Logical Robot', description: 'A machine learning about human emotions.' },
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const character = characters[params.id as keyof typeof characters];
  
  if (character) {
    return NextResponse.json(character)
  } else {
    return new NextResponse('Character not found', { status: 404 })
  }
}

