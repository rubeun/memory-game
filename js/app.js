/*
 * Create a list that holds all of your cards.
 * Cards are represented by their font-awesome's classname for efficiency
 */
let cardListArray = ['fa-anchor', 'fa-anchor', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-diamond', 'fa-diamond', 'fa-leaf', 'fa-leaf', 'fa-paper-plane-o', 'fa-paper-plane-o'];

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
function createCard(className) {
    let newCard = document.createElement('li'); // create a list item to be used as a new card
    let newImage = document.createElement('i'); // create the card image based on className 
    newCard.classList.add('card');
    newCard.classList.add('open'); // !DEBUG
    newCard.classList.add('show'); // !DEBUG
    newImage.classList.add('fa');
    newImage.classList.add(className);
    newCard.appendChild(newImage);

    return newCard;
}

// Load a brand new game matrix with shuffled decks of cards
function loadNewGame(cardListArray) {
    shuffle(cardListArray);  // shuffle the cards
    let gameDeck = document.querySelector('.deck');

    const newCardListFragment = document.createDocumentFragment();  // create fragment

    for (let i = 0; i < 16; i++) {
        //let newCard = document.createElement('li'); // create a list item to be used as a new card
        //newCard.classList.add(cardListArray[i]);    // add class name to it to determine its card image
        let newCard = createCard(cardListArray[i]);
        newCardListFragment.appendChild(newCard);
    }

    gameDeck.appendChild(newCardListFragment);

}

loadNewGame(cardListArray);

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
