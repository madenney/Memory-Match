/**
 * Created by Matt on 6/6/2017.
 */


// Game object
function Game(attempts) {

    var self = this;
    var isPlayerTurn = true;
    var playerScore;
    var botScore;
    var playerScoreStart;
    var botScoreStart;
    var increment;
    var round = 0;
    var pointsDoubler = false;
    var ability1 = false;
    var ability2 = false;
    var ability3 = false;
    var boardDimensions = [[3,2],[4,3],[4,4],[5,4],[6,4],[6,5],[6,6],[7,6],[8,6],[8,7]];
    var deck;
    var bot;


    newGame();

    // This will run upon the creation of a new game
    function newGame() {

        // Reset Score
        playerScore = 0;
        botScore = 0;
        increment = 100;
        round = 0;

        // In case card elements already exist, delete them
        removeCardContainers();

        // Reset Dom
        $(".player-score .value").text(playerScore);
        $(".enemy-score .value").text(botScore);
        createCardContainers(boardDimensions[round][0],boardDimensions[round][1]);
        deck = new Deck(boardDimensions[round][0] * boardDimensions[round][1]);
        fillCardContainers(deck.getCardsInfo());
        addCardEventListeners(deck);
        addAbilityEventListeners();

        bot = new Bot(deck, 0, attempts, self);
        // Log the bots memory if the owl is clicked
        //$("#enemy-area img").click(function() {bot.makeMove();});

        // Log the bots memory if Olly clicked
        //$("#enemy-area .player-title").click(function() {deck.logKnownCards();});

        // Hide Abilities
        $(".ability1").addClass("hidden");
        $(".ability2").addClass("hidden");
        $(".ability3").addClass("hidden");

        // Hide reset button
        $(".reset").addClass("hidden");

    };

    // Basically the same thing as the constructor, but it doesn't reset the score
    function startNewRound() {
        playerScoreStart = playerScore;
        botScoreStart = botScore;
        round++;

        // Check for end of game
        if(round > 9){
            $("#win-screen").removeClass('hidden');
            newGame();
        }


        increment += 100;
        removeCardContainers();
        createCardContainers(boardDimensions[round][0],boardDimensions[round][1]);
        deck = new Deck(boardDimensions[round][0] * boardDimensions[round][1]);
        fillCardContainers(deck.getCardsInfo());
        addCardEventListeners(deck);
        $(".click-blocker").addClass("hidden");

        bot = new Bot(deck, round, attempts, self);

        // Ability 1
        if(round >= 1) {
            $(".ability1").removeClass("hidden");
            $(".ability1").removeClass("using-ability");
            $(".ability1").removeClass("used-ability");
            pointsDoubler = false;
        }

        // Ability2
        if(round >= 2) {
            $(".ability2").removeClass("hidden");
            $(".ability2").removeClass("used-ability");
        }

        // Ability 3
        if(round >=3) {
            $(".ability3").removeClass("hidden");
            $(".ability3").removeClass("used-ability");
        }
    };

    function addAbilityEventListeners() {
        // Ability 1
        $(".ability1").click(function() {
            if($(this).hasClass("using-ability") || $(this).hasClass("used-ability")) {return;}
            $(this).addClass("using-ability");
            usePointsDoubler();
        });

        // Ability 2
        $(".ability2").click(function() {
            if($(this).hasClass("used-ability")) {return;}
            $(this).addClass("used-ability");
            usePeek();
        });

        // Ability 3
        $(".ability3").click(function() {
            if($(this).hasClass("used-ability")) {return;}
            $(this).addClass("used-ability");
            removeCardContainers();
            createCardContainers(boardDimensions[round][0],boardDimensions[round][1]);
            deck = new Deck(boardDimensions[round][0] * boardDimensions[round][1]);
            fillCardContainers(deck.getCardsInfo());
            addCardEventListeners(deck);
            playerScore = playerScoreStart;
            botScore = botScoreStart;
            $(".player-score .value").text(playerScore);
            $(".enemy-score .value").text(botScore);
        });
    };

    function removeCardContainers() {
        $("#game-area .card").remove();
        $("#game-area .deckContainer").remove();
    }

    function createCardContainers(x, y) {

        // Boxes are the containers for each card.
        // They start at a width and height of 150 and are reduced if necessary
        // This is done by measuring the size of the game area and dividing the height and width by number of rows and columns, respectively
        // If there isn't enough room, then each box is set to the width or height, whichever is smaller, in order to maintain a square shape

        var maxBoxSideLength = 150;
        //$("#game-area").css("height", "80vh");
        var gameAreaWidth = $("#game-area").css("width");
        var gameAreaHeight = $("#game-area").css("height");
        gameAreaWidth = Number(gameAreaWidth.substring(0, gameAreaWidth.indexOf("p")));
        gameAreaHeight = Number(gameAreaHeight.substring(0, gameAreaHeight.indexOf("p")));
        // Subtract 20 to account for 5px margin and 5px padding
        gameAreaHeight = gameAreaHeight - 20;
        gameAreaWidth = gameAreaWidth - 30;

        // make sure the boxes can fit in the container
        if (maxBoxSideLength * y > gameAreaHeight) {
            maxBoxSideLength = gameAreaHeight / y;
        }
        if (maxBoxSideLength * x > gameAreaWidth) {
            maxBoxSideLength = gameAreaWidth / x;
        }

        // Create the single container for all the boxes
        var boxContainer = $("<div>");
        boxContainer.css("width", maxBoxSideLength * x);
        boxContainer.css("height", maxBoxSideLength * y);
        boxContainer.addClass("deckContainer");
        // Add a margin to the top if the screen is bigger than mobile
        if(screen.width > 400) {
            boxContainer.css("margin-top", ((gameAreaHeight - maxBoxSideLength * y) / 3));
        } else {
            //$("#game-area").css("height", "auto");
            $("#mobile-area").css("width", (maxBoxSideLength * x) + 20);
        }

        // A nested loop to create all the rows and columns
        for (var i = 0; i < y; i++) {
            var row = $("<div>");
            row.css({"width": "100%", "height" : ""+ maxBoxSideLength });
            for (var j = 0; j < x; j++) {
                var cardContainer = $("<div>");
                cardContainer.addClass("cardContainer");
                cardContainer.css({"width" : "" + maxBoxSideLength, "height" : "" + maxBoxSideLength});
                row.append(cardContainer);
            }
            boxContainer.append(row);
        }

        $("#game-area").append(boxContainer);
    }

    // Using the array of values given by the deck object, fill each card container with a card
    function fillCardContainers(infoArray) {

        $(".cardContainer").each( function(i) {

            // Create Card
            var card = $("<div>").addClass("card").attr("id", infoArray[i][0]);

            // Create front of card
            var front = $("<div>").addClass("front hidden");
            var frontImage = $("<img>").attr("src", infoArray[i][1]);;

            // Do some math to make sure the picture fits nicely within the container
            // Had to insert this to get the cards to scale as the board becomes more compressed.
            // var borderScaler = (9/150) * cardWidthNum;
            // frontImage.css({"border-width": (borderScaler * 0.8) , "border-radius": (borderScaler * 0.9)});
            // if(screen.width > 400) {
            //     frontImage.css({"margin-top": 10,"width":(cardWidthNum - 20) + "px", "height":(cardWidthNum - 20)+ "px"});
            // } else {
            //     frontImage.css({"margin-top": 2.5,"width":(cardWidthNum - 5) + "px", "height":(cardWidthNum - 5)+ "px"});
            // }

            front.append(frontImage);
            card.append(front);

            // Create back of card
            var back = $("<div>").addClass("back");
            var backImage = $("<img>").attr("src", "images/crafting_table.png");
            back.append(backImage);
            card.append(back);

            // Append the card to the cardContainer
            $(this).append(card);
        });
    }

    // Add Card listeners
    function addCardEventListeners(deck) {
        $(".card").click(function() {

            // Check if this card is already clicked or matched, if yes, then return
            if (deck.isClicked(this.id)){return;}
            if (deck.isMatched(this.id)){return;}

            // Add to memory
            deck.setKnown(this.id, true);

            // Check to see if another card is already flipped
            if (deck.isACardClicked()) {
                // Get the id of the other flipped card
                var otherCardId = deck.getClickedCardId();

                // Flip this card
                deck.flipCard(this.id);
                deck.setClicked(this.id);

                // If matched
                if(this.id == deck.getMatchId(otherCardId)) {
                    // Change the info inside the card object
                    deck.setMatched(this.id);
                    deck.setMatched(otherCardId);
                    deck.setUnclicked(this.id);
                    deck.setUnclicked(otherCardId);

                    // Add the points animation
                    pointsAnimation(this.id);
                    pointsAnimation(otherCardId);

                    // Add to player score
                    setTimeout(function() {
                        $(".player-score .value").text(incrementPlayerScore());
                    }, 700);

                    // Check for the end of the round, if yes, then start new round
                    if(deck.isEveryCardMatched()) {
                        setTimeout(function(){
                            if (playerScore >= botScore){
                                startNewRound();
                            } else {
                                attempts++;
                                $("#lose-screen").removeClass("hidden");
                                newGame();
                            }

                        }, 1600);
                    }
                } else {
                    // If not matched, then unflip both cards
                    deck.unflipCard(otherCardId);
                    deck.unflipCard(this.id);
                    // Change info of both card objects
                    deck.setUnclicked(this.id);
                    deck.setUnclicked(otherCardId);

                    $(".click-blocker").removeClass("hidden");
                    setTimeout(function() {
                        botsTurn();
                    }, 1500);
                }
            } else {
                // If its the first card clicked, then flip it and change card info
                deck.flipCard(this.id);
                deck.setClicked(this.id);
            }
        });
    }

    function pointsAnimation(cardId) {
        // Time to make sure it doesn't happen too quickly for the user to see the flipped card
        setTimeout(function() {
            // Remove the front and back divs
            $("#" + cardId + " .front").remove();
            $("#" + cardId + " .back").remove();
            // Create the points div, make it equal to points increment divided by two (because two cards)
            var p = $("<div>").addClass("pointsAnimation").text("+" + increment/2);

            // Get height of cards and do some math to figure out how margin-top value
            var cardHeight = $("#" + cardId).css("height");
            cardHeight = cardHeight.substring(0,cardHeight.indexOf("p"));
            p.css("margin-top", (cardHeight - 35)/2);

            // Add the p div, animate it, and then remove it
            $("#" + cardId).append(p);
            p.animate({
                opacity: 0,
                'margin-top': (((cardHeight-35)/2) - 15)
            }, 700, function(){
                $("#" + cardId).remove();
            });
        }, 750);
    }

    this.resize = function() {

        // Rebuild Board
        removeCardContainers();
        createCardContainers(boardDimensions[round][0],boardDimensions[round][1]);
        fillCardContainers(deck.getCardsInfo());
        addCardEventListeners(deck);

        // Get rid of cards that are already flipped
        var cards = deck.getResizeInfo();
        for(var i = 0; i < cards.length; i++) {
            if(cards[i].isMatched) {
                $("#" + cards[i].id + " .front").remove();
                $("#" + cards[i].id + " .back").remove();
            }
        }
    };


    function botsTurn() {
        if (pointsDoubler){
            $(".ability1").removeClass("using-ability");
            $(".ability1").addClass("used-ability");
        }
        pointsDoubler = false;
        bot.makeMove();
    }

    function usePointsDoubler() {
        pointsDoubler = true;
    }

    function usePeek() {
        deck.peek();
    }

    this.getIncrement = function() {
        return increment;
    };

    this.incrementBotScore = function() {
        botScore += increment;
        return botScore;
    };

    this.botStartNewRound = function() {
        startNewRound();
    }

    function incrementPlayerScore() {
        if(pointsDoubler){
            playerScore += increment*2;
        } else {
            playerScore += increment;
        }
        return playerScore;
    }
}