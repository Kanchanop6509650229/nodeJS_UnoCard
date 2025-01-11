class UnoFlipGame {
    constructor() {
        this.deck = this.createDeck();
    }

    // สลับตำแหน่งไพ่ในเด็ค
    shuffleDeck(deck = this.deck, count = 3) {
        for (let x = 0; x < count; x++) {
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); // สุ่มเลขตั้งแต่ 0 ถึง i
                [deck[i], deck[j]] = [deck[j], deck[i]]; // สลับตำแหน่ง
            }
        }
        return deck
    }

    #createFrontCards() {
        const normal_colors = ["red", "yellow", "blue", "green"];
        const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const normal_special_cards = ["draw1", "reverse", "stop", "wild", "wild_draw2", "flip"];
        const deck = [];

        // Add normal cards
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
                    deck.push({ color, value: special, type: 'special' });
                    deck.push({ color, value: special, type: 'special' });
                }
            }
        }

        // Add normal wild cards
        for (const wild_card of normal_special_cards) {
            if (wild_card.includes('wild')) {
                for (let i = 0; i < 4; i++) {
                    deck.push({ color: 'wild', value: wild_card, type: 'special'});
                }
            }
        }

        return this.shuffleDeck(deck);
    }

    #createFlipCards() {
        const flip_colors = ["pink", "teal", "orange", "purple"];
        const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const flip_special_cards = ["draw5", "skip_everyone", "reverse", "skip", "wild", "wild_draw_color"];
        const deck = [];

        // Add flip cards
        for (const color of flip_colors) {
            // Add one zero card
            deck.push({ color: color, value: 0, type: 'number' });

            // Add two of each number 1-9
            for (const value of values.slice(1)) {
                deck.push({ color, value, type: 'number' });
                deck.push({ color, value, type: 'number' });
            }

            // Add special cards (two of each)
            for (const special of flip_special_cards) {
                if (!special.includes('wild')) {
                    deck.push({ color, value: special, type: 'special' });
                    deck.push({ color, value: special, type: 'special' });
                }
            }
        }

        // Add flip wild cards
        for (const wild_card of flip_special_cards) {
            if (wild_card.includes('wild')) {
                for (let i = 0; i < 4; i++) {
                    deck.push({ color: 'wild', value: wild_card, type: 'special' });
                }
            }
        }

        return this.shuffleDeck(deck);
    }

    // สร้างเด็ค
    createDeck() {
        const frontCards = this.#createFrontCards();
        const backCards = this.#createFlipCards();
        const deck = [];

        for (let i = 0; i < frontCards.length; i++) {
            deck.push({
                front: frontCards[i],
                back: backCards[i]
            });
        }

        return this.shuffleDeck(deck, 10); 
    }

    deckCount() {
        return this.deck.length;
    }

    getDeck() {
        return this.deck;
    }
}

module.exports = UnoFlipGame;
