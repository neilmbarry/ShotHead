import {
  setUpEventListeners,
  updatePlayerCards,
  updateUI,
  updateTableCards,
  updateStack,
} from "./views.js";

setUpEventListeners();

class Player {
  constructor(name) {
    this.name = name;
    console.warn(`A new player has joined the game: ${name}.`);
  }
  active = false;
  openCards = [];
  faceDownCards = [];
  faceUpCards = [];
  inHandCards = [];
  dealer = null;

  hasFaceDownCards() {
    return !(this.faceDownCards.length === 0);
  }
  hasInHandCards() {
    return !(this.inHandCards.length === 0);
  }
  hasFaceUpCards() {
    return !(this.faceUpCards.length === 0);
  }

  playingHand() {
    if (this.hasInHandCards()) return this.inHandCards;
    if (this.hasFaceUpCards()) return this.faceUpCards;
    if (this.hasFaceDownCards()) return this.faceDownCards;
    return null;
  }
  setPlayingHand(cards) {
    if (this.hasInHandCards()) return (this.inHandCards = cards);
    if (this.hasFaceUpCards()) return (this.faceUpCards = cards);
    if (this.hasFaceDownCards()) return (this.faceDownCards = cards);
  }
  playCards(cards) {
    if (!this.active) {
      return console.log(this.name + ", it is not your turn!");
    }
    // Check cards are in playing hand
    //---------TODO------------//
    // Check cards are the same value
    if (!allCardsHaveEqualValue(cards)) {
      return console.log("Must be same value cards.");
    }
    // Check if playing blind card
    if (!this.hasFaceUpCards() && !this.hasInHandCards()) {
      const legalMove = this.dealer.checkLegalMove(cards[0]);
      const updatedHand = this.playingHand().filter((card) => {
        const cardNames = cards.map((card) => card.name);
        return !cardNames.includes(card.name);
      });
      this.setPlayingHand(updatedHand);
      console.log(
        `${this.name} has played a ${cards[0].value} of ${cards[0].suit}.`
      );
      this.dealer.addCardsToStack([cards[0]]);

      if (!legalMove) {
        this.dealer.switchActivePlayer();
        return this.pickUpStack();
      }
      this.dealer.checkWinner(this);
      return;
    }
    // Check move is legal
    if (!this.dealer.checkLegalMove(cards[0])) {
      return console.log("That is not a legal move.");
    }
    // Move cards from player to stack and log
    const updatedHand = this.playingHand().filter((card) => {
      const cardNames = cards.map((card) => card.name);
      return !cardNames.includes(card.name);
    });
    this.setPlayingHand(updatedHand);

    const cardsPlayedString = cards
      .map((card) => `a ${card.value} of ${card.suit}`)
      .join(", ");
    console.log(`${this.name} has played ${cardsPlayedString}.`);
    this.dealer.addCardsToStack(cards);
    // If player has less than 3 cards, pick up
    if (this.playingHand()?.length < 3) {
      const cardsToPickUp = 3 - this.playingHand().length;
      this.drawCardFromDeck(cardsToPickUp);
    }
    this.dealer.checkWinner(this);
  }
  playValidCard() {
    if (this.dealer.winner) {
      return;
    }
    if (!this.hasInHandCards() && this.hasFaceUpCards()) {
      console.warn(
        `${this.name} is on FACE UP CARDS! (${this.faceUpCards.length} remaining!)`
      );
    }
    if (!this.hasFaceUpCards() && !this.hasInHandCards()) {
      console.warn(
        `${this.name} is on FACE DOWN CARDS! (${this.faceDownCards.length} remaining!)`
      );
    }

    if (!this.hasFaceUpCards() && !this.hasInHandCards()) {
      return this.playCards([this.faceDownCards[0]]);
    }
    const validCards = this.playingHand().filter((card) =>
      this.dealer.checkLegalMove(card)
    );

    const sortedValidCards = this.sortCards(validCards);

    if (validCards.length === 0) {
      return this.pickUpStack();
    }
    let validCardMultiples = this.playingHand().filter((card) => {
      return card.value == sortedValidCards[0].value;
    });
    if (validCardMultiples[0].worth > 15) {
      validCardMultiples = [validCardMultiples[0]];
    }

    const indexesOfValidCards = validCardMultiples.map((card) =>
      this.playingHand().indexOf(card)
    );

    this.playCards(validCardMultiples);
  }
  pickUpStack() {
    console.error(
      `${this.name} is picking up a pile of shit! (${this.dealer.stack.length} cards!)`
    );
    this.inHandCards.push(...this.dealer.stack);
    if (this.faceUpCards.length === 1) {
      this.inHandCards.push(this.faceUpCards[0]);
      this.faceUpCards = [];
    }
    this.dealer.stack = [];
    this.dealer.switchActivePlayer();
  }
  drawCardFromDeck(number) {
    if (this.dealer.deck.length === 0) return;
    for (let i = 1; i <= number; i++) {
      if (this.dealer.deck.length > 0) {
        this.inHandCards.push(dealer.deck.pop());
      }
    }
  }
  sortCards(cards) {
    return cards.sort((a, b) => a.worth - b.worth);
  }
  pickBestFaceUpCards() {
    this.openCards = this.sortCards(this.openCards);
    this.pickFaceUpCards(3, 4, 5);
  }
  pickFaceUpCards(...indexList) {
    this.openCards.forEach((card, index) => {
      if (indexList.includes(index)) {
        this.faceUpCards.push(card);
      } else {
        this.inHandCards.push(card);
      }
    });
    this.openCards = [];
    console.log(`${this.name} has picked his starting hand.`);
  }
  showCards() {
    console.log(`${this.name} has:`);
    this.openCards.length > 0
      ? console.log(
          this.openCards
            .map((card) => `${card.value} of ${card.suit}`)
            .join(", ")
        )
      : console.log(
          this.inHandCards
            .map((card) => `${card.value} of ${card.suit}`)
            .join(", ")
        );
  }
}

