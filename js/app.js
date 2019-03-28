/*
 * Constants for Max number of moves to retain 3, 2 or 1 stars
*/
const WRONG_MOVE_3_STAR_LIMIT = 26;
const WRONG_MOVE_2_STAR_LIMIT = 34;
const WRONG_MOVE_1_STAR_LIMIT = 42;

/*
 * Create a list that holds all of your cards.
 * Cards are represented by their font-awesome's classname for efficiency
 * Keep tabs of which cards have been opened
 * Counter for number of total moves, number of wrong moves & best score
 */

let cardListArray = ['fa-anchor', 'fa-anchor', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-diamond', 'fa-diamond', 'fa-leaf', 'fa-leaf', 'fa-paper-plane-o', 'fa-paper-plane-o'];
let openCardIndexes = [];
let lastCardIndex = null;
let currentCardIndex = null;
let moveCount = 0;
let wrongMoves = 0;
let currentTimeSeconds = 0;
let currentTimeReadable = "00:00";
let currentTimerRef = null;
let bestMoves = null;
let bestTimeSeconds = null;

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

// Convert time in seconds to a readable format
function timeConverter(totalSeconds) {
    var readableTime;
    var minutes;
    var seconds;
    
    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      seconds = Math.round(totalSeconds % 60);
    } else {
      minutes = 0;
      seconds = totalSeconds;
    }
    
    if (minutes >= 10 && seconds >= 10) {
      readableTime = minutes.toString() + ":" + seconds.toString();
    } else if (minutes >= 10 && seconds < 10) {
      readableTime = minutes.toString() + ":0" + seconds.toString();    
    } else if (minutes < 10 && seconds >= 10) {
      readableTime = "0" + minutes.toString() + ":" + seconds.toString();    
    } else if (minutes < 10 && seconds < 10) {
      readableTime = "0" + minutes.toString() + ":0" + seconds.toString();
    }
    
    return readableTime;
}

// Game Timer Start. Updates timer on score board starting from 0
function startTimer() {
    currentTimeSeconds = 0;
    currentTimeReadable = "00:00";
    document.querySelector('.game-timer').innerHTML = currentTimeReadable;

    let timer = setInterval(function(){
        currentTimeSeconds++;
        currentTimeReadable = timeConverter(currentTimeSeconds);
        document.querySelector('.game-timer').innerHTML = currentTimeReadable;
    }, 1000);

    return timer;
}

// Game Timer Stop. Updates timer on score boards. Checks and replaces best times if needed.
function stopTimer(timer) {

    document.querySelector('#time-taken').innerHTML = currentTimeReadable;
    // if currentTime < bestTime, replace bestTime
    if (bestTimeSeconds !== null) {
        if (bestTimeSeconds > currentTimeSeconds) {
            bestTimeSeconds = currentTimeSeconds;            
            document.querySelector('#best-time').innerHTML = currentTimeReadable;
            console.log("New Best Time - bestTimeSeconds", bestTimeSeconds);
            console.log("New Best Time - currentTimeSeconds", currentTimeSeconds);
                }
    } else {
        // first time running, set current time as best time
        bestTimeSeconds = currentTimeSeconds;            
        document.querySelector('#best-time').innerHTML = currentTimeReadable;
        console.log("First Time - bestTimeSeconds", bestTimeSeconds);
        console.log("First Time - currentTimeSeconds", currentTimeSeconds);
        }


    // Reset
    clearInterval(timer);
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
    
    updateStarRating(); // reset stars
    currentTimerRef = startTimer(); // start game timer

    // show game deck and hide scoreboard
    document.querySelector(".deck").setAttribute("style", "display: flex");
    document.querySelector(".scoreboard").setAttribute("style", "display: none");

    let gameDeck = document.querySelector('.deck');
    gameDeck.innerHTML = ""; // reset to empty list again
    const newCardListFragment = document.createDocumentFragment();  // use fragment to optimise load

    for (let i = 0; i < 16; i++) { // populate all cards for board inside fragment
        let newCard = createCard(cardListArray[i], i);  
        newCardListFragment.appendChild(newCard);       
    }

    gameDeck.appendChild(newCardListFragment); // add populated cards to deck

}

