import { characters, Character, Mode } from "@/lib/characters";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SurpriseMeCardProps {
  onSelect: (character: Character) => void;
}

const SurpriseMeCard = ({ onSelect }: SurpriseMeCardProps) => {
  const handleSurpriseMe = () => {
    const modes = Object.keys(characters);
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    const randomCharacterIndex = Math.floor(Math.random() * characters[randomMode].length);
    const randomCharacter = characters[randomMode][randomCharacterIndex];
    onSelect(randomCharacter);
    // Redirect to the game page
    window.location.href = `/start?mode=${randomMode}&character=${randomCharacter.id}`;
  };

  return (
    <Link href="/start">
      <Card className="group bg-black/40 border-purple-500/20 backdrop-blur-sm hover:bg-black/60 transition-all duration-300 hover:scale-105 hover:border-purple-500/40">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-purple-100 group-hover:text-purple-300 transition-colors">
              Surprise Me!
            </h2>
            <p className="text-purple-200/60 group-hover:text-purple-200/80 transition-colors">
              Pick a random character and start the adventure!
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSurpriseMe}
            className="w-full bg-purple-600/80 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/40"
            size="lg"
          >
            Surprise Me!
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default SurpriseMeCard;