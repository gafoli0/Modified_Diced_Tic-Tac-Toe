"use strict";

//Selecting Elements
const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");
const diceEl = document.querySelector(".dice");
const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");

let activePlayer, playing;
let circleTurn;
const xClass = "x";
const circleClass = "o";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelectorAll(".instruction");

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

for (let i = 0; i < btnsOpenModal.length; i++) {
  btnsOpenModal[i].addEventListener("click", openModal);
}

btnCloseModal.addEventListener("click", closeModal);

overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

const winningCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const init = function () {
  activePlayer = 0;
  playing = true;

  diceEl.classList.add("hidden");
  player0El.classList.remove("player--winner");
  player1El.classList.remove("player--winner");
  player0El.classList.add("player--active");
  player1El.classList.remove("player--active");
};

init();

const switchPlayer = function () {
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle("player--active");
  player1El.classList.toggle("player--active");
};

const cellElement = document.querySelectorAll("[data-cell]");

var CELL;

function placeMarker(cell, currentClass) {
  cell.classList.add(currentClass);
}

function checkWin(currentClass) {
  return winningCombination.some((combination) => {
    return combination.every((index) => {
      return cellElement[index].classList.contains(currentClass);
    });
  });
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? circleClass : xClass;
  //   cell.classList.add(currentClass);
  placeMarker(cell, currentClass);
  if (checkWin(currentClass)) {
    document.querySelector(".winning-message").innerText = `${
      circleTurn ? "O " : "X "
    } wins!`;
    document.querySelector(".winning-message").classList.add("show");
    btnNew.classList.add("shadow");
  } else {
    if (checkDraw()) {
      document.querySelector(".winning-message").innerText = "Draw!";
      document.querySelector(".winning-message").classList.add("show");
    }
  }
}

function checkDraw() {
  return [...cellElement].every((cell) => {
    return (
      cell.classList.contains(xClass) || cell.classList.contains(circleClass)
    );
  });
}

btnRoll.addEventListener("click", function () {
  if (playing) {
    const dice = Math.trunc(Math.random() * 6) + 1;

    diceEl.classList.remove("hidden");
    diceEl.src = `img/dice-${dice}.png`;
    // setBoardHoverClass();

    if (dice === 1) {
      cellElement.forEach((cell) => {
        cell.addEventListener("click", handleClick, { once: true });
      });
    } else {
      circleTurn = !circleTurn;
      switchPlayer();
      cellElement.forEach((cell) => {
        cell.removeEventListener("click", handleClick, { once: true });
      });
    }
  }
});

function newGame() {
  init();
  cellElement.forEach((cell) => {
    cell.classList.remove(xClass);
    cell.classList.remove(circleClass);
    cell.removeEventListener("click", handleClick);
  });

  document.querySelector(".winning-message").classList.remove("show");
  btnNew.classList.remove("shadow");
}

btnNew.addEventListener("click", newGame);