// Display card currently targeted
function displayCard(cardTarget) {
    if (cardTarget.nodeName === 'LI') {
        cardTarget.classList.add('open');
        cardTarget.classList.add('show');
    }
}

// Show that 2 cards are right and matching
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

// Show that 2 cards are wrong and not matching
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

// Increment number of moves made
function incrementMoves() {
    moveCount++;
    document.querySelector('.moves').innerHTML = moveCount;
}

// Update Star Rating depending on move limits set for 3, 2 & 1 stars
function updateStarRating() {
    let topStars = document.querySelector('.stars');
    let scoreboardStars = document.querySelector('#star-rating');

    if (moveCount > 15) { // minimum possible moves
        if (moveCount < WRONG_MOVE_3_STAR_LIMIT) {
            topStars.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
            scoreboardStars.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
        } else if (moveCount < WRONG_MOVE_2_STAR_LIMIT) {
            topStars.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
            scoreboardStars.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
        } else if (moveCount < WRONG_MOVE_1_STAR_LIMIT) {
            topStars.innerHTML = '<li><i class="fa fa-star"></i></li>';
            scoreboardStars.innerHTML = '<li><i class="fa fa-star"></i></li>';
        }
    } else if (moveCount === 0) {
        topStars.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
        scoreboardStars.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
    }
}

// Reset number of moves and all related variables
function resetMoves() {
    moveCount = 0;
    wrongMoves = 0;
    openCardIndexes = [];
    lastCardIndex = null;
    currentCardIndex = null;
    document.querySelector('.moves').innerHTML = moveCount;
    updateStarRating();
}

// Check if two cards are matching
function cardsAreMatching(lastCardIndex, nextCardIndex) {
    return cardListArray[lastCardIndex] === cardListArray[nextCardIndex] ? true : false; 
}

// Check if clicked card is already open
function isClickedCardAlreadyOpen(clickedCardIndex) {
    return openCardIndexes.indexOf(clickedCardIndex) !== -1 ? true : false;
}

// Game has been Won. Hide deck and show score board. Update bestMoves if necessary
function wonGame() {
    let gameDeck = document.querySelector('.deck');
    gameDeck.innerHTML = ""; // reset to empty list again

    stopTimer(currentTimerRef);

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

// Open Card function
function openCard(clickedCard, clickedCardIndex) {
    if (openCardIndexes.length % 2 === 0) { // Open First card
        displayCard(clickedCard);
        lastCardIndex = clickedCardIndex;
        openCardIndexes.push(lastCardIndex);
    } else if (openCardIndexes.length % 2 === 1) { // Open Second Card
        currentCardIndex = clickedCardIndex;
        displayCard(clickedCard);
        if (cardsAreMatching(lastCardIndex, currentCardIndex)) { // Matched!
            rightCards(lastCardIndex, currentCardIndex);
            openCardIndexes.push(currentCardIndex);
        } else { // Not a Match
            wrongCards(lastCardIndex, currentCardIndex);
            openCardIndexes.pop();
        }
    }     
}

/*
 * Click Handers 
*/

 // Card click handler
document.querySelector('.deck').addEventListener('click', function(e) {
    let clickedCard = e.target;
    let clickedCardIndex = clickedCard.getAttribute('data-card-index');
    
    if ((clickedCard.nodeName === 'LI') && (openCardIndexes.length < 15)) { 
        updateStarRating();
        if (!isClickedCardAlreadyOpen(clickedCardIndex)) {
            incrementMoves();
            openCard(clickedCard, clickedCardIndex);    
        }

    } else if ((clickedCard.nodeName === 'LI') && (openCardIndexes.length === 15)) { // Last card & Game Win

        if (!isClickedCardAlreadyOpen(clickedCardIndex)) {
            incrementMoves();
            displayCard(clickedCard);
            setTimeout(function() {
                wonGame();
            }, 1000);
        }
    }
})

// Restart Game click handler
document.querySelector('.restart').addEventListener('click', function(e) {
    resetMoves();
    loadNewGame();
})

// Play Again click handler
document.querySelector('.play-again').addEventListener('click', function(e) {
    resetMoves();
    loadNewGame();
})


// #### START GAME ####
loadNewGame();