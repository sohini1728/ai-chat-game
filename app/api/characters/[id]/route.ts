import { NextRequest, NextResponse } from "next/server";

const characters = {
  human: {
    name: "Friendly Human",
    description: "A regular person looking for a chat.",
  },
  dog: {
    name: "Playful Dog",
    description: "A cute dog that communicates through actions.",
  },
  alien: {
    name: "Curious Alien",
    description: "An extraterrestrial being trying to understand Earth.",
  },
  robot: {
    name: "Logical Robot",
    description: "A machine learning about human emotions.",
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const character = characters[id as keyof typeof characters];

  if (character) {
    return NextResponse.json(character);
  } else {
    return NextResponse.json({ error: "Character not found" }, { status: 404 });
  }
}
