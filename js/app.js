/*
 * Create a list that holds all of your cards.
 * Cards are represented by their font-awesome's classname for efficiency
 * Keep tabs of which cards have been opened
 * Counter for number of total moves and number of wrong moves
 */

const WRONG_MOVE_3_STAR_LIMIT = 26;
const WRONG_MOVE_2_STAR_LIMIT = 34;
const WRONG_MOVE_1_STAR_LIMIT = 42;

let cardListArray = ['fa-anchor', 'fa-anchor', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-diamond', 'fa-diamond', 'fa-leaf', 'fa-leaf', 'fa-paper-plane-o', 'fa-paper-plane-o'];
let openCardIndexes = [];
let lastCardIndex = null;
let currentCardIndex = null;
let moveCount = 0;
let wrongMoves = 0;
let bestMoves = null;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Create a new individual card (as a list item) with an i child element with the class name representing its image
function createCard(className, cardIndex) {
    let newCard = document.createElement('li'); // create a list item to be used as a new card
    let newImage = document.createElement('i'); // create the card image based on className 
    newCard.classList.add('card');
    newCard.setAttribute('data-card-index', cardIndex); // create a reference to classname for matching purposes
    newImage.classList.add('fa');
    newImage.classList.add(className);
    newCard.appendChild(newImage);

    return newCard;
}

// Load a brand new game matrix with shuffled decks of cards
function loadNewGame() {
    shuffle(cardListArray);  // shuffle the cards
    
    document.querySelector(".deck").setAttribute("style", "display: flex");
    document.querySelector(".scoreboard").setAttribute("style", "display: none");

    // TESTING
    //document.querySelector(".deck").setAttribute("style", "display: none");
    //document.querySelector(".scoreboard").setAttribute("style", "display: block");


    let gameDeck = document.querySelector('.deck');
    gameDeck.innerHTML = ""; // reset to empty list again
    const newCardListFragment = document.createDocumentFragment();  // create fragment

    for (let i = 0; i < 16; i++) {
        //let newCard = document.createElement('li'); // create a list item to be used as a new card
        //newCard.classList.add(cardListArray[i]);    // add class name to it to determine its card image
        let newCard = createCard(cardListArray[i], i);
        newCardListFragment.appendChild(newCard);
    }

    gameDeck.appendChild(newCardListFragment);

}

loadNewGame();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function displayCard(cardTarget) {
    if (cardTarget.nodeName === 'LI') {
        cardTarget.classList.add('open');
        cardTarget.classList.add('show');
    }
}

function rightCards(lastCardIndex, currentCardIndex) {
    let lastCard = document.querySelector('li[data-card-index="' + lastCardIndex + '"]');
    let currentCard = document.querySelector('li[data-card-index="' + currentCardIndex + '"]');

    lastCard.classList.add('match');
    currentCard.classList.add('match');

    setTimeout(function(){
        lastCard.classList.remove('match');
        currentCard.classList.remove('match');
    
    }, 2000);

}

function wrongCards(lastCardIndex, currentCardIndex) {
    let lastCard = document.querySelector('li[data-card-index="' + lastCardIndex + '"]');
    let currentCard = document.querySelector('li[data-card-index="' + currentCardIndex + '"]');

    lastCard.classList.add('wrong');
    currentCard.classList.add('wrong');

    setTimeout(function(){
        lastCard.classList.remove('open');
        lastCard.classList.remove('show');
        lastCard.classList.remove('wrong');
        currentCard.classList.remove('open');
        currentCard.classList.remove('show');
        currentCard.classList.remove('wrong');
    
    }, 2000);

}

function incrementMoves() {
    moveCount++;
    document.querySelector('.moves').innerHTML = moveCount;
}

function resetMoves() {
    moveCount = 0;
    wrongMoves = 0;
    openCardIndexes = [];
    lastCardIndex = null;
    currentCardIndex = null;
    document.querySelector('.moves').innerHTML = moveCount;
}

function compareOpenCards(lastCardIndex, nextCardIndex) {
return cardListArray[lastCardIndex] === cardListArray[nextCardIndex] ? true : false; 
}

function wonGame() {
    let gameDeck = document.querySelector('.deck');
    gameDeck.innerHTML = ""; // reset to empty list again

    document.querySelector(".deck").setAttribute("style", "display: none");
    document.querySelector(".scoreboard").setAttribute("style", "display: block");
    
    if (bestMoves !== null) {
        moveCount < bestMoves ? bestMoves = moveCount : null // update best score if better
    } else {
        bestMoves = moveCount;
    }

    document.querySelector('#total-moves').innerHTML = moveCount;
    document.querySelector('#best-moves').innerHTML = bestMoves;
}

 // Card click listener
document.querySelector('.deck').addEventListener('click', function(e) {

    if ((e.target.nodeName === 'LI') && (openCardIndexes.length < 15)) {
        incrementMoves();

        if (openCardIndexes.length === 16) { // All cards opened - End Game

        } else if (openCardIndexes.length % 2 === 0) { // First card not open yet
            displayCard(e.target);
            lastCardIndex = e.target.getAttribute('data-card-index');
            openCardIndexes.push(lastCardIndex);
            console.log(openCardIndexes);
        } else if (openCardIndexes.length % 2 === 1) { // First card opened
            currentCardIndex = e.target.getAttribute('data-card-index');
            displayCard(e.target);
            if (compareOpenCards(lastCardIndex, currentCardIndex)) { // Matched!
                rightCards(lastCardIndex, currentCardIndex);
                openCardIndexes.push(currentCardIndex);
                console.log(openCardIndexes);
            } else { // Not a Match
                wrongCards(lastCardIndex, currentCardIndex);
                openCardIndexes.pop();
                console.log(openCardIndexes);
            }
        } 
    } else if ((e.target.nodeName === 'LI') && (openCardIndexes.length === 15)) {
        wonGame();
    }
})

// Restart Game
document.querySelector('.restart').addEventListener('click', function(e) {
    resetMoves();
    loadNewGame();
})
