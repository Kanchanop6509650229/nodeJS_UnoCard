const UnoCard = require("./unoCard");

class UnoFlipDeck {
  constructor() {
    this.deck = this.createDeck();
    this.isFlipped = false;
  }

  getCurrentDeckSize() {
    return this.deck.length;
  }

  // สลับตำแหน่งไพ่ในเด็ค
  shuffleDeck(deck = this.deck, count = 3) {
    for (let x = 0; x < count; x++) {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // สุ่มเลขตั้งแต่ 0 ถึง i
        [deck[i], deck[j]] = [deck[j], deck[i]]; // สลับตำแหน่ง
      }
    }
    return deck;
  }

  #createFrontCards() {
    const normal_colors = ["red", "yellow", "blue", "green"];
    const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const normal_special_cards = [
      "draw1",
      "reverse",
      "stop",
      "wild",
      "wild_draw2",
      "flip",
    ];
    const deck = [];

    // สร้างการ์ดด้านหน้า
    // เพิ่มการ์ดตัวเลขปกติ
    for (const color of normal_colors) {
      // เพิ่มการ์ดเลขศูนย์หนึ่งใบ
      deck.push({ color: color, value: 0, type: "number" });

      // เพิ่มการ์ดตัวเลข 1-9 อย่างละสองใบ
      for (const value of values.slice(1)) {
        deck.push({ color, value, type: "number" });
        deck.push({ color, value, type: "number" });
      }

      // เพิ่มการ์ดพิเศษ (อย่างละสองใบ)
      for (const special of normal_special_cards) {
        if (!special.includes("wild")) {
          deck.push({ color, value: special, type: "special" });
          deck.push({ color, value: special, type: "special" });
        }
      }
    }

    // เพิ่มการ์ดไวลด์ปกติ
    for (const wild_card of normal_special_cards) {
      if (wild_card.includes("wild")) {
        for (let i = 0; i < 4; i++) {
          deck.push({ color: "wild", value: wild_card, type: "special" });
        }
      }
    }

    return this.shuffleDeck(deck);
  }

  #createFlipCards() {
    const flip_colors = ["pink", "teal", "orange", "purple"];
    const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const flip_special_cards = [
      "draw5",
      "skip_everyone",
      "reverse",
      "skip",
      "wild",
      "wild_draw_color",
    ];
    const deck = [];

    // สร้างการ์ดด้านหลัง
    // เพิ่มการ์ดด้านหลัง
    for (const color of flip_colors) {
      // เพิ่มการ์ดเลขศูนย์หนึ่งใบ
      deck.push({ color: color, value: 0, type: "number" });

      // เพิ่มการ์ดตัวเลข 1-9 อย่างละสองใบ
      for (const value of values.slice(1)) {
        deck.push({ color, value, type: "number" });
        deck.push({ color, value, type: "number" });
      }

      // เพิ่มการ์ดพิเศษ (อย่างละสองใบ)
      for (const special of flip_special_cards) {
        if (!special.includes("wild")) {
          deck.push({ color, value: special, type: "special" });
          deck.push({ color, value: special, type: "special" });
        }
      }
    }

    // เพิ่มการ์ดไวลด์ด้านหลัง
    for (const wild_card of flip_special_cards) {
      if (wild_card.includes("wild")) {
        for (let i = 0; i < 4; i++) {
          deck.push({ color: "wild", value: wild_card, type: "special" });
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
      deck.push(new UnoCard(frontCards[i], backCards[i]));
    }

    return this.shuffleDeck(deck);
  }

  // สลับด้านการ์ดทั้งเด็ค
  flipDeck() {
    this.isFlipped = !this.isFlipped;
    this.deck.forEach((card) => card.flip());
  }

  // ดึงการ์ดจากเด็ค
  drawCard(numberOfCards = 1) {
    const cards = [];
    for (let i = 0; i < numberOfCards; i++) {
      if (this.deck.length === 0) {
        this.deck = this.createDeck();

        if (this.isFlipped) {
          this.deck.forEach((card) => card.flip());
        }
      }
      const card = this.deck.pop();
      cards.push(card);
    }
    return cards;
  }

  // ดึงการ์ดจนกว่าจะเจอสีที่ต้องการ
  drawUntilColor(color) {
    if (!this.isFlipped) {
      throw new Error("Deck must be flipped to search for back side colors");
    }

    const cards = [];
    while (true) {
      if (this.deck.length === 0) {
        this.deck = this.createDeck();
        // Ensure new deck is flipped
        this.deck.forEach((card) => card.flip());
      }
      const card = this.deck.shift();
      cards.push(card);
      if (card.getColor() === color) {
        break;
      }
    }
    return cards;
  }

  isDeckFlipped() {
    return this.isFlipped;
  }

  // Clear the deck
  clearDeck() {
    this.deck = [];
  }
}

module.exports = UnoFlipDeck;
