import { NextResponse } from "next/server";
import { characters } from "@/lib/characters";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const character = characters[params.id as keyof typeof characters];

  if (character) {
    return NextResponse.json(character);
  } else {
    return new NextResponse("Character not found", { status: 404 });
  }
}
