import { useState } from "react";
import { createDeck, shuffleDeck } from "./game/deck";
import logo from "./assets/logo.png";
import "./App.css";

function App() {
  const [players, setPlayers] = useState([]);
  const [dealerIndex, setDealerIndex] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const [deck, setDeck] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [discard, setDiscard] = useState([]);
  const [stage, setStage] = useState(1);
  const [alert, setAlert] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const currentPlayer = players[currentPlayerIndex];
  const dealerName = players[dealerIndex];

  function addPlayer() {
    if (!newPlayerName.trim()) return;
    setPlayers((prev) => [...prev, newPlayerName.trim()]);
    setNewPlayerName("");
  }

  function startGame() {
    if (players.length < 2) return;

    let finalDealer = dealerIndex;
    if (finalDealer === null) {
      finalDealer = Math.floor(Math.random() * players.length);
      setDealerIndex(finalDealer);
    }

    const shuffled = shuffleDeck(createDeck());
    setDeck(shuffled);

    const firstPlayer = (finalDealer + 1) % players.length;
    setCurrentPlayerIndex(firstPlayer);
    setGameStarted(true);
  }

  function nextPlayer() {
    let next = (currentPlayerIndex + 1) % players.length;
    if (next === dealerIndex) next = (next + 1) % players.length;

    setCurrentPlayerIndex(next);
    setRevealed([]);
    setStage(1);
  }

  function drawCard() {
    if (deck.length === 0) return null;
    const newDeck = [...deck];
    const card = newDeck.shift();
    setDeck(newDeck);
    setActiveCard(card);
    setFlipped(false);
    setTimeout(() => setFlipped(true), 50);
    return card;
  }

  function showAlert(message, type) {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 2000);
  }

  function resolveCard(card, correct, nextStageIfCorrect) {
    setIsResolving(true);

    setTimeout(() => {
      if (correct) {
        setRevealed((prev) => [...prev, card]);

        if (nextStageIfCorrect === 5) {
          showAlert(`${currentPlayer} completed the row! 🎉`, "success");
          setTimeout(() => {
            setRevealed([]);
            setStage(1);
            nextPlayer();
          }, 900);
        } else {
          setStage(nextStageIfCorrect);
        }
      } else {
        setDiscard((prev) => [...prev, ...revealed, card]);
        showAlert(`${currentPlayer} drinks 2! 🍺`, "danger");
        setTimeout(() => {
          setRevealed([]);
          setStage(1);
          nextPlayer();
        }, 900);
      }

      setActiveCard(null);
      setIsResolving(false);
    }, 900);
  }

  function handleColorGuess(color) {
    if (isResolving) return;
    const card = drawCard();
    if (!card) return;
    resolveCard(card, card.color === color, 2);
  }

  function handleHigherLower(choice) {
    if (isResolving) return;
    const card = drawCard();
    if (!card) return;

    const prev = revealed[revealed.length - 1];
    const correct =
      (choice === "higher" && card.rank > prev.rank) ||
      (choice === "lower" && card.rank < prev.rank);

    resolveCard(card, correct, 3);
  }

  function handleInsideOutside(choice) {
    if (isResolving) return;
    const card = drawCard();
    if (!card) return;

    const first = revealed[0];
    const second = revealed[1];

    const min = Math.min(first.rank, second.rank);
    const max = Math.max(first.rank, second.rank);

    const correct =
      choice === "inside"
        ? card.rank > min && card.rank < max
        : card.rank < min || card.rank > max;

    resolveCard(card, correct, 4);
  }

  function handleSuitGuess(suit) {
    if (isResolving) return;
    const card = drawCard();
    if (!card) return;
    resolveCard(card, card.suit === suit, 5);
  }

  function renderCardFace(card) {
    const suits = {
      hearts: "♥",
      diamonds: "♦",
      clubs: "♣",
      spades: "♠",
    };

    const color = card.color === "red" ? "#ff004c" : "#111";

    return (
      <>
        <div style={{ color }}>{card.name}</div>
        <div style={{ fontSize: "30px", color }}>
          {suits[card.suit]}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4">
      <div className="w-full max-w-[1100px]">

        {!gameStarted ? (
          <div className="flex flex-col items-center max-w-[500px] mx-auto">

            <div className="logo-wrapper">
              <img src={logo} alt="Red or Black Logo" className="game-logo" />
            </div>

            <p className="text-sm opacity-70 mt-2">
              Tap a player to choose dealer (or leave blank for random)
            </p>

            <div className="flex w-full gap-2 mt-6">
              <input
                className="flex-1 rounded-2xl border-2 border-white px-3 py-2"
                value={newPlayerName}
                placeholder="Enter player name"
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPlayer();
                  }
                }}
                id="playerName"
                name="playerName"
              />
              <button onClick={addPlayer}>Add</button>
            </div>

            <div className="w-full mt-6">
              {players.map((p, i) => (
                <div
                  key={i}
                  className={`player-row ${dealerIndex === i ? "selected" : ""}`}
                  onClick={() => setDealerIndex(i)}
                >
                  <div className="player-left">
                    <span className="player-name">{p}</span>
                    {dealerIndex === i && (
                      <span className="dealer-badge">Dealer</span>
                    )}
                  </div>

                  <span
                    className="remove-player"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayers(players.filter((_, index) => index !== i));
                      if (dealerIndex === i) setDealerIndex(null);
                    }}
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>

            <button
              className="start-button w-full mt-6"
              onClick={startGame}
              disabled={players.length < 2}
            >
              Start Game
            </button>

          </div>
        ) : (
          <div className="text-center">

            <div className="logo-wrapper mb-6">
              <img src={logo} alt="Red or Black Logo" className="game-logo game-logo-small" />
            </div>

            <div className="text-sm opacity-80 mb-4">
              {dealerName && (
                <div>
                  <span className="opacity-70">Dealer: </span>
                  <span className="font-semibold">{dealerName}</span>
                </div>
              )}
              {currentPlayer && (
                <div className="mt-1">
                  <span className="opacity-70">Current player: </span>
                  <span className="font-semibold">{currentPlayer}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-[auto,auto] md:flex md:flex-row justify-center md:justify-between items-center md:items-start md:gap-10 gap-2">

              <div className="flex flex-col items-center col-span-1 col-start-1 row-start-1">
                <div className="deck">🂠</div>
                <div className="text-xs opacity-70 mt-2">
                  DECK ({deck.length})
                </div>
              </div>

              <div className="flex-1 text-center col-span-2 row-start-2 md:row-auto md:col-span-auto">
                <div className="flex justify-center gap-4 flex-wrap mb-6">
                  {revealed.map((card, i) => (
                    <div key={i} className="card revealed">
                      {renderCardFace(card)}
                    </div>
                  ))}

                  {activeCard && (
                    <div className={`card ${flipped ? "flip" : ""}`}>
                      <div className="card-inner">
                        <div className="card-front">🂠</div>
                        <div className="card-back">
                          {renderCardFace(activeCard)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center col-span-1 col-start-2 row-start-1 justify-self-end md:justify-self-auto">
                <div className="discard-stack">
                  {discard.length > 0 && (
                    <div className="discard-card top">🂠</div>
                  )}
                </div>
                <div className="text-xs opacity-70 mt-2">DISCARD ({discard.length})</div>
              </div>
              

            </div>

            <div className="flex flex-wrap justify-center gap-3 md:mt-0 mt-6">
                  {stage === 1 && (
                    <>
                      <button onClick={() => handleColorGuess("red")}>Red</button>
                      <button onClick={() => handleColorGuess("black")} className="btn-black">Black</button>
                    </>
                  )}
                  {stage === 2 && (
                    <>
                      <button onClick={() => handleHigherLower("higher")}>Higher</button>
                      <button onClick={() => handleHigherLower("lower")}>Lower</button>
                    </>
                  )}
                  {stage === 3 && (
                    <>
                      <button onClick={() => handleInsideOutside("inside")}>Inside</button>
                      <button onClick={() => handleInsideOutside("outside")}>Outside</button>
                    </>
                  )}
                  {stage === 4 && (
                    <>
                      <button onClick={() => handleSuitGuess("hearts")}>♥</button>
                      <button onClick={() => handleSuitGuess("diamonds")}>♦</button>
                      <button onClick={() => handleSuitGuess("clubs")}>♣</button>
                      <button onClick={() => handleSuitGuess("spades")}>♠</button>
                    </>
                  )}
                </div>
            {alert && (
              <div className={`custom-alert ${alert.type}`}>
                {alert.message}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default App;