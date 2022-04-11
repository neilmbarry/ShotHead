const setUpEventListeners = () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) =>
    card.addEventListener("click", () => {
      card.classList.toggle("active");
    })
  );
};

const updateUI = () => {
  //   console.log("testing UI");
};

const updatePlayerCards = (dealer) => {
  const playerHand1 = document.querySelector(".player-hand_1");
  const playerHand2 = document.querySelector(".player-hand_2");
  const player1Cards = dealer.players[0].inHandCards.map((el) => el.name);
  const player2Cards = dealer.players[1].inHandCards.map((el) => el.name);
  playerHand1.innerHTML = player1Cards
    .map(
      (cardName, i) => `
    <div class="card card-hand card-hand_2">
    <img src="./card-images/${cardName}.png" alt="" />
  </div>
  `
    )
    .join("");
  playerHand2.innerHTML = player2Cards
    .map(
      (cardName, i) => `
    <div class="card card-hand card-hand_2">
    <img src="./card-images/${cardName}.png" alt="" />
  </div>
  `
    )
    .join("");
};

const updateTableCards = (dealer) => {
  const playerHand1 = document.querySelector(".table-cards-player1");
  const playerHand2 = document.querySelector(".table-cards-player2");
  const player1Cards = dealer.players[0].faceUpCards.map((el) => el.name);
  const player2Cards = dealer.players[1].faceUpCards.map((el) => el.name);
  playerHand1.innerHTML = player1Cards
    .map(
      (cardName) => `<div class="card-container">
      <div class="card">
        <img src="./card-images/${cardName}.png" alt="" />
      </div>
      <div class="card card-behind"></div>
    </div>
  `
    )
    .join("");
  playerHand2.innerHTML = player2Cards
    .map(
      (cardName) => `<div class="card-container">
      <div class="card">
        <img src="./card-images/${cardName}.png" alt="" />
      </div>
      <div class="card card-behind"></div>
    </div>
  `
    )
    .join("");
};

const updateStack = (dealer) => {
  const stack = document.querySelector(".stack-container");
  const cards = dealer.stack.map((cards) => cards.name);
  const stackHtml = cards
    .map(
      (card, i) => `<div class="card card-stack rotate-${(i % 4) + 1}">
  <img src="./card-images/${card}.png" alt="" />
</div>`
    )
    .join("");
  stack.innerHTML = stackHtml;
};

export {
  setUpEventListeners,
  updateUI,
  updatePlayerCards,
  updateTableCards,
  updateStack,
};
