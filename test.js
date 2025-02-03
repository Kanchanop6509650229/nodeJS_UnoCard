const UnoFlipDeck = require("./unoClass/unoFlipDeck.js");
const UnoField = require("./unoClass/unoField.js");
const UnoPlayer = require("./unoClass/unoPlayer.js");
const UnoCard = require("./unoClass/unoCard.js");
const UnoGameState = require("./unoClass/unoGameState.js");
const Bot = require("./unoClass/unoBot.js");
const GameManager = require("./unoClass/unoGameManager.js");
const GameAction = require("./unoClass/unoGameAction.js");

console.log("=== Starting UNO Flip System Tests ===\n");

// Create game components
console.log("1. Testing game creation");
const deck = new UnoFlipDeck();
const field = new UnoField(deck);
const state = new UnoGameState(deck, field);
console.log("Deck and field created successfully");
console.log("Initial deck size:", deck.getCurrentDeckSize());
console.log("Top card on field:", field.getTopCard().getCurrentSide());

// Create players and deal cards
console.log("\n2. Testing player creation and card dealing");
const player1 = new UnoPlayer("Player 1", deck.drawCard(7));
const player2 = new UnoPlayer("Player 2", deck.drawCard(7));
console.log("Remaining cards in deck:", deck.getCurrentDeckSize());

console.log("Player 1 cards:");
player1.getHand().forEach((card, i) => {
  console.log(`Card ${i + 1}:`, card.getCurrentSide());
});
console.log("Player 1 card count:", player1.getHandCardCount());

// Test UNO call
console.log("\n3. Testing UNO call");
console.log("Call UNO with 7 cards:", player1.callUno());

// Test card playing
console.log("\n4. Testing card play");
console.log("Top card on field:", field.getTopCard().getCurrentSide());
console.log("Playable cards:", player1.findPlayableCards(field));

// Test wild card play
console.log('\n5. Testing Wild card play');
console.log('Current field color:', field.getCurrentColor());
// Simulate wild card
const wildCard = new UnoCard(
    { value: "wild", color: "wild", type: "special" },
    { value: "wild", color: "wild", type: "special" }
);
// Assume player has wild card
try {
    player1.drawCard([wildCard]);
    const wildCardIndex = player1.getHand().findIndex(card => card.getColor() === 'wild');
    if (wildCardIndex !== -1) {
        console.log('Playing wild card');
        const playedCard = player1.playCard(wildCardIndex, field);
        field.addCard(playedCard);
        field.setWildColor('red');
        console.log('Set color to red');
        console.log('Current field color:', field.getCurrentColor());
        console.log("New top card on field:", field.getTopCard().getCurrentSide());
        
        // Test playing card matching wild color
        const redCard = new UnoCard(
            { value: 5, color: "red", type: "number" },
            { value: 5, color: "pink", type: "number" }
        );
        player1.drawCard([redCard]);
        const redCardIndex = player1.getHand().length - 1;
        console.log('\nTest playing red card matching wild color:');
        console.log('Can play red card:', player1.canPlay(redCardIndex, field));
        
        // Test playing card matching previous value
        const sameValueCard = new UnoCard(
            { value: field.getCurrentValue(), color: "blue", type: "number" },
        );
        player1.drawCard([sameValueCard]);
        const valueCardIndex = player1.getHand().length - 1;
        console.log('\nTest playing card with matching value:');
        console.log('Can play same value card:', player1.canPlay(valueCardIndex, field));
    }
} catch (error) {
    console.error('Error playing wild card:', error.message);
}

// Test deck flipping
console.log("\n6. Testing deck flip");
console.log("Pre-flip state:", deck.isDeckFlipped());
deck.flipDeck();
field.flipField();
console.log("Post-flip state:", deck.isDeckFlipped());
console.log("Top card after flip:", field.getTopCard().getCurrentSide());

// Test drawing until color
console.log("\n7. Testing draw until color");
const drawnCards = deck.drawUntilColor("teal");
console.log("Cards drawn until teal:", drawnCards.length);
console.log(
  "Last drawn card:",
  drawnCards[drawnCards.length - 1].getCurrentSide()
);

// Test special card effects
console.log("\n8. Testing special cards");
console.log("Current direction:", field.getDirection());
try {
    field.reverseDirection();
    console.log("Direction after reverse:", field.getDirection());
} catch (error) {
    console.error('Error reversing direction:', error.message);
}

// Test deck regeneration
console.log("\n9. Testing deck regeneration");
const originalSize = deck.getCurrentDeckSize();
deck.clearDeck();
const newCard = deck.drawCard();
console.log("Drawn card after regeneration:", newCard[0].getCurrentSide());

console.log("\n10. Testing player management");
state.addPlayer(player1);
state.addPlayer(player2);
state.getPlayers().forEach((player, i) => {
  console.log(`Player ${i + 1}:`, player.name);
});
state.removePlayer(player2);
state.getPlayers().forEach((player, i) => {
  console.log(`Player ${i + 1}:`, player.name);
})
state.addPlayer(player2);

console.log("\n11. Testing current player");
console.log("Current player:", state.getCurrentPlayer().name);

// Test bot functionality
console.log("\n12. Testing Bot");
const bot = new Bot("AI Player", deck.drawCard(7));
console.log("Bot created:", bot.name);
console.log("Initial bot hand size:", bot.getHandCardCount());

// Test bot analysis
const analysis = bot.analyzeHand();
console.log("Hand analysis:", analysis);

// Test bot decision making
try {
    const cardIndex = bot.decideCard(field);
    if (cardIndex !== null) {
        console.log("Bot chose to play card at index:", cardIndex);
        const playedCard = bot.playCard(cardIndex, field);
        field.addCard(playedCard);
        console.log("Bot played card:", playedCard.getCurrentSide());
    } else {
        console.log("Bot chose to draw card");
    }
} catch (error) {
    console.error("Error in decideCard:", error.message);
}

// Test bot color choice
try {
    const chosenColor = bot.chooseColor();
    console.log("Bot chose color:", chosenColor);
} catch (error) {
    console.error("Error in chooseColor:", error.message);
}

// Test bot UNO call
console.log("Should bot call UNO:", bot.shouldCallUno());

// Test bot challenge
console.log("Bot challenge decision:", bot.decideChallengeAction());

deck.flipDeck();
field.flipField();

// Test game manager
console.log("\n13. Testing Game Manager");
const gameManager = new GameManager();
const gameAction = new GameAction();
gameManager.startGame(state, 3);
console.log("Game started successfully");

console.log("\n=== Tests Completed ===");