class Dealer {
  constructor(...players) {
    this.players = players;
    console.warn(`A new game is about to begin!`);
  }
  deck = [];
  stack = [];
  burned = [];
  reverse = false;
  winner = null;
  generateDeck() {
    const deck = [];
    suits.forEach((suit) => {
      cardValuePairs.forEach((value) => {
        deck.push({
          value: value[0],
          suit,
          worth: value[1],
          power: value[2],
          name: value[0] + suit,
        });
      });
    });
    this.deck = deck;
    console.log("Deck generated.");
    return this;
  }
  shuffleDeck() {
    const newDeck = this.deck;
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
    this.deck = newDeck;
    console.log("Deck shuffled.");
    return this;
  }
  dealCards(down = 3, open = 6) {
    this.players.forEach((player) => {
      player.faceDownCards = this.deck.splice(0, down);
      // player.faceDownCards.push(this.deck.pop());
      // player.faceDownCards.push(this.deck.pop());
      // player.faceDownCards.push(this.deck.pop());
      player.openCards = this.deck.splice(0, open);
      // player.openCards.push(this.deck.pop());
      // player.openCards.push(this.deck.pop());
      // player.openCards.push(this.deck.pop());
      // player.openCards.push(this.deck.pop());
      // player.openCards.push(this.deck.pop());
      // player.openCards.push(this.deck.pop());
    });
    console.log("Cards dealt.");
  }
  checkLegalMove(card) {
    const topStackCard = this.getTopStackCard();

    if (!topStackCard) {
      return true;
    }
    if (topStackCard.power) {
      switch (topStackCard.power) {
        case "reset":
          return true;
        case "skip":
          if (card.worth > 5) {
            return true;
          } else {
            return false;
          }
        case "lower":
          if (card.worth < 8 || card.worth > 15) {
            return true;
          } else {
            return false;
          }
      }
    }
    if (card.worth >= topStackCard.worth) {
      return true;
    }
    return false;
  }
  getTopStackCard() {
    return this.stack[this.stack.length - 1];
  }
  addCardsToStack(cards) {
    this.stack.push(...cards);
    if (this.checkBurnStack()) {
      return this.burnStack();
    }
    if (this.getTopStackCard().power !== "skip") {
      this.switchActivePlayer();
    }
  }
  checkBurnStack() {
    const topStackCard = this.getTopStackCard();
    if (!topStackCard) return;
    const isBurnCard = () => {
      if (topStackCard.power === "burn") {
        return true;
      }
      return false;
    };
    const isFourOfAKind = () => {
      if (this.stack.length < 4) return false;
      const lastFourCards = this.stack.filter(
        (card, i) => i >= this.stack.length - 4
      );
      if (allCardsHaveEqualValue(lastFourCards)) {
        console.warn("Four of a kind!");
        return true;
      }
      return false;
    };
    if (isBurnCard() || isFourOfAKind()) {
      return true;
    }
    return false;
  }
  burnStack() {
    console.error("IT BUUUURNS!");
    // this.switchActivePlayer();
    this.burned.push(...this.stack);
    this.stack = [];
  }
  switchActivePlayer() {
    // console.log("SWITCHING ACTIVE PLAYER");
    this.players.forEach((player) => (player.active = !player.active));
  }
  startActivePlater() {
    // NEED TO IMPLEMENT PLAYER WITH LOWEST CARD TO START
    this.players[0].active = true;
    console.warn(`Dealer has determined ${this.players[0].name} to start.`);
  }
  checkWinner(player) {
    if (!player.playingHand()) {
      this.winner = player;
      console.log(`${player.name} is the WINNER!!!`);
      console.error("GAME OVER");
      return true;
    }
    return false;
  }
}

