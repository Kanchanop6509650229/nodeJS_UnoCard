class UnoFlipGame {
    constructor() {
        this.deck = this.createDeck();
    }

    // สร้างเด็ค
    createDeck() {
        const normal_colors = ["red", "yellow", "blue", "green"];
        const flip_colors = ["pink", "teal", "orange", "purple"];
        const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const normal_special_cards = ["draw1", "reverse", "stop", "wild", "wild_draw2", "flip"];
        const flip_special_cards = ["wild_draw5", "skip_everyone", "reverse", "skip", "wild", "wild_draw_color"];
        const deck = [];

        // Add number cards
        for (const color of normal_colors) {
            // Add one zero card
            deck.push({ color: color, value: 0, type: 'number' });

            // Add two of each number 1-9
            for (const value of values.slice(1)) {
                deck.push({ color, value, type: 'number' });
                deck.push({ color, value, type: 'number' });
            }

            // Add special cards (two of each)
            for (const special of normal_special_cards) {
                if (!special.includes('wild')) {
                    deck.push({ color, value: special , type: 'special'});
                    deck.push({ color, value: special , type: 'special'});
                }
            }
        }

        // Add wild cards
        for (const wild_card of normal_special_cards) {
            if (wild_card.includes('wild')) {
                for (let i = 0; i < 4; i++) {
                    deck.push({ color: 'wild', value: wild_card, type: 'special' });
                }
            }
        }

        return deck;
    }

    deckCount() {
        return this.deck.length;
    }

    getDeck() {
        return this.deck;
    }
}

module.exports = UnoFlipGame;
