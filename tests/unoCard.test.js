const UnoCard = require('../unoClass/unoCard');

describe('UnoCard', () => {
    const frontSide = { color: 'red', value: 5, type: 'number' };
    const backSide = { color: 'pink', value: 'draw5', type: 'special' };
    let card;

    beforeEach(() => {
        card = new UnoCard(frontSide, backSide);
    });

    test('card creation', () => {
        expect(card.getColor()).toBe('red');
        expect(card.getValue()).toBe(5);
        expect(card.getType()).toBe('number');
    });

    test('card flipping', () => {
        card.flip();
        expect(card.getColor()).toBe('pink');
        expect(card.getValue()).toBe('draw5');
        expect(card.getType()).toBe('special');
    });

    test('invalid card creation', () => {
        expect(() => {
            new UnoCard({ color: 'invalid' }, backSide);
        }).toThrow();
    });
});
