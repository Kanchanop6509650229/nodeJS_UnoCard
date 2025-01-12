const UnoFlipDeck = require('./unoFlipDeck.js');

const deck = new UnoFlipDeck();
console.log('Created deck:', deck.getDeck());
console.log('Deck count:', deck.deckCount());
console.log('Drawn card:', deck.drawCard());
console.log('Drawn card:', deck.drawCard(4));
console.log('Drawn card:', deck.drawUntilColor('teal'));
