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
//   RECEIVE MULTIPLE CARDS TO PLAY [X]
//   DEFINE PICK UP STACK [X]
//   DEFINE PLAY VALID CARD [X]
//   DEFINE PLAY BEST CARD
//   DEFINE WINNER & LOSER
//   TIDY UP PLAY CARD (HAND / FACE UP / FACE DOWN) [ ]
//   ABSTRACT SIMPLE REPETITIVE FUNCTIONS OUT OF CLASSES
//   TIDY UP CARD GENERATION
//   ALLOW RULES OBJECT PARAMETER
//
//   RECEIVE MULTIPLE PLAYERS
//   ALLOW MULTIDIRECTIONAL PLAY
//   REDEFINE POWER CARD RULES
//
//   DEFINE WILDCARD (JOKER)

// BUG [ 4 OF A KIND 5s SWITCHES THE PLAYER]
// TODO [PLAY FACE DOWN EVEN IF NOT LEGAL]
// TODO [PICK UP LAST FACE UP WITH STACK]
// TODO [HAVE PICK VALID CARD ONLY PLAY SINGLE POWER CARDS AT A TIME]

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

  playingHand() {
    if (this.hasInHandCards()) return "inHandCards";
    if (this.hasFaceUpCards()) return "faceUpCards";
    if (this.hasFaceDownCards()) return "faceDownCards";
    return null;
  }

  // playCard(index) {
  //   if (!this.active) {
  //     return console.log(this.name + ", it is not your turn!");
  //   }
  //   if (this.hasInHandCards()) {
  //     const card = this.inHandCards[index];
  //     if (this.dealer.checkLegalMove(card)) {
  //       console.log(`${this.name} has played a ${card.value} of ${card.suit}.`);
  //       this.dealer.addCardToStack(card);
  //       this.inHandCards = this.inHandCards.filter((card, i) => i !== index);
  //       this.drawCardFromDeck(this.dealer);
  //       if (card.power !== "skip") {
  //         this.dealer.switchActivePlayer();
  //       }
  //       return;
  //     }
  //     console.log(`${this.name}, that is not a legal move`);
  //     return;
  //   }
  //   if (this.hasInHandCards()) {
  //     const card = this.inHandCards[index];
  //     if (this.dealer.checkLegalMove(card)) {
  //       this.dealer.addCardToStack(card);
  //     }
  //   }
  //   if (this.hasInHandCards()) {
  //     const card = this.inHandCards[index];
  //     if (this.dealer.checkLegalMove(card)) {
  //       this.dealer.addCardToStack(card);
  //     }
  //   }
  // }
  playCards(...indexes) {
    if (!this.active) {
      return console.log(this.name + ", it is not your turn!");
    }

    // console.log(this.hasInHandCards(), this.hasFaceUpCards());

    if (!this.hasInHandCards() && this.hasFaceUpCards()) {
      console.warn(`${this.name} is on FACE UP CARDS!`);
    }
    if (!this.hasFaceUpCards() && !this.hasInHandCards()) {
      console.warn(`${this.name} is on FACE DOWN CARDS!`);
    }

    const cards = indexes.map((index) => this[this.playingHand()][index]);

    if (!allCardsHaveEqualValue(cards)) {
      return "Must be same value cards";
    }
    if (this.dealer.checkLegalMove(cards[0])) {
      const cardsPlayedString = cards
        .map((card) => `a ${card.value} of ${card.suit}`)
        .join(", ");
      // console.log(
      //   this.name,
      //   " is on ",
      //   this.playingHand().toUpperCase(),
      //   "<--------"
      // );
      console.log(`${this.name} has played ${cardsPlayedString}.`);

      this.dealer.addCardsToStack(cards);

      switch (this.playingHand()) {
        // console.log('switching', this.playingHand);
        case "inHandCards":
          // console.log("here1");
          // console.log("Removing played card");
          this.inHandCards = this.inHandCards.filter(
            (card, i) => !indexes.includes(i)
          );
          break;
        case "faceUpCards":
          // console.log("here2");
          this.faceUpCards = this.faceUpCards.filter(
            (card, i) => !indexes.includes(i)
          );
          break;
        case "faceDownCards":
          // console.log("here3");
          this.faceDownCards = this.faceDownCards.filter(
            (card, i) => !indexes.includes(i)
          );
          break;
      }

      if (!this.playingHand()) {
        return console.log(`${this.name} is the WINNER!!!`);
      }

      this.drawCardFromDeck(indexes.length);
      if (cards[0].power !== "skip") {
        this.dealer.switchActivePlayer();
      }
      return;
    }
    console.log(`${this.name}, that is not a legal move`);
    return;

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
  playValidCard() {
    // const topStackWorth = this.dealer.getTopStackCard()
    //   ? this.dealer.getTopStackCard().worth
    //   : 0;
    /// NEED TO HAVE VARIABLE TO DETERMINE INHAND / TABLE CARDS
    if (!this.playingHand()) {
      return console.log(`${this.name} is the WINNER!!!`);
    }
    const validCard = this[this.playingHand()].find((card) =>
      this.dealer.checkLegalMove(card)
    );

    // console.log(this.name, " playing ", validCard);
    if (!validCard) {
      return this.pickUpStack();
    }
    const validCards = this[this.playingHand()].filter(
      (card) => card.value == validCard.value
    );
    // console.log("Valid card is: ", validCard);
    const indexOfValidCard = this[this.playingHand()].indexOf(validCard);

    const indexesOfValidCards = validCards.map((card) =>
      this[this.playingHand()].indexOf(card)
    );
    // console.log(indexOfValidCard, "idex of");
    this.playCards(...indexesOfValidCards);
  }
  pickUpStack() {
    console.error(
      `${this.name} is picking up a pile of shit! (${this.dealer.stack.length} cards!)`
    );
    this.inHandCards.push(...this.dealer.stack);
    this.dealer.stack = [];
    this.dealer.switchActivePlayer();
  }
  drawCardFromDeck(number) {
    if (this.dealer.deck.length === 0) return;
    for (let i = 1; i <= number; i++) {
      this.inHandCards.push(dealer.deck.pop());
      // console.log(`${this.name} has picked another card.`);
    }
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
      // player.openCards.push(this.deck.pop());
      // player.openCards.push(this.deck.pop());
      // player.openCards.push(this.deck.pop());
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
  addCardsToStack(cards) {
    this.stack.push(...cards);
    if (this.checkBurnStack()) {
      this.burnStack();
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

const allCardsHaveEqualValue = (cards) => {
  return cards.every((card) => card.value === cards[0].value);
};

// ------- INITIALIZE UP TO THIS POINT ---------//

// CREATE PLAYERS, DEALER ////////////////////////////////////////////////////
const neil = new Player("Neil");
const amar = new Player("Amar");
const dealer = new Dealer(neil, amar);
dealer.players.forEach((player) => (player.dealer = dealer));

// SHUFFLE AND DEAL TO ALL PLAYERS //////////////////////////////////////////
dealer.generateDeck().shuffleDeck().dealCards();

// PLAYERS PICK STARTING HAND, DEALER DETERMINES STARTER ///////////////////
neil.pickFaceUpCards(1, 2, 4);
amar.pickFaceUpCards(0, 1, 3);
dealer.startActivePlater();

// REGULAR PLAY BEGINS /////////////////////////////////////////////////////

const nextActiveMove = () => {
  const activePlayer = dealer.players.find((player) => player.active);
  console.log(activePlayer);
  activePlayer.playValidCard();
};

// console.log(dealer.deck.length);

for (let i = 0; i < 200; i++) {
  const activePlayer = dealer.players.find((player) => player.active);
  activePlayer.playValidCard();
}

// neil.playValidCard();
// amar.playValidCard();
// neil.playValidCard();
// barry.playValidCard();
// neil.playValidCard();
// barry.playValidCard();
// neil.playValidCard();
// barry.playValidCard();
// neil.playValidCard();
// barry.playValidCard();
// neil.playValidCard();
// barry.playValidCard();
// neil.playValidCard();
// barry.playValidCard();

// ------- END OF GAME ------ //
