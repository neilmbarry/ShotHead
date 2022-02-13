// console.log("Working...");

const cards = document.querySelectorAll(".card");

cards.forEach((card) =>
  card.addEventListener("click", () => {
    // console.log("clicked");
    card.classList.toggle("active");
  })
);

const playerOptions = document.querySelectorAll(".player-options");

playerOptions.forEach((option) =>
  option.addEventListener("click", () => {
    playerOptions.forEach((el) => el.classList.toggle("player-options_active"));
  })
);

// Define deck of cards
// Define suits and values
const suits = ["Hearts", "Clubs", "Diamonds", "Spades"];
const cardValues = [
  "Ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
];
const cardRoles = {
  Ace: {
    worth: 1,
    role: null,
  },
  2: {
    worth: 1,
    role: null,
  },
  3: {
    worth: 1,
    role: null,
  },
  4: {
    worth: 1,
    role: null,
  },
  5: {
    worth: 1,
    role: null,
  },
  6: {
    worth: 1,
    role: null,
  },
  7: {
    worth: 1,
    role: null,
  },
  8: {
    worth: 1,
    role: null,
  },
  9: {
    worth: 1,
    role: null,
  },
  10: {
    worth: 1,
    role: null,
  },
  Jack: {
    worth: 1,
    role: null,
  },
  Queen: {
    worth: 1,
    role: null,
  },
  King: {
    worth: 1,
    role: null,
  },
};
// Generate deck from suits and values (Array of objects) [STATE]
const generateDeck = () => {
  console.log("Generating deck...");
  const deck = [];
  suits.forEach((suit) => {
    cardValues.forEach((value) => {
      deck.push({ value, suit });
    });
  });
  //   console.log(deck);
  return deck;
  // Shuffle Deck
};

const shuffleDeck = (deck) => {
  console.log("Shuffling deck...");
  const newDeck = deck;
  let currIndex = newDeck.length;
  let randomIndex;
  while (currIndex > 0) {
    randomIndex = Math.floor(Math.random() * currIndex);
    currIndex--;
    [newDeck[currIndex], newDeck[randomIndex]] = [
      newDeck[randomIndex],
      newDeck[currIndex],
    ];
  }
  //   console.log(newDeck);
  return newDeck;
};

// Define Players (2) [STATE]
const state = {
  deck: [],
  players: {
    // Player attributes: 3 down cards, 6 open cards
    player1: {
      downCards: [],
      upCards: [],
      handCards: [],
      openCards: [],
      active: true,
    },
    player2: {
      downCards: [],
      upCards: [],
      handCards: [],
      openCards: [],
      active: false,
    },
  },
  stack: [],
  burned: [],
};

// NEW GAME

// DEAL FIRST CARDS
const dealCards = () => {
  console.log("Dealing cards..");
  dealThreeDownCards();
  dealSixOpenCards();
  //   console.log(state);
};

const dealThreeDownCards = () => {
  state.players.player1.downCards.push(state.deck.pop());
  state.players.player1.downCards.push(state.deck.pop());
  state.players.player1.downCards.push(state.deck.pop());
  state.players.player2.downCards.push(state.deck.pop());
  state.players.player2.downCards.push(state.deck.pop());
  state.players.player2.downCards.push(state.deck.pop());
};

const dealSixOpenCards = () => {
  state.players.player1.openCards.push(state.deck.pop());
  state.players.player1.openCards.push(state.deck.pop());
  state.players.player1.openCards.push(state.deck.pop());
  state.players.player1.openCards.push(state.deck.pop());
  state.players.player1.openCards.push(state.deck.pop());
  state.players.player1.openCards.push(state.deck.pop());

  state.players.player2.openCards.push(state.deck.pop());
  state.players.player2.openCards.push(state.deck.pop());
  state.players.player2.openCards.push(state.deck.pop());
  state.players.player2.openCards.push(state.deck.pop());
  state.players.player2.openCards.push(state.deck.pop());
  state.players.player2.openCards.push(state.deck.pop());
};

const shuffleUpAndDeal = () => {
  state.deck = shuffleDeck(generateDeck());
  dealCards();
};

// Player divides 6 open into 3 up cards and 3 hand cards
const divideCards = (pickedCardsIndex, player) => {
  state.players[player].upCards = state.players[player].openCards.filter(
    (card, i) => pickedCardsIndex.includes(i)
  );
  state.players[player].handCards = state.players[player].openCards.filter(
    (card, i) => !pickedCardsIndex.includes(i)
  );
  state.players[player].openCards = [];
  console.log(`${player} has selected a starting hand.`);
};

// Define function to find who has the lowest value hand
const startActivePlayer = () => {};

const switchActivePlayer = () => {
  state.players.player1.active = !state.players.player1.active;
  state.players.player2.active = !state.players.player2.active;
};
// down = hidden to all, up = shown to all, hand = visible to player

// Define Stack as empty Array to receive cards
// Set active player as one who has lowest value card in hand

// Player plays card as ACTION [SWITCH ACTIVE PLAYER]
const playCard = (cardIndex, player) => {
  //   console.log("Player is picking card");
  if (!state.players[player].active) return;
  const card = state.players[player].handCards.splice(cardIndex, 1);
  //   console.log(card);
  state.stack.push(card);
  console.log(`${player} has played a ${card[0].value} of ${card[0].suit}.`);
  if (state.players[player].handCards.length < 3) {
    pickCard(player);
  }

  switchActivePlayer();
};

const pickCard = (player) => {
  if (state.deck.length === 0) return;
  state.players[player].handCards.push(state.deck.pop());
  console.log(`${player} has picked another card.`);
};

// ------- INITIALIZE UP TO THIS POINT ---------//
shuffleUpAndDeal();
// console.log(state);
divideCards([1, 2, 5], "player1");
divideCards([0, 2, 4], "player2");
// console.log(state.players);
playCard(2, "player1");
// console.log(state);
playCard(2, "player2");

//////////////////////////////////////////////////

// Normal play begins
// Active player must choose one or more hand cards to play on Stack
// Chosen card must beat card on top of stack
// If Deck.length > 0, pick up a new card
// DEFINE RULES GOVERNING GAME
// Define CheckPickUp function that checks if player has valid move
// If handCards.length = 0, choose faceCard
// If handCards.length = 0 && faceCards.length = 0, pick downCard

// class Player {
//   constructor(name,playerNumber) {
//     this.name = name;
//     this.playerNumber = playerNumber
//   }
//   playCards(...cards){

//   }
// }
