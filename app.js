///////////////////////////////////------- VIEW -------///////////////////////////////////

const cards = document.querySelectorAll(".card");

cards.forEach((card) =>
  card.addEventListener("click", () => {
    card.classList.toggle("active");
  })
);

/////////////////////////////////------- CONTROLLER -------//////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
//                                   TODO
//                                ----------
//   RECEIVE MULTIPLE CARDS TO PLAY
//   DEFINE PICK UP STACK
//   DEFINE PLAY VALID CARD
//   DEFINE PLAY BEST CARD
//   DEFINE WINNER & LOSER
//   TIDY UP PLAY CARD (HAND / FACE UP / FACE DOWN)
//   ABSTRACT SIMPLE REPETITIVE FUNCTIONS OUT OF CLASSES
//   TIDY UP CARD GENERATION
//   ALLOW RULES OBJECT PARAMETER
//
//   RECEIVE MULTIPLE PLAYERS
//   ALLOW MULTIDIRECTIONAL PLAY
//   REDEFINE POWER CARD RULES
//
//   DEFINE WILDCARD (JOKER)
//
//
//////////////////////////////////////////////////////////////////////////////////

// INITIAL DEFINITIONS

class Player {
  constructor(name) {
    this.name = name;
    console.log(`A new player has joined the game: ${name}.`);
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

  playCard(index) {
    if (!this.active) {
      return console.log(this.name + ", it is not your turn!");
    }
    if (this.hasInHandCards()) {
      const card = this.inHandCards[index];
      if (this.dealer.checkLegalMove(card)) {
        console.log(`${this.name} has played a ${card.value} of ${card.suit}.`);
        this.dealer.addCardToStack(card);
        this.inHandCards = this.inHandCards.filter((card, i) => i !== index);
        this.drawCardFromDeck(this.dealer);
        if (card.power !== "skip") {
          this.dealer.switchActivePlayer();
        }
        return;
      }
      console.log(`${this.name}, that is not a legal move`);
      return;
    }
    if (this.hasInHandCards()) {
      const card = this.inHandCards[index];
      if (this.dealer.checkLegalMove(card)) {
        this.dealer.addCardToStack(card);
      }
    }
    if (this.hasInHandCards()) {
      const card = this.inHandCards[index];
      if (this.dealer.checkLegalMove(card)) {
        this.dealer.addCardToStack(card);
      }
    }
  }
  pickUpStack() {}
  drawCardFromDeck() {
    if (this.dealer.deck.length === 0) return;
    this.inHandCards.push(dealer.deck.pop());
    console.log(`${this.name} has picked another card.`);
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
    // this.options = options;
    this.players = players;
    console.log(`A new game is about to begin!`);
  }
  deck = [];
  stack = [];
  burned = [];
  reverse = false;
  generateDeck() {
    const deck = [];
    suits.forEach((suit) => {
      cardValuePairs.forEach((value) => {
        deck.push({ value: value[0], suit, worth: value[1], power: value[2] });
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
      player.faceDownCards.push(this.deck.pop());
      player.faceDownCards.push(this.deck.pop());
      player.faceDownCards.push(this.deck.pop());
      player.openCards.push(this.deck.pop());
      player.openCards.push(this.deck.pop());
      player.openCards.push(this.deck.pop());
      player.openCards.push(this.deck.pop());
      player.openCards.push(this.deck.pop());
      player.openCards.push(this.deck.pop());
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
          if (card.worth < 8) {
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
  addCardToStack(card) {
    this.stack.push(card);
    if (this.checkBurnStack()) {
      this.burnStack();
    }
  }
  checkBurnStack() {
    const topStackCard = this.getTopStackCard();
    if (!topStackCard) return;
    const isBurnCard = () => {
      if (topStackCard.power === "burn") {
        // console.log("Burner Card!");
        return true;
      }
      return false;
    };
    const isFourOfAKind = () => {
      if (this.stack.length < 4) return false;
      const lastFourCards = this.stack.filter(
        (card, i) => i >= this.stack.length - 4
      );
      if (
        lastFourCards[0].value === lastFourCards[1].value &&
        lastFourCards[0].value === lastFourCards[2].value &&
        lastFourCards[0].value === lastFourCards[3].value
      ) {
        console.log("Four of a kind!");
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
    console.log("IT BUUUURNS!");
    this.switchActivePlayer();
    this.burned.push(...this.stack);
    this.stack = [];
  }
  switchActivePlayer() {
    this.players.forEach((player) => (player.active = !player.active));
  }
  startActivePlater() {
    // NEED TO IMPLEMENT PLAYER WITH LOWEST CARD TO START
    this.players[0].active = true;
    console.log(`Dealer has determined ${this.players[0].name} to start.`);
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

// ------- INITIALIZE UP TO THIS POINT ---------//

// CREATE PLAYERS, DEALER ////////////////////////////////////////////////////
const neil = new Player("Neil");
const barry = new Player("Barry");
const dealer = new Dealer(neil, barry);
dealer.players.forEach((player) => (player.dealer = dealer));

// SHUFFLE AND DEAL TO ALL PLAYERS //////////////////////////////////////////
dealer.generateDeck().shuffleDeck().dealCards();

// PLAYERS PICK STARTING HAND, DEALER DETERMINES STARTER ///////////////////
neil.pickFaceUpCards(1, 2, 4);
barry.pickFaceUpCards(0, 1, 3);
dealer.startActivePlater();

// REGULAR PLAY BEGINS /////////////////////////////////////////////////////
neil.playCard(1);
barry.playCard(2);
neil.playCard(2);
barry.playCard(1);
neil.playCard(1);
barry.playCard(2);
neil.playCard(2);
barry.playCard(1);
neil.playCard(1);
barry.playCard(2);
neil.playCard(2);
barry.playCard(1);
neil.playCard(1);
barry.playCard(2);
neil.playCard(2);
barry.playCard(1);

// ------- END OF GAME ------ //
