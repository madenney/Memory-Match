/**
 * Created by Matt on 6/6/2017.
 */


// Game object
function Game(attempt) {

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
        console.log("Starting New Game");

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

        bot = new Bot(deck, 0, attempt);
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
    this.startNewRound = function() {
        console.log("Starting New Round");
        playerScoreStart = playerScore;
        botScoreStart = botScore;
        round++;
        increment += 100;
        removeCardContainers();
        createCardContainers(boardDimensions[round][0],boardDimensions[round][1]);
        deck = new Deck(boardDimensions[round][0] * boardDimensions[round][1]);
        deck.shuffle();
        fillCardContainers(deck.getCardsInfo());
        addCardEventListeners(deck);
        $(".click-blocker").addClass("hidden");

        bot = new Bot(deck, round, attempt);

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
            game.usePointsDoubler();
        });

        // Ability 2
        $(".ability2").click(function() {
            if($(this).hasClass("used-ability")) {return;}
            $(this).addClass("used-ability");
            game.usePeek();
        });

        // Ability 3
        $(".ability3").click(function() {
            if($(this).hasClass("used-ability")) {return;}
            $(this).addClass("used-ability");
            removeCardContainers();
            createCardContainers(boardDimensions[round][0],boardDimensions[round][1]);
            deck = new Deck(boardDimensions[round][0] * boardDimensions[round][1]);
            deck.shuffle();
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
        boxContainer.css("margin-top", ((gameAreaHeight - maxBoxSideLength * y) / 3));

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

    function fillCardContainers(infoArray) {

        $(".cardContainer").each( function(i) {

            // Get cardContainer width
            var cardWidth = $(this).css("width");

            // Create Card
            var card = $("<div>").addClass("card").attr("id", infoArray[i][0]);
            card.css({"width":cardWidth, "height":cardWidth});

            // Create front of card
            var front = $("<div>").addClass("front hidden");
            front.css({"width":cardWidth, "height":cardWidth});
            var frontImage = $("<img>");

            // Do some math to make sure the picture fits nicely within the container
            var cardWidthNum = Number(cardWidth.substring(0,cardWidth.indexOf("p")));
            // Had to insert this to get the cards to scale as the board becomes more compressed. I need to tweak this a bit
            var borderScaler = (9/150) * cardWidthNum;
            frontImage.css({"width":(cardWidthNum - 20) + "px", "height":(cardWidthNum - 20)+ "px",
                "margin-top": 10, "border-width": (borderScaler * 0.8) , "border-radius": (borderScaler * 0.9)});
            frontImage.attr("src", infoArray[i][1]);
            front.append(frontImage);
            card.append(front);

            // Create back of card
            var back = $("<div>").addClass("back");
            back.css({"width":cardWidth, "height":cardWidth});
            var backImage = $("<img>").attr("src", "images/crafting_table.png");
            backImage.css({"width":cardWidth, "height":cardWidth});
            back.append(backImage);
            card.append(back);

            // Append the card to the cardContainer
            $(this).append(card);
        });
    }

    // Add Card listeners
    function addCardEventListeners(deck) {
        $(".card").click(function() {
            // Log the card info
            //deck.logCards(this.id, false);

            // Unhide reset button
            $(".reset").removeClass("hidden");

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
                flipCard(this.id);
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
                        $(".player-score .value").text(game.incrementPlayerScore());
                    }, 700);

                    // Check for the end of the round, if yes, then start new round
                    if(deck.isEveryCardMatched()) {
                        setTimeout(function(){
                            if (game.getPlayerScore() >= game.getBotScore()){
                                game.startNewRound();
                            } else {
                                attempts++;
                                game = new Game(attempts);
                            }

                        }, 1600);
                    }
                } else {
                    // If not matched, then unflip both cards
                    unflipCard(otherCardId);
                    unflipCard(this.id);
                    // Change info of both card objects
                    deck.setUnclicked(this.id);
                    deck.setUnclicked(otherCardId);

                    $(".click-blocker").removeClass("hidden");
                    setTimeout(function() {
                        game.botsTurn();
                    }, 1500);
                }
            } else {
                // If its the first card clicked, then flip it and change card info
                flipCard(this.id);
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
            var p = $("<div>").addClass("pointsAnimation").text("+" + game.getIncrement()/2);

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

    function flipCard(id) {
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
    }

    function unflipCard(id) {
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
    }


    this.botsTurn = function() {
        if (pointsDoubler){
            $(".ability1").removeClass("using-ability");
            $(".ability1").addClass("used-ability");
        }
        pointsDoubler = false;
        bot.makeMove();
    };

    this.usePointsDoubler = function() {
        pointsDoubler = true;
    };

    this.usePeek = function() {
        deck.peek();
    };


    this.changeAbility2 = function(bool) {
        ability2 = bool;
    };

    this.isAbility1 = function() {
        return isAbility1;
    };

    this.isAbility2 = function() {
        return isAbility2;
    };

    this.incrementIncrement = function() {
        increment += 100;
    };

    this.incrementBotScore = function() {
        botScore += increment;
        return botScore;
    };

    this.incrementPlayerScore = function() {
        if(pointsDoubler){
            playerScore += increment*2;
        } else {
            playerScore += increment;
        }
        return playerScore;
    };

    this.getIncrement = function() {
        if(pointsDoubler){
            return increment*2;
        } else {
            return increment;
        }
    };

    this.getBotScore = function() {
        return botScore;
    };

    this.getPlayerScore = function() {
        return playerScore;
    };

    this.setPlayerTurn = function(bool) {
        isPlayerTurn = bool;
        if (isPlayerTurn) {
            $(".click-blocker").removeClass("hidden");
        } else {
            $(".click-blocker").addClass("hidden");
        }
    };

    this.isPlayerTurn = function() {
        return isPlayerTurn;
    };
}