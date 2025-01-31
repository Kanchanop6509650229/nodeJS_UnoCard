const UnoFlipDeck = require('../unoClass/unoFlipDeck');

describe('UnoFlipDeck', () => {
    let deck;

    beforeEach(() => {
        deck = new UnoFlipDeck();
    });

    test('deck creation', () => {
        expect(deck.getCurrentDeckSize()).toBeGreaterThan(0);
    });

    test('drawing cards', () => {
        const cards = deck.drawCard(7);
        expect(cards.length).toBe(7);
        expect(deck.getCurrentDeckSize()).toBeLessThan(112); // Initial deck size - 7
    });

    test('deck flipping', () => {
        const initialState = deck.isDeckFlipped();
        deck.flipDeck();
        expect(deck.isDeckFlipped()).toBe(!initialState);
    });

    test('drawing until color', () => {
        deck.flipDeck(); // Must be flipped to search for flip colors
        const cards = deck.drawUntilColor('pink');
        expect(cards.length).toBeGreaterThan(0);
        expect(cards[cards.length - 1].getColor()).toBe('pink');
    });
});
