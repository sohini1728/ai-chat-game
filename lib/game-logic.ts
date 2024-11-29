export function calculateFriendlinessChange(
  message: string,
  mode: string,
  characterId: string
): number {
  const words = message.toLowerCase().split(" ");
  let change = 0;

  const positiveWords = [
    "happy",
    "love",
    "like",
    "great",
    "awesome",
    "fantastic",
    "wonderful",
  ];
  const negativeWords = [
    "hate",
    "dislike",
    "awful",
    "terrible",
    "bad",
    "worst",
  ];

  words.forEach((word) => {
    if (positiveWords.includes(word)) change += 5;
    if (negativeWords.includes(word)) change -= 5;
  });

  // Adjust change based on mode and character
  switch (mode) {
    case "befriend":
      change *= 1.2;
      break;
    case "escape":
      change *= 0.8;
      break;
    case "romance":
      change *= 1.5;
      break;
  }

  // Further adjust based on character
  if (characterId === "shy-introvert") change *= 0.8;
  if (characterId === "bubbly-extrovert") change *= 1.2;

  return Math.round(change);
}
