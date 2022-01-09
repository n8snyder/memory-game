"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

let colors = []
let guesses = [];
let matches = [];

initializeGame();

function initializeGame() {
  createStartButton();
}

function startGame() {
  colors = shuffle(COLORS);
  createCards(colors);
  createResetButton();
}

function resetGame() {
  const gameBoard = document.getElementById("game");
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild);
  }
  colors = []
  guesses = [];
  matches = [];
  startGame();
}

function removeThing(ele) {
  ele.remove();
}

function createStartButton() {
  const gameBoard = document.getElementById("game");
  const button = document.createElement("button");
  button.id = "startButton";
  button.textContent = "Start game!";
  button.addEventListener("click", removeElement);
  button.addEventListener("click", startGame);
  gameBoard.append(button);
}

function createResetButton() {
  const gameBoard = document.getElementById("game");
  const button = document.createElement("button");
  button.id = "resetButton";
  button.textContent = "Restart";
  button.addEventListener("click", resetGame);
  gameBoard.append(button);
}

function removeElement(event) {
  event.target.remove();
}

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let i = 0; i < colors.length; i++) {
    let card = document.createElement("div");
    card.id = "card-" + i;
    card.className = colors[i];
    card.addEventListener("click", handleCardClick);
    gameBoard.append(card);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.style.backgroundColor = card.className;
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.style.removeProperty("background-color");
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  let card = evt.target;
  // check if card has been clicked
  if (card.id in guesses) {
    return;
  }
  // check if card has been matched
  if (matches.includes(card.id)) {
    return;
  }
  // check if 2 guesses already made
  if (guesses.length >= 2) {
    return;
  }

  guesses.push(card.id);
  flipCard(card)

  // if two guesses match...
  if (guesses.length == 2 && guessesMatch()) {
    matches = matches.concat(guesses)
    guesses = [];
  }
  // if two guesses don't match...
  if (guesses.length == 2 && !guessesMatch()) {
    setTimeout(handleGuessReset, FOUND_MATCH_WAIT_MSECS);
  }
}

function handleGuessReset() {
  for (let id of guesses) {
    let card = document.getElementById(id);
    unFlipCard(card);
  }
  guesses = [];
}

function guessesMatch() {
  if (guesses.length != 2) {
    return false;
  }

  let firstGuess = colors[parseInt(guesses[0].split("-")[1])];
  let secondGuess = colors[parseInt(guesses[1].split("-")[1])];
  let result = firstGuess == secondGuess;
  return result;
}