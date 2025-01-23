const UnoFlipDeck = require("./unoClass/unoFlipDeck.js");
const UnoField = require("./unoClass/unoField.js");
const UnoPlayer = require("./unoClass/unoPlayer.js");
const UnoCard = require("./unoClass/unoCard.js");
const UnoGameState = require("./unoClass/unoGameState.js");

console.log("=== เริ่มการทดสอบระบบ UNO Flip ===\n");

// สร้างอุปกรณ์การเล่น
console.log("1. ทดสอบการสร้างเกม");
const deck = new UnoFlipDeck();
const field = new UnoField(deck);
const state = new UnoGameState(deck, field);
console.log("สร้างเด็คและสนามสำเร็จ");
console.log("จำนวนการ์ดในเด็คเริ่มต้น:", deck.getCurrentDeckSize());
console.log("การ์ดบนสนามใบแรก:", field.getTopCard().getCurrentSide());

// สร้างผู้เล่นและแจกไพ่
console.log("\n2. ทดสอบการสร้างผู้เล่นและแจกไพ่");
const player1 = new UnoPlayer("Player 1", deck.drawCard(7));
const player2 = new UnoPlayer("Player 2", deck.drawCard(7));
console.log("จำนวนการ์ดคงเหลือในเด็ค:", deck.getCurrentDeckSize());

console.log("Player 1 cards:");
player1.getHand().forEach((card, i) => {
  console.log(`Card ${i + 1}:`, card.getCurrentSide());
});
console.log("Player 1 card count:", player1.getHandCardCount());

// ทดสอบการเรียก UNO
console.log("\n3. ทดสอบการเรียก UNO");
console.log("เรียก UNO ตอนมีไพ่ 7 ใบ:", player1.callUno());

// ทดสอบการเล่นไพ่
console.log("\n4. ทดสอบการเล่นไพ่");
console.log("การ์ดบนสนาม:", field.getTopCard().getCurrentSide());
console.log("การ์ดที่เล่นได้:", player1.findPlayableCards(field));

// ทดสอบการเล่นไพ่ wild
console.log('\n5. ทดสอบการเล่นไพ่ Wild');
console.log('สีปัจจุบันบนสนาม:', field.getCurrentColor());
//จำลอง wild card
const wildCard = new UnoCard(
    { value: "wild", color: "wild", type: "special" },
    { value: "wild", color: "wild", type: "special" }
);
// สมมติว่าผู้เล่นมีไพ่ wild
try {
    player1.drawCard([wildCard]);
    const wildCardIndex = player1.getHand().findIndex(card => card.getColor() === 'wild');
    if (wildCardIndex !== -1) {
        console.log('เล่นไพ่ wild');
        const playedCard = player1.playCard(wildCardIndex, field);
        field.addCard(playedCard);
        field.setWildColor('red');
        console.log('ตั้งค่าสีเป็นแดง');
        console.log('สีปัจจุบันบนสนาม:', field.getCurrentColor());
        console.log("การ์ดบนสนาม:", field.getTopCard().getCurrentSide());
        
        // ทดลองการเล่นการ์ดที่มีสีตาม wild color
        const redCard = new UnoCard(
            { value: 5, color: "red", type: "number" },
            { value: 5, color: "pink", type: "number" }
        );
        player1.drawCard([redCard]);
        const redCardIndex = player1.getHand().length - 1;
        console.log('\nทดสอบเล่นไพ่สีแดงที่ตรงกับ wild color:');
        console.log('สามารถเล่นไพ่สีแดงได้:', player1.canPlay(redCardIndex, field));
        
        // ทดลองการเล่นการ์ดที่มีสีตามตัวเลขก่อนหน้า
        const sameValueCard = new UnoCard(
            { value: field.getCurrentValue(), color: "blue", type: "number" },
            { value: field.getCurrentValue(), color: "teal", type: "number" }
        );
        player1.drawCard([sameValueCard]);
        const valueCardIndex = player1.getHand().length - 1;
        console.log('\nทดสอบเล่นไพ่ที่มีค่าเท่ากับการ์ดก่อนหน้า:');
        console.log('สามารถเล่นไพ่ที่มีค่าเท่ากันได้:', player1.canPlay(valueCardIndex, field));
    }
} catch (error) {
    console.error('Error playing wild card:', error.message);
}

// ทดสอบการพลิกด้าน
console.log("\n6. ทดสอบการพลิกด้าน");
console.log("สถานะก่อนพลิก:", deck.isDeckFlipped());
deck.flipDeck();
field.flipField();
console.log("สถานะหลังพลิก:", deck.isDeckFlipped());
console.log("การ์ดบนสนามหลังพลิก:", field.getTopCard().getCurrentSide());

// ทดสอบการจั่วจนเจอสีที่ต้องการ
console.log("\n7. ทดสอบการจั่วจนเจอสีที่ต้องการ");
const drawnCards = deck.drawUntilColor("teal");
console.log("จำนวนการ์ดที่จั่วจนเจอสี teal:", drawnCards.length);
console.log(
  "การ์ดสุดท้ายที่จั่วได้:",
  drawnCards[drawnCards.length - 1].getCurrentSide()
);

// ทดสอบการเล่นไพ่พิเศษ
console.log("\n8. ทดสอบการเล่นไพ่พิเศษ");
console.log("ทิศทางปัจจุบัน:", field.getDirection());
try {
    field.reverseDirection();
    console.log("ทิศทางหลังใช้ไพ่ reverse:", field.getDirection());
} catch (error) {
    console.error('Error reversing direction:', error.message);
}

// ทดสอบการสร้างเด็คใหม่เมื่อการ์ดหมด
console.log("\n9. ทดสอบการสร้างเด็คใหม่");
const originalSize = deck.getCurrentDeckSize();
deck.clearDeck();
const newCard = deck.drawCard();
console.log("สามารถจั่วไพ่หลังสร้างเด็คใหม่:", newCard[0].getCurrentSide());

console.log("\n10. ทดสอบการเพิ่มและลบผู้เล่น");
state.addPlayer(player1);
state.addPlayer(player2);
state.getPlayers().forEach((player, i) => {
  console.log(`Player ${i + 1}:`, player.name);
});
state.removePlayer(player2);
state.getPlayers().forEach((player, i) => {
  console.log(`Player ${i + 1}:`, player.name);
})
state.addPlayer(player2);

console.log("\n11. ทดสอบผู้เล่นคนปัจจุบัน");
console.log("ผู้เล่นปัจจุบัน :" + state.getCurrentPlayer().name);

console.log("\n=== จบการทดสอบ ===");
