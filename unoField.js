class Field {
  constructor(deck) {
    this.cardPile = [];
    this.currentWildColor = null;

    // ดึงไพ่ใบแรกที่ไม่ใช่ไพ่พิเศษ
    do {
      this.cardPile = deck.drawCard();
    } while (this.cardPile[this.cardPile.length - 1].getType() === "special");

    // ทิศทางการเล่น (1 = ตามเข็ม, -1 = ทวนเข็ม)
    this.direction = 1;
    this.isFlipped = false;
  }

  // กำหนดสีจาก wild card
  setWildColor(color) {
    const validColors = this.isFlipped
      ? ["pink", "teal", "orange", "purple"]
      : ["red", "yellow", "blue", "green"];

    if (!validColors.includes(color)) {
      throw new Error("Invalid color selection for wild card");
    }
    this.currentWildColor = color;
  }

  flipField() {
    this.isFlipped = !this.isFlipped;
    this.cardPile.forEach((card) => card.flip());
    this.currentWildColor = null; // รีเซ็ตค่าสี wild card เมื่อพลิกกอง
  }

  getTopCard() {
    return this.isFlipped
      ? this.cardPile[0]
      : this.cardPile[this.cardPile.length - 1];
  }

  getCurrentColor() {
    // ถ้ามีการตั้งค่าสี wild card ให้ใช้สีนั้น
    if (this.getTopCard().getColor() === "wild" && this.currentWildColor) {
      return this.currentWildColor;
    }
    return this.isFlipped
      ? this.cardPile[0].getColor()
      : this.cardPile[this.cardPile.length - 1].getColor();
  }

  getCurrentType() {
    return this.isFlipped
      ? this.cardPile[0].getType()
      : this.cardPile[this.cardPile.length - 1].getType();
  }

  getCurrentValue() {
    return this.isFlipped
      ? this.cardPile[0].getValue()
      : this.cardPile[this.cardPile.length - 1].getValue();
  }

  AddCard(card) {
    // รีเซ็ตค่าสี wild card เมื่อมีการลงไพ่ใบใหม่
    this.currentWildColor = null;

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