const suits = ["Hearts", "Clubs", "Diamonds", "Spades"];

const cardValuePairs = [
  ["Ace", 14, null],
  ["2", 100, "reset"], // POWER CARD
  ["3", 3, null],
  ["4", 4, null],
  ["5", 100, "skip"], // POWER CARD
  ["6", 6, null],
  ["7", 7, null],
  ["8", 100, "lower"], // POWER CARD
  ["9", 9, null],
  ["10", 100, "burn"], // POWER CARD
  ["Jack", 11, "reverse"],
  ["Queen", 12, null],
  ["King", 13, null],
];

const allCardsHaveEqualValue = (cards) => {
  return cards.every((card) => card.value === cards[0].value);
};

// ------- START GAME ---------//

// CREATE PLAYERS, DEALER
const neil = new Player("Neil");
const stephanie = new Player("Stephanie");
const dealer = new Dealer(neil, stephanie);
dealer.players.forEach((player) => (player.dealer = dealer));

// SHUFFLE AND DEAL TO ALL PLAYERS
dealer.generateDeck().shuffleDeck().dealCards();

// PLAYERS PICK STARTING HAND, DEALER DETERMINES STARTER
neil.pickBestFaceUpCards();
stephanie.pickBestFaceUpCards();

updateUI();

dealer.startActivePlater();

// REGULAR PLAY BEGINS

const nextValidMove = () => {
  if (!checkWinner()) {
    const activePlayer = dealer.players.find((player) => player.active);
    // console.log(activePlayer);
    activePlayer.playValidCard();
  }
};

// const interval = setInterval(() => {
//   nextValidMove();
//   updatePlayerCards(dealer);
//   updateTableCards(dealer);
//   updateStack(dealer);
// }, 3000);

const checkWinner = () => {
  if (dealer.winner) {
    clearInterval(interval);
    return true;
  }
  return false;
};

// ------- END OF GAME ------ //
// updatePlayerCards(dealer);
// updateTableCards(dealer);
// updateStack(dealer);
setUpEventListeners();

// nextValidMove();
// nextValidMove();
// nextValidMove();
// nextValidMove();
// nextValidMove();
// nextValidMove();
// updatePlayerCards(dealer);
// updateTableCards(dealer);
// updateStack(dealer);
