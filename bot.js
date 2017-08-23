/**
 * Created by Matt on 6/6/2017.
 */


function Bot(deck0, round0, attempt0) {

    var round = round0;
    var attempt = attempt0;
    var deck = deck0;
    var beginPhrase = ["Let's Begin. Good luck, human.", "Go ahead. Give it another shot.", "Not giving up yet?",
                        "Your persistence is admirable", "Again? I can do this all day.", "You should stop trying.",
                        "I can't belive you are still trying.", "I grow bored of beating you at this.",
                        "You are just wasting your time.", "You can stop trying whenever you want.",
                        "Your persistence is foolish.", "You are foolish for still trying.", "You will never defeat me."];
    var pastRound = ["Well done. You beat round one.", "Alright, let's make this harder.", "It only gets harder from here.",
                    "Well played.", "Most humans don't get this far.", "You are about halfway done. Maybe.",
                    "Not bad. I'll start trying now.", "You have excellent memory, for a human.", "I am now convinced you are cheating.",
                    "Cheater.", "I'm still not letting you win.", "Go ahead, keep playing."];
    var newMatch = ["Thanks for the help."];
    var missedMatch = ["You missed this one."];
    var luckyGuess = ["A lucky guess, but I'll take it."];

    this.constructor = function(){

        if(round == 0) {
            if(attempt > 12) {
                $(".speech-bubble").text(beginPhrase[12]);
            } else {
                $(".speech-bubble").text(beginPhrase[attempt]);
            }
        } else {
            $(".speech-bubble").text(pastRound[round]);
        }
    };

    var botFlipCard = function(id) {
        // Log the card info
        //deck.logCards(id, false);

        // Add to memory
        deck.setKnown(id, true);

        // Check to see if another card is already flipped
        if (deck.isACardClicked()) {
            // Set a time out so the bot doesn't flip both cards at the same time
            setTimeout(function() {
                // Get the id of the other flipped card
                var otherCardId = deck.getClickedCardId();

                // Flip this card
                flipCard(id);
                deck.setClicked(id);

                // If matched
                if(id == deck.getMatchId(otherCardId)) {
                    // Change the info inside the card object
                    deck.setMatched(id);
                    deck.setMatched(otherCardId);
                    deck.setUnclicked(id);
                    deck.setUnclicked(otherCardId);

                    // Add the points animation
                    pointsAnimation(id);
                    pointsAnimation(otherCardId);

                    // Add to enemy score
                    $(".enemy-score .value").text(game.incrementBotScore());

                    // Check for the end of the round, if yes, then start new round
                    if(deck.isEveryCardMatched()) {
                        setTimeout(function(){game.startNewRound();}, 1600);
                    }
                } else {
                    // If not matched, then unflip both cards
                    unflipCard(otherCardId);
                    unflipCard(id);
                    // Change info of both card objects
                    deck.setUnclicked(id);
                    deck.setUnclicked(otherCardId);
                }
                $(".click-blocker").addClass("hidden");
            }, 800);

        } else {
            // If its the first card clicked, then flip it and change card info
            flipCard(id);
            deck.setClicked(id);
        }
    };

    this.makeMove = function () {

        // Get array of known id's
        var memory = deck.getKnown();

        // Check if any known cards match already
        for(var i = 0; i < memory.length; i++){
            for(var j = i + 1; j < memory.length; j++){
                if(deck.checkMatching(memory[i], memory[j])) {
                    botFlipCard(memory[i]);
                    botFlipCard(memory[j]);
                    return;
                }
            }
        }

        // Choose randomly from unmatched and unknown cards
        var unknown = deck.getUnknown();
        var randomId = unknown[Math.floor(Math.random() * unknown.length)];
        botFlipCard(randomId);

        // If randomly chosen card matches with a known card
        for(var i = 0; i < memory.length; i++) {
            if(deck.checkMatching(memory[i], randomId)) {
                setTimeout(function() {
                    botFlipCard(memory[i]);
                }, 200);
                return;
            }
        }

        // Choose another random card
        unknown = deck.getUnknown();
        var randomId2 = unknown[Math.floor(Math.random() * unknown.length)];
        botFlipCard(randomId2);

    };

    this.constructor();
}