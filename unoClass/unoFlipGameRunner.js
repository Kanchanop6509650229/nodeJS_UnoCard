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

      console.log("\nYour hand:");
      currentPlayer.getHand().forEach((card, idx) => {
        console.log(`  [${idx}] ${JSON.stringify(card.getCurrentSide())}`);
      });

      const input = await this.askQuestion("Type card index to play or 'd' to draw: ");
      if (input.trim().toLowerCase() === "d") {
        try {
          this.manager.handleDrawCard(this.state, currentPlayer);
          console.log(`${currentPlayer.name} drew a card.`);
        } catch (err) {
          console.error(`Error: ${err.message}`);
        }
      } else {
        const cardIndex = parseInt(input.trim());
        if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= currentPlayer.getHandCardCount()) {
          console.log("Invalid card index. Turn skipped.");
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
          } catch (err) {
            console.error(`Error during ${currentPlayer.name}'s turn: ${err.message}`);
          }
        }
      }

      // Check win condition
      if (currentPlayer.getHandCardCount() === 0) {
        console.log(`\n${currentPlayer.name} wins the game!\n`);
        break;
      }
    }

    this.rl.close();
  }
}

module.exports = ManualUnoFlipGameRunner;