class Field {
    constructor(deck) {
        this.cardPile = [];

        // ดึงไพ่ใบแรกที่ไม่ใช่ไพ่พิเศษ
        do {
            this.cardPile = deck.drawCard();
        } while (this.cardPile[this.cardPile.length - 1].getType() === 'special');
        
        // ทิศทางการเล่น (1 = ตามเข็ม, -1 = ทวนเข็ม)
        this.direction = 1;
        this.isFlipped = false;
    }

    flipField() {
        this.isFlipped = !this.isFlipped;
        this.cardPile.forEach(card => card.flip());
    }

    getTopCard() {
        return this.isFlipped ? this.cardPile[0] : this.cardPile[this.cardPile.length - 1];
    }

    getCurrentColor() {
        return this.isFlipped ? this.cardPile[0].getColor() : this.cardPile[this.cardPile.length - 1].getColor();
    }
    
    getCurrentType() {
        return this.isFlipped ? this.cardPile[0].getType() : this.cardPile[this.cardPile.length - 1].getType();
    }

    getCurrentValue() {
        return this.isFlipped ? this.cardPile[0].getValue() : this.cardPile[this.cardPile.length - 1].getValue();
    }

    AddCard(card) {
        if (card.isFlipped()) {
            this.cardPile.unshift(card);
        } else {
            this.cardPile.push(card);
        }
    }

    getCardPile() {
        return this.cardPile;
    }

    getDirection() {
        return this.direction;
    }

    reverseDirection() {
        this.direction *= -1;
    }

    clearField() {
        this.cardPile = [];
    }
}

module.exports = Field;