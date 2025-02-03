class GameAction {
    /**
     * Handles Draw Two card effect
     * @param {GameState} state - Current game state
     * @param {Player} targetPlayer - Player to draw cards
     * @param {number} numCards - Number of cards to draw
     */
    handleDrawTwo(state, targetPlayer, numCards = 2) {
        targetPlayer.drawCard(state.deck.drawCard(numCards));
        state.setNextPlayer(); // Skip next player's turn
    }

    /**
     * Handles Wild card effect
     * @param {GameState} state - Current game state
     * @param {Player} currentPlayer - Player who played the card
     * @param {string} chosenColor - Color chosen by player
     */
    handleWildCard(state, currentPlayer, chosenColor) {
        state.field.setWildColor(chosenColor);
    }

    /**
     * Handles Wild Draw Four card effect
     * @param {GameState} state - Current game state
     * @param {Player} targetPlayer - Player to draw cards
     * @param {string} chosenColor - Color chosen by player
     * @param {number} drawCount - Number of cards to draw
     */
    handleWildDrawFour(state, targetPlayer, chosenColor, drawCount = 4) {
        targetPlayer.drawCard(state.deck.drawCard(drawCount));
        state.field.setWildColor(chosenColor);
        state.setNextPlayer(); // Skip next player's turn
    }

    /**
     * Handles Skip card effect
     * @param {GameState} state - Current game state
     */
    handleSkip(state) {
        state.setNextPlayer(); // Skip next player's turn
    }

    /**
     * Handles Reverse card effect
     * @param {GameState} state - Current game state
     */
    handleReverse(state) {
        state.field.reverseDirection();
    }

    /**
     * Validates if a card can be played
     * @param {UnoCard} card - Card to validate
     * @param {Player} player - Player attempting to play
     * @param {Field} field - Current game field
     * @returns {boolean} True if valid play
     */
    validateAction(card, player, field) {
        // Wild cards are always valid
        if (card.getColor() === 'wild') {
            return true;
        }

        // Check if card matches current color or value
        return (
            card.getColor() === field.getCurrentColor() ||
            card.getValue() === field.getCurrentValue() ||
            (field.currentWildColor && card.getColor() === field.currentWildColor)
        );
    }
}

module.exports = GameAction;
