const UnoFlipDeck = require('./unoFlipDeck.js');
const UnoField = require('./unoField.js');

const deck = new UnoFlipDeck();
const field = new UnoField(deck);

deck.flipDeck();
field.flipField();

console.log(deck.isDeckFlipped());

console.log("\nทดสอบการ์ดใบบนสุดในสนาม:");
console.log(field.getTopCard(deck.isDeckFlipped()).getCurrentSide());

deck.flipDeck();

// ทดสอบการจั่วการ์ดใบเดียว (ด้านหน้า)
console.log('\nทดสอบการจั่วการ์ดใบเดียว (ด้านหน้า):');
const [singleCard] = deck.drawCard();
console.log('ด้านหน้า:', singleCard.getCurrentSide());

// ทดสอบการจั่วการ์ดหลายใบ (ด้านหน้า)
console.log('\nทดสอบการจั่วการ์ดหลายใบ (ด้านหน้า):');
const multipleCards = deck.drawCard(4);
console.log('จั่วการ์ด 4 ใบ:');
multipleCards.forEach((card, index) => {
    console.log(`การ์ดที่ ${index + 1}:`, card.getCurrentSide());
});

// พลิกการ์ดในเด็ค
console.log('\nพลิกการ์ดในเด็คไปด้านหลัง');
deck.flipDeck();

// ทดสอบการจั่วการ์ดหลังจากพลิก
console.log('\nทดสอบการจั่วการ์ดหลังจากพลิก:');
const flippedCards = deck.drawCard(2);
console.log('จั่วการ์ด 2 ใบ:');
flippedCards.forEach((card, index) => {
    console.log(`การ์ดที่ ${index + 1}:`, card.getCurrentSide());
});

// ทดสอบการจั่วการ์ดจนกว่าจะเจอสีที่ต้องการ (ต้องเป็นด้านหลัง)
console.log('\nทดสอบการจั่วการ์ดจนกว่าจะเจอสีฟ้าเขียว:');
const cardsUntilTeal = deck.drawUntilColor('teal');
console.log(`จั่วการ์ด ${cardsUntilTeal.length} ใบจนกว่าจะเจอสีฟ้าเขียว:`);
cardsUntilTeal.forEach((card, index) => {
    console.log(`การ์ดที่ ${index + 1}:`, card.getCurrentSide());
});
