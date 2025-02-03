class ManualUnoFlipGameRunner {
  // ...existing code...
  
  async playGame() {
    console.log("=== Starting UNO Flip Manual Game ===\n");

    while (true) {
      const currentPlayer = this.state.getCurrentPlayer();
      console.log(`\n${currentPlayer.name}'s turn`);
      console.log("Current field top card:", this.field.getTopCard().getCurrentSide());
      const direction = this.field.getDirection();
      console.log("Current play direction:", direction === 1 ? "Clockwise" : "Counter-clockwise");
      
      const playableIndices = currentPlayer.findPlayableCards(this.field);
      console.log("\nYour hand:");
      currentPlayer.getHand().forEach((card, idx) => {
        const cardSide = JSON.stringify(card.getCurrentSide());
        const playableMark = playableIndices.includes(idx) ? " (playable)" : "";
        console.log(`  [${idx}] ${cardSide}${playableMark}`);
      });
      
      let turnAdvanced = false;
      let hasDrawn = false;
      while (true) {
        const input = await this.askQuestion("Type card index to play, 'd' to draw, or 's' to skip: ");
        if (input.trim().toLowerCase() === "d") {
          if (hasDrawn) {
            console.log("You can only draw once per turn.");
          } else {
            try {
              const drawnCards = this.manager.handleDrawCard(this.state, currentPlayer);
              if (Array.isArray(drawnCards)) {
                console.log(
                  `${currentPlayer.name} drew: ${drawnCards.map(card => JSON.stringify(card.getCurrentSide())).join(", ")}`
                );
              } else {
                console.log(`${currentPlayer.name} drew no cards.`);
              }
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
              turnAdvanced = true;
              break;
            } catch (err) {
              console.error(`Error during ${currentPlayer.name}'s turn: ${err.message}`);
            }
          }
        }
      }
      
      if (!turnAdvanced) {
        this.state.setNextPlayer();
      }
      
      if (currentPlayer.getHandCardCount() === 0) {
        console.log(`\n${currentPlayer.name} wins the game!\n`);
        break;
      }
      
      // ...existing code if any...
    }

    this.rl.close();
  }
  
  // ...existing code...
}

module.exports = ManualUnoFlipGameRunner;
