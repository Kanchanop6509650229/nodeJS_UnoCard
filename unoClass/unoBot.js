const Player = require("./unoPlayer");

class Bot extends Player {
    /**
     * Analyzes the bot's hand to determine play strategy
     * @returns {object} Analysis of hand
     */
    analyzeHand() {
        const hand = this.getHand();
        const analysis = {
            totalCards: hand.length,
            colors: {},
            values: {},
            specialCards: 0,
            wildCards: 0
        };

        hand.forEach(card => {
            // Count colors
            const color = card.getColor();
            analysis.colors[color] = (analysis.colors[color] || 0) + 1;

            // Count values
            const value = card.getValue();
            analysis.values[value] = (analysis.values[value] || 0) + 1;

            // Count special cards
            if (card.getType() === 'special') {
                analysis.specialCards++;
                if (color === 'wild') {
                    analysis.wildCards++;
                }
            }
        });

        return analysis;
    }

    /**
     * Decides which card to play
     * @param {UnoCard} topCard - Top card on field
     * @param {string} currentColor - Current play color
     * @returns {number|null} Index of card to play or null to draw
     */
    decideCard(field) {
        if (!field || typeof field.getCurrentColor !== 'function') {
            throw new Error('Invalid field provided');
        }
        const playableCards = this.findPlayableCards(field);
        
        if (playableCards.length === 0) {
            return null; // No playable cards, must draw
        }

        // Prefer to play special cards first
        const specialCards = playableCards.filter(index => 
            this.getHand()[index].getType() === 'special'
        );

        if (specialCards.length > 0) {
            return specialCards[0]; // Play first special card
        }

        // Otherwise play first playable card
        return playableCards[0];
    }

    /**
     * Chooses a color when playing wild card
     * @returns {string} Chosen color
     */
    chooseColor() {
        const analysis = this.analyzeHand();
        
        // Choose color with most cards
        let chosenColor = 'red';
        let maxCount = 0;
        
        for (const [color, count] of Object.entries(analysis.colors)) {
            if (color !== 'wild' && count > maxCount) {
                chosenColor = color;
                maxCount = count;
            }
        }

        return chosenColor;
    }

    /**
     * Decides whether to challenge an UNO call
     * @returns {boolean} True to challenge
     */
    decideChallengeAction() {
        // Random chance to challenge (20%)
        return Math.random() < 0.2;
    }

    /**
     * Determines if bot should call UNO
     * @returns {boolean} True if should call UNO
     */
    shouldCallUno() {
        return this.getHandCardCount() === 1;
    }
}

module.exports = Bot;
