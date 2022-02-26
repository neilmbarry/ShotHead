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
//   DEFINE PLAY BEST CARD [X]
//   (Reduce array of available cards to valid cards and choose the lowest possible card to play)
//   DEFINE WINNER & LOSER [X]

//   TIDY UP PLAY CARD (HAND / FACE UP / FACE DOWN) [ ]
//   ABSTRACT SIMPLE REPETITIVE FUNCTIONS OUT OF CLASSES [ ]
//   TIDY UP CARD GENERATION [ ]

//   ALLOW RULES OBJECT PARAMETER [ ]

//   SELECT BEST CARDS FOR FACE UP FROM OPEN [X]
//
//   RECEIVE MULTIPLE PLAYERS [ ]
//   ALLOW MULTIDIRECTIONAL PLAY [ ]
//   REDEFINE POWER CARD RULES [ ]
//
//   DEFINE WILDCARD (JOKER) [ ]

//   PLAY 4 OF A KIND AT ANY TIME (LIKE A TEN)  [ ]
//   DEALER DETERMINES PLAYER WITH LOWEST STARTING HAND [ ]
//   DISALLOW FINISHING ON A POWER CARD OR 4OAK OR SKIP-BACK-PENULTIMATE CARD [ ]

// BUG [ 4 OF A KIND 5s SWITCHES THE PLAYER] [X]
// BUG [ CANT PLAY POWER CARD ON AN 8] [X]
// TODO [PLAY FACE DOWN RANDOMLY EVEN IF NOT LEGAL] [X]
// TODO [PICK UP LAST FACE UP WITH STACK] [X]
// TODO [HAVE PICK VALID CARD ONLY PLAY SINGLE POWER CARDS AT A TIME] [X]
// ADD 'ACE OF NEIL DIAMONDS' [ ]

//
//
//////////////////////////////////////////////////////////////////////////////////

// INITIAL DEFINITIONS

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
    if (this.hasInHandCards()) return "inHandCards";
    if (this.hasFaceUpCards()) return "faceUpCards";
    if (this.hasFaceDownCards()) return "faceDownCards";
    return null;
  }
  playCards(...indexes) {
    if (!this.active) {
      return console.log(this.name + ", it is not your turn!");
    }

    const cards = indexes.map((index) => this[this.playingHand()][index]);

    if (!allCardsHaveEqualValue(cards)) {
      return "Must be same value cards";
    }
    if (this.playingHand() === "faceDownCards") {
      const legalMove = this.dealer.checkLegalMove(cards[0]);
      console.log(
        `${this.name} has played a ${cards[0].value} of ${cards[0].suit}.`
      );
      this.dealer.addCardsToStack([cards[0]]);
      this.faceDownCards = this.faceDownCards.filter(
        (card, i) => !indexes.includes(i)
      );
      if (!legalMove) {
        this.dealer.switchActivePlayer();
        return this.pickUpStack();
      }
      return;
    }
    if (this.dealer.checkLegalMove(cards[0])) {
      const cardsPlayedString = cards
        .map((card) => `a ${card.value} of ${card.suit}`)
        .join(", ");

      console.log(`${this.name} has played ${cardsPlayedString}.`);

      this.dealer.addCardsToStack(cards);

      switch (this.playingHand()) {
        case "inHandCards":
          this.inHandCards = this.inHandCards.filter(
            (card, i) => !indexes.includes(i)
          );
          break;
        case "faceUpCards":
          this.faceUpCards = this.faceUpCards.filter(
            (card, i) => !indexes.includes(i)
          );
          break;
        case "faceDownCards":
          this.faceDownCards = this.faceDownCards.filter(
            (card, i) => !indexes.includes(i)
          );
          break;
      }

      if (!this.playingHand()) {
        // return console.log(`${this.name} is the WINNER!!!`);
        return;
      }

      // CHECK IF FEWER THAN 3 CARDS IN HAND
      // PICK UP THAT AMOUNT

      if (this.inHandCards.length === 0) {
        this.drawCardFromDeck(3);
      }
      if (this.inHandCards.length === 1) {
        this.drawCardFromDeck(2);
      }
      if (this.inHandCards.length === 2) {
        this.drawCardFromDeck(1);
      }

      // this.drawCardFromDeck(indexes.length);
      /// ------ NEED TO SOFT CODE ------ ////

      return;
    }
    console.log(`${this.name}, that is not a legal move`);
    return;
  }
  playValidCard() {
    // const topStackWorth = this.dealer.getTopStackCard()
    //   ? this.dealer.getTopStackCard().worth
    //   : 0;
    /// NEED TO HAVE VARIABLE TO DETERMINE INHAND / TABLE CARDS
    // console.log(1);
    if (dealer.winner) {
      return console.error("GAME OVER");
    }
    if (!this.playingHand()) {
      dealer.winner = this.name;
      console.log(`${this.name} is the WINNER!!!`);
      return console.error("GAME OVER");
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

    if (this.playingHand() === "faceDownCards") {
      return this.playCards(0);
    }
    ////////////////////// TESTING ///////////////////
    // console.log(this.name, " has ", this[this.playingHand()]);

    // const validCard = this[this.playingHand()].find((card) =>
    //   this.dealer.checkLegalMove(card)
    // );

    const validCards = this[this.playingHand()].filter((card) =>
      this.dealer.checkLegalMove(card)
    );

    ///////////////// CHECK FOR 4 OF A KIND //////////////
    // SORT HAND CARDS
    // ITERATE THROUGH IN STEPS OF FOUR, CHECKING FOR 4OAK
    // SAVE 4 CARDS
    // PLAY FOUR CARDS

    ////////////////////// TESTING ///////////////////
    // console.log("valid cards == ", validCards);

    const sortedValidCards = this.sortCards(validCards);
    // const sortedValidCards = validCards.sort((a, b) => a.worth - b.worth);

    // console.log(this.name, " playing ", validCard);
    if (validCards.length === 0) {
      return this.pickUpStack();
    }
    // if (!validCard) {
    //   return this.pickUpStack();
    // }
    // console.log(validCard, "<---- VALID CARD");
    let validCardMultiples = this[this.playingHand()].filter((card) => {
      // console.log(this.name, this[this.playingHand()]);
      // console.log(card, validCard);
      return card.value == sortedValidCards[0].value;
    });
    if (validCardMultiples[0].worth > 15) {
      validCardMultiples = [validCardMultiples[0]];
    }
    // console.log("Valid card is: ", validCard);
    // const indexOfValidCard = this[this.playingHand()].indexOf(validCard);

    const indexesOfValidCards = validCardMultiples.map((card) =>
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
      // console.log(`${this.name} has picked another card.`);
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
    // this.options = options;
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
dealer.startActivePlater();

// REGULAR PLAY BEGINS
const interval = setInterval(() => {
  if (!checkWinner()) {
    const activePlayer = dealer.players.find((player) => player.active);
    activePlayer.playValidCard();
  }
}, 10);

const checkWinner = () => {
  if (dealer.winner) {
    clearInterval(interval);
    return true;
  }
  return false;
};

// ------- END OF GAME ------ //
