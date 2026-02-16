// game/deck.js

export function createDeck() {
  const suits = [
    { suit: "hearts", color: "red" },
    { suit: "diamonds", color: "red" },
    { suit: "clubs", color: "black" },
    { suit: "spades", color: "black" },
  ];

  const ranks = [
    { name: "A", rank: 1 },
    { name: "2", rank: 2 },
    { name: "3", rank: 3 },
    { name: "4", rank: 4 },
    { name: "5", rank: 5 },
    { name: "6", rank: 6 },
    { name: "7", rank: 7 },
    { name: "8", rank: 8 },
    { name: "9", rank: 9 },
    { name: "10", rank: 10 },
    { name: "J", rank: 11 },
    { name: "Q", rank: 12 },
    { name: "K", rank: 13 },
  ];

  const deck = [];

  for (let s of suits) {
    for (let r of ranks) {
      deck.push({
        id: `${s.suit}-${r.rank}`, // 🔒 unique id prevents React morphing
        suit: s.suit,
        color: s.color,
        name: r.name,
        rank: r.rank,
      });
    }
  }

  return deck;
}

export function shuffleDeck(deck) {
  const shuffled = [...deck]; // 🔒 never mutate original

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  return shuffled;
}