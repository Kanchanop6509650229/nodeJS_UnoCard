const Field = require('../unoClass/unoField');
const UnoFlipDeck = require('../unoClass/unoFlipDeck');
const UnoCard = require('../unoClass/unoCard');

describe('Field', () => {
    let field;
    let deck;

    beforeEach(() => {
        deck = new UnoFlipDeck();
        field = new Field(deck);
    });

    test('field initialization', () => {
        expect(field.getTopCard()).toBeDefined();
        expect(field.getDirection()).toBe(1);
        expect(field.isFlipped).toBe(false);
    });

    test('direction reversal', () => {
        const initialDirection = field.getDirection();
        field.reverseDirection();
        expect(field.getDirection()).toBe(-initialDirection);
    });

    test('wild color setting', () => {
        // Create a wild card and place it on top
        const wildCard = new UnoCard(
            { color: 'wild', value: 'wild', type: 'special' },
            { color: 'wild', value: 'wild', type: 'special' }
        );
        field.addCard(wildCard);
        
        // Set and verify wild color
        field.setWildColor('red');
        expect(field.getCurrentColor()).toBe('red');
    });

    test('field flipping', () => {
        const initialState = field.isFlipped;
        field.flipField();
        expect(field.isFlipped).toBe(!initialState);
    });
});
