// Language: javascript
const readline = require("readline");
const UnoFlipDeck = require("./unoFlipDeck.js"); // [unoClass/unoFlipDeck.js](unoClass/unoFlipDeck.js)
const UnoField = require("./unoField.js"); // [unoClass/unoField.js](unoClass/unoField.js)
const UnoPlayer = require("./unoPlayer.js"); // [unoClass/unoPlayer.js](unoClass/unoPlayer.js)
const UnoGameState = require("./unoGameState.js"); // [unoClass/unoGameState.js](unoClass/unoGameState.js)
const GameManager = require("./unoGameManager.js"); // [unoClass/unoGameManager.js](unoClass/unoGameManager.js)
const GameAction = require("./unoGameAction.js"); // [unoClass/unoGameAction.js](unoClass/unoGameAction.js)

class ManualUnoFlipGameRunner {
  /**
   * Initializes the manual game with a given number of players.
   * @param {number} numPlayers Number of players in the game.
   */
  constructor(numPlayers = 2) {
    this.deck = new UnoFlipDeck();
    this.field = new UnoField(this.deck);
    this.state = new UnoGameState(this.deck, this.field);
    this.manager = new GameManager();
    this.action = new GameAction();

    // Create players and deal cards manually
    for (let i = 1; i <= numPlayers; i++) {
      const player = new UnoPlayer(`Player ${i}`, this.deck.drawCard(7));
      this.state.addPlayer(player);
    }
    // Randomize starting player index
    this.state.currentPlayerIndex = Math.floor(Math.random() * numPlayers);

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Helper to ask a question and wait for user input.
   * @param {string} query Question to prompt.
   * @returns {Promise<string>} The user's input.
   */
  askQuestion(query) {
    return new Promise((resolve) => this.rl.question(query, resolve));
  }

  /**
   * Plays the game in manual mode, prompting the user for input each turn.
   */
  async playGame() {
    console.log("=== Starting UNO Flip Manual Game ===\n");

    while (true) {
      const currentPlayer = this.state.getCurrentPlayer();
      console.log(`\n${currentPlayer.name}'s turn`);
      console.log("Current field top card:", this.field.getTopCard().getCurrentSide());
      // Display current direction of play
      const direction = this.field.getDirection();
      console.log("Current play direction:", direction === 1 ? "Clockwise" : "Counter-clockwise");
      
      // Display the current player order based on direction
      {
        const order = [];
        let index = this.state.currentPlayerIndex;
        for (let i = 0; i < this.state.players.length; i++) {
          order.push(this.state.players[index].name);
          index = (index + direction + this.state.players.length) % this.state.players.length;
        }
        console.log("Player order: " + order.join("->"));
      }
      
      // Determine playable cards before showing hand
      const playableIndices = currentPlayer.findPlayableCards(this.field);

      console.log("\nYour hand:");
      currentPlayer.getHand().forEach((card, idx) => {
        const cardSide = JSON.stringify(card.getCurrentSide());
        const playableMark = playableIndices.includes(idx) ? " (playable)" : "";
        console.log(`  [${idx}] ${cardSide}${playableMark}`);
      });
      
      let hasDrawn = false;
      // Add a flag indicating if turn advancement has been done already.
      let turnAdvanced = false;

      while (true) {
        const input = await this.askQuestion("Type card index to play, 'd' to draw, or 's' to skip: ");
        if (input.trim().toLowerCase() === "d") {
          if (hasDrawn) {
            console.log("You can only draw once per turn.");
          } else {
            try {
              const drawnCards = this.manager.handleDrawCard(this.state, currentPlayer);
              if (Array.isArray(drawnCards)) {
                console.log(`${currentPlayer.name} drew: ${drawnCards.map(card => JSON.stringify(card.getCurrentSide())).join(", ")}`);
              } else {
                console.log(`${currentPlayer.name} drew no cards.`);
              }
              // Display player's updated hand after drawing
              const updatedPlayableIndices = currentPlayer.findPlayableCards(this.field);
              console.log("\nYour updated hand:");
              currentPlayer.getHand().forEach((card, idx) => {
                const cardSide = JSON.stringify(card.getCurrentSide());
                const playableMark = updatedPlayableIndices.includes(idx) ? " (playable)" : "";
                console.log(`  [${idx}] ${cardSide}${playableMark}`);
              });
              hasDrawn = true;
            } catch (err) {
              console.error(`Error: ${err.message}`);
            }
          }
        } else if (input.trim().toLowerCase() === "s") {
          console.log(`${currentPlayer.name} skipped their turn.`);
          break;
        } else {
          const cardIndex = parseInt(input.trim());
          if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= currentPlayer.getHandCardCount()) {
            console.log("Invalid card index. Try again.");
          } else {
            const card = currentPlayer.getHand()[cardIndex];
            let chosenColor = null;
            if (card.getColor() === "wild") {
              chosenColor = await this.askQuestion("Enter chosen color for wild card: ");
              chosenColor = chosenColor.trim();
            }
            try {
              this.manager.handleTurn(this.state, this.action, cardIndex, chosenColor);
              console.log(`${currentPlayer.name} played a card.`);
              // Mark that the turn was advanced already in handleTurn.
              turnAdvanced = true;
              break;
            } catch (err) {
              console.error(`Error during ${currentPlayer.name}'s turn: ${err.message}`);
            }
          }
        }
      }

      // Check win condition
      if (currentPlayer.getHandCardCount() === 0) {
        console.log(`\n${currentPlayer.name} wins the game!\n`);
        break;
      }

      // Only advance the turn if it hasn't been already advanced in handleTurn.
      if (!turnAdvanced) {
        this.state.setNextPlayer();
      }
    }

    this.rl.close();
  }
}

module.exports = ManualUnoFlipGameRunner;