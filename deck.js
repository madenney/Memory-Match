/**
 * Created by Matt on 6/6/2017.
 */

// Deck Object
function Deck(size) {
    this.test = "poop";
    var cards = [];
    // Create picture source array
    var picSrcArray = ["baseball.png", "bird.png", "sun.png", "tree.png", "house.png", "shoes.png",
        "horse.png", "guitar.png", "hamburger.png", "tv.png", "dog.png", "fish.png",
        "flower.png", "car.png", "airplane.png", "sword.png", "knight.png", "ant.png", "tools.png",
        "plant.png", "trash.png", "potatoes.png", "motorcycle.png", "table.png", "whale.png", "phone.png",
        "tennis.png", "hanger.png", "water.png", "8bitowl.png"];

    // Run constructor
    constructor();

    // This will run upon creation of a new deck
    function constructor(){
        createDeck();
        shuffle();
    }

    function createDeck(){
        // Make sure size is correct
        if (size % 2 !== 0) {
            console.log("Error: Cannot have an odd number of cards.");
            return;
        }

        // Add /images onto each element of the pic array
        for(var i = 0; i < picSrcArray.length; i++) {
            picSrcArray[i] = "images/" + picSrcArray[i];
        }

        // Create a deck sized picture array with two of each image
        var picArray = [];
        for(var i = 0; i < size/2; i++) {
            picArray.push(picSrcArray[i]);
            picArray.push(picSrcArray[i]);
        }

        // Create deck
        for(var i = 0; i < picArray.length; i++) {
            var card = {
                isClicked : false,
                isMatched : false,
                isKnown : false,
                picSrc : picArray[i],
                id : i,
                matchId : ++i
            };
            cards.push(card);
            var card = {
                isClicked : false,
                isMatched : false,
                isKnown : false,
                picSrc : picArray[i],
                id : i,
                matchId : i - 1
            };
            cards.push(card);
        }
    }

    // Shuffle the cards
    function shuffle() {

        var tempArray = [];
        var deckSize = cards.length;
        for (var i = 0; i < deckSize; i++) {
            tempArray.push(cards.pop());
        }

        // Loop through array and rebuild the deck in random order
        for (var i = 0; i < deckSize; i++) {
            // Get random value and use it as an index to push onto the new array
            x = Math.floor(Math.random() * tempArray.length);
            cards.push(tempArray[x]);

            // Replace the pushed input_array value with the last one to make room for .pop()
            tempArray[x] = tempArray[tempArray.length - 1];
            tempArray.pop();
        }
    }

    // Return an array of [id, picSrc] of size of deck
    this.getCardsInfo = function() {
        var cardsInfoArray = [];
        for (var i = 0; i < cards.length; i++) {
            var cardInfo = [cards[i].id, cards[i].picSrc];
            cardsInfoArray.push(cardInfo);
        }
        return cardsInfoArray;
    };

    this.getResizeInfo = function() {
        return cards;
    };

    this.peek = function() {
        for(var i = 0; i < cards.length; i++){
            this.flipCard(cards[i].id);
        }
        for(var i = 0; i < cards.length; i++){
            this.unflipCard(cards[i].id);
        }

    };

    // Get the id of the already clicked card
    this.getClickedCardId = function(){
        for(var i = 0; i < cards.length; i++){
            if (cards[i].isClicked == true) {
                return cards[i].id;
            }
        }
    };

    // Check to see if a card is clicked
    this.isACardClicked = function() {
        for(var i = 0; i < cards.length; i++){
            if (cards[i].isClicked == true) {
                return true;
            }
        }
        return false;
    };

    this.setMatched = function(id) {
        for(var i = 0; i < cards.length; i++){
            if (cards[i].id == id) {
                cards[i].isMatched = true;
            }
        }
    };

    this.setClicked = function(id) {
        for(var i = 0; i < cards.length; i++){
            if (cards[i].id == id) {
                cards[i].isClicked = true;
            }
        }
    };

    this.setUnclicked = function(id) {
        for(var i = 0; i < cards.length; i++){
            if (cards[i].id == id) {
                cards[i].isClicked = false;
            }
        }
    };

    // Check to see if a specific card is matched
    this.isMatched = function(id) {
        for(var i = 0; i < cards.length; i++){
            if (cards[i].id == id) {
                return cards[i].isMatched;
            }
        }
    };

    // Check to see if a specific card is clicked
    this.isClicked = function(id) {
        for(var i = 0; i < cards.length; i++){
            if (cards[i].id == id) {
                return cards[i].isClicked;
            }
        }
    };

    // Check two cards to see if they match
    this.checkMatching = function(id1, id2) {
        for(var i = 0; i < cards.length; i++){
            if (cards[i].id == id1) {
                if(cards[i].matchId == id2) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    };

    // Check to see if all cards are matched
    this.isEveryCardMatched = function() {
        for(var i = 0; i < cards.length; i++){
            if (cards[i].isMatched == false) {
                return false;
            }
        }
        return true;
    };

    // Get the id of the matching card
    this.getMatchId = function (id) {
        for(var i = 0; i < cards.length; i++){
            if (cards[i].id == id) {
                return cards[i].matchId;
            }
        }
    };

    this.getUnknown = function() {
        var newArray = [];
        for(var i = 0; i < cards.length; i++){
            if (!(cards[i].isKnown) && !(cards[i].isMatched)) {
                newArray.push(cards[i].id);
            }
        }
        return newArray;
    };

    this.getKnown = function() {
        var newArray = [];
        for(var i = 0; i < cards.length; i++){
            if (cards[i].isKnown && !(cards[i].isMatched)) {
                newArray.push(cards[i].id);
            }
        }
        return newArray;
    };

    this.setKnown = function(id, bool) {
        for(var i = 0; i < cards.length; i++){
            if (cards[i].id == id) {
                cards[i].isKnown = bool;
            }
        }
    };

    this.isKnown = function(id) {
        for(var i = 0; i < cards.length; i++) {
            if (cards[i].id = id) {
                return cards[i].isKnown;
            }
        }
    };

    this.flipCard = function(id) {
        var card = $("#" + id);
        var front = $(card).find(".front");
        var back = $(card).find(".back");
        var cardWidth = back.find("img").css("width");
        back.animate({
            width: 0
        }, 300, function () {
            back.addClass("hidden");
            front.css("width", 0);
            front.removeClass("hidden");
            front.animate({
                width: cardWidth
            }, 200);
        });
    };

    this.unflipCard = function(id) {
        setTimeout(function() {
            var card = $("#" + id);
            var front = $(card).find(".front");
            var back = $(card).find(".back");
            var cardWidth = front.css("width");
            front.animate({
                width: 0
            }, 300, function () {
                front.addClass("hidden");
                back.css("width", 0);
                back.removeClass("hidden");
                back.animate({
                    width: cardWidth
                }, 200);
            });

        }, 1000);
    };

    // Log the deck to the console, or just one card if given a parameter ( for testing)
    this.logCards = function(id, verbose){

        if(id == 0) {
            console.log("HERE");
            id = "0";
        }

        if(id) {
            for(var i = 0; i < cards.length; i++){
                if (cards[i].id == id) {
                    if(verbose){
                        console.log("Card #" + cards[i].id);
                        console.log(" - src : " + cards[i].picSrc);
                        console.log(" - matchID : " + cards[i].matchId);
                        console.log(" - isClicked : " + cards[i].isClicked);
                        console.log(" - isMatched : " + cards[i].isMatched);
                    } else {
                        console.log("Card #" + cards[i].id);
                    }
                }
            }
        } else {
            for(var i = 0; i < size; i++) {
                console.log("Card #" + cards[i].id);
                console.log(" - src : " + cards[i].picSrc);
                console.log(" - matchID : " + cards[i].matchId);
                console.log(" - isClicked : " + cards[i].isClicked);
                console.log(" - isMatched : " + cards[i].isMatched);
            }
        }
    };

    // return size
    this.getSize = function() {return size;};

}