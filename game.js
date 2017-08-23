/**
 * Created by Matt on 6/6/2017.
 */


// Game object
function Game(attempt0) {

    var attempt = attempt0;
    var isPlayerTurn = true;
    var playerScore = 0;
    var botScore = 0;
    var playerScoreStart;
    var botScoreStart;
    var increment = 100;
    var round = 0;
    var pointsDoubler = false;
    var ability1 = false;
    var ability2 = false;
    var ability3 = false;
    var boardDimensions = [[3,2],[4,3],[4,4],[5,4],[6,4],[6,5],[6,6],[7,6],[8,6],[8,7]];
    var deck;
    var bot;

    // This will run upon the creation of a new game
    this.constructor = function () {
        console.log("Starting New Game");
        removeCardContainers();
        $(".player-score .value").text(playerScore);
        $(".enemy-score .value").text(botScore);
        createCardContainers(boardDimensions[round][0],boardDimensions[round][1]);
        deck = new Deck(boardDimensions[round][0] * boardDimensions[round][1]);
        deck.shuffle();
        fillCardContainers(deck.getCardsInfo());
        addCardEventListeners(deck);
        this.addAbilityEventListeners();

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

    this.addAbilityEventListeners = function() {
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

    this.constructor();
}