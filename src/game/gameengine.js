import { createDeck, shuffleDeck } from "./deck";

export function createNewGame(players, dealerIndex) {
  const deck = shuffleDeck(createDeck());

  return {
    players,
    dealerIndex,
    currentPlayerIndex: (dealerIndex + 1) % players.length,
    deck,
    discardPile: [],
    stage: 1,
    revealedCards: [],
    gameOver: false,
  };
}

export function nextPlayer(game) {
  const nextIndex = (game.currentPlayerIndex + 1) % game.players.length;

  return {
    ...game,
    currentPlayerIndex: nextIndex,
    stage: 1,
    revealedCards: [],
  };
}

export function resetPlayerProgress(game) {
  return {
    ...game,
    discardPile: [...game.discardPile, ...game.revealedCards],
    revealedCards: [],
    stage: 1,
  };
}