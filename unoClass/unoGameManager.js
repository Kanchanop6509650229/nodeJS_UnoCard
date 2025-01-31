const Player = require("./unoPlayer");

class GameManager {
    /**
     * Starts a new game
     * @param {GameState} state - Game state to initialize
     * @param {number} numPlayers - Number of players
     * @param {number} cardsPerPlayer - Cards to deal per player
     */
    startGame(state, numPlayers, cardsPerPlayer = 7) {
        // Initialize players and deal cards
        for (let i = 1; i <= numPlayers; i++) {
            const player = new Player(`Player ${i}`, state.deck.drawCard(cardsPerPlayer));
            state.addPlayer(player);
        }
    }

    /**
     * Ends the current game
     * @param {GameState} state - Current game state
     */
    endGame(state) {
        state.players = [];
        state.currentPlayerIndex = 0;
        state.deck.clearDeck();
        state.field.clearField();
    }

    /**
     * Handles a player's turn
     * @param {GameState} state - Current game state
     * @param {GameAction} action - Game action handler
     * @param {number} cardIndex - Index of card to play
     * @param {string} [chosenColor] - Color chosen for wild cards
     */
    handleTurn(state, action, cardIndex, chosenColor) {
        const currentPlayer = state.getCurrentPlayer();
        const card = currentPlayer.getHand()[cardIndex];

        if (!action.validateAction(card, currentPlayer, state.field)) {
            throw new Error('Invalid card play');
        }

        // Handle special cards
        switch (card.getValue()) {
            case 'draw1':
            case 'draw5':
                const drawCount = card.getValue() === 'draw1' ? 2 : 5;
                action.handleDrawTwo(state, state.getNextPlayer(), drawCount);
                break;
            case 'wild':
                if (!chosenColor) throw new Error('Color must be chosen for wild card');
                action.handleWildCard(state, currentPlayer, chosenColor);
                break;
            case 'wild_draw2':
            case 'wild_draw_color':
                if (!chosenColor) throw new Error('Color must be chosen for wild draw card');
                const drawCountWild = card.getValue() === 'wild_draw2' ? 2 : 4;
                action.handleWildDrawFour(state, state.getNextPlayer(), chosenColor, drawCountWild);
                break;
            case 'skip':
            case 'skip_everyone':
                action.handleSkip(state);
                break;
            case 'reverse':
                action.handleReverse(state);
                break;
        }

        // Play the card
        const playedCard = currentPlayer.playCard(cardIndex, state.field);
        state.field.addCard(playedCard);

        // Check for UNO
        if (currentPlayer.getHandCardCount() === 1) {
            currentPlayer.callUno();
        }

        // Advance to next player
        state.setNextPlayer();
    }

    /**
     * Handles drawing a card
     * @param {GameState} state - Current game state
     * @param {Player} player - Player drawing card
     * @param {number} [count=1] - Number of cards to draw
     */
    handleDrawCard(state, player, count = 1) {
        player.drawCard(state.deck.drawCard(count));
    }

    /**
     * Handles UNO call validation
     * @param {GameState} state - Current game state
     * @param {Player} player - Player calling UNO
     * @returns {boolean} True if UNO call is valid
     */
    handleUnoCall(state, player) {
        return player.hasUno();
    }

    /**
     * Handles challenge action
     * @param {GameState} state - Current game state
     * @param {Player} challenger - Player making challenge
     * @param {Player} target - Player being challenged
     */
    handleChallengeAction(state, challenger, target) {
        if (!target.hasUno()) {
            target.drawCard(state.deck.drawCard(2));
        } else {
            challenger.drawCard(state.deck.drawCard(2));
        }
    }

    /**
     * Checks if a play is valid
     * @param {GameState} state - Current game state
     * @param {Player} player - Player attempting to play
     * @param {number} cardIndex - Index of card to play
     * @returns {boolean} True if play is valid
     */
    isValidPlay(state, player, cardIndex) {
        const card = player.getHand()[cardIndex];
        return player.canPlay(cardIndex, state.field);
    }
}

module.exports = GameManager;
