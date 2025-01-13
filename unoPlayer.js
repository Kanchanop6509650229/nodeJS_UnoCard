class Player {
  constructor(name, cards) {
    this.name = name;
    this.hand = cards;
    this.calledUno = false;
    this.unoTime = null;
  }

  drawCard(card) {
    this.hand.push(...card);
  }

  getHand() {
    return this.hand;
  }

  getHandCardCount() {
    return this.hand.length;
  }

  // ตรวจสอบสถานะ UNO
  hasUno() {
    // กรณีที่มีไพ่ 1 ใบในมือ
    if (this.hand.length === 1) {
      // ต้องมีการเรียก UNO ก่อนที่จะเหลือไพ่ 1 ใบ
      // และต้องเรียกภายในเวลาที่กำหนด (เช่น 3 วินาที)
      if (this.calledUno && this.unoTime) {
        const timeSinceUno = Date.now() - this.unoTime;
        // ถ้าเวลาผ่านไปไม่เกิน 3 วินาที ถือว่า UNO ยังใช้ได้
        return timeSinceUno <= 3000; // 3 วินาที
      }
      // ถ้าไม่ได้เรียก UNO หรือเรียกช้าเกินไป
      return false;
    }

    // ถ้ามีไพ่มากกว่า 1 ใบ ไม่ถือว่าอยู่ในสถานะ UNO
    // รีเซ็ตสถานะ UNO
    this.calledUno = false;
    this.unoTime = null;
    return false;
  }

  callUno() {
    // ตรวจสอบว่ามีไพ่ในมือ 2 ใบหรือไม่
    if (this.hand.length === 2) {
      this.calledUno = true;
      this.unoTime = Date.now(); // เก็บเวลาที่ประกาศ UNO
      return true;
    }

    // ถ้าเรียก UNO ในเวลาที่ไม่ถูกต้อง (ไพ่ไม่เหลือ 2 ใบ)
    this.calledUno = false;
    this.unoTime = null;
    return false;
  }

  canPlay(cardIndex, field) {
    if (cardIndex < 0 || cardIndex >= this.hand.length) {
      return false;
    }

    const card = this.hand[cardIndex];
    console.log(card);

    if (card.getColor() === "wild") {
      return true;
    }

    return (
      card.getColor() === field.getCurrentColor() ||
      card.getValue() === field.getCurrentValue()
    );
  }

  playCard(index, field) {
    if (index < 0 || index >= this.hand.length) {
      throw new Error("Invalid card index");
    }

    const card = this.hand[index];

    console.log(card);

    if (card.getColor() === "wild") {
      // Remove card from hand
      this.hand.splice(index, 1);
      return card;
    }

    if (this.canPlay(index, field)) {
      this.hand.splice(index, 1);

      // Check UNO status after playing
      if (this.hand.length === 1 && !this.calledUno) {
        this.calledUno = false;
        this.unoTime = null;
      } else if (this.hand.length === 0) {
        this.calledUno = false;
        this.unoTime = null;
      }

      return card;
    }

    throw new Error("Card cannot be played");
  }

  findPlayableCards(field) {
    const playableCards = [];
    for (let i = 0; i < this.hand.length; i++) {
      if (this.canPlay(i, field)) {
        playableCards.push(i);
      }
    }
    return playableCards;
  }
}

module.exports = Player;
