const UnoCard = require("./unoCard");

class UnoFlipDeck {
  #NORMAL_COLORS = ["red", "yellow", "blue", "green"];
  #FLIP_COLORS = ["pink", "teal", "orange", "purple"];
  #NORMAL_SPECIALS = ["draw1", "reverse", "stop", "wild", "wild_draw2", "flip"];
  #FLIP_SPECIALS = ["draw5", "skip_everyone", "reverse", "skip", "wild", "wild_draw_color", "flip"];
  #SHUFFLE_COUNT = 3;

  /**
   * Creates a new UNO Flip deck
   */
  constructor() {
    this.deck = this.#createDeck();
    this.isFlipped = false;
  }

  /**
   * Gets current deck size
   * @returns {number} Number of cards in deck
   */
  getCurrentDeckSize() {
    return this.deck.length;
  }

  /**
   * Shuffles the deck
   * @param {UnoCard[]} deck - Deck to shuffle (defaults to current deck)
   * @param {number} count - Number of times to shuffle (default 3)
   * @returns {UnoCard[]} Shuffled deck
   * @throws {Error} If invalid deck or count provided
   */
  shuffleDeck(deck = this.deck, count = this.#SHUFFLE_COUNT) {
    if (!Array.isArray(deck)) {
      throw new Error('Deck must be an array');
    }
    if (!Number.isInteger(count) || count < 1) {
      throw new Error('Count must be a positive integer');
    }

    for (let x = 0; x < count; x++) {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }
    return deck;
  }

  /**
   * Creates a new deck
   * @returns {UnoCard[]} New shuffled deck
   */
  #createDeck() {
    const frontCards = this.#createSideCards(this.#NORMAL_COLORS, this.#NORMAL_SPECIALS);
    const backCards = this.#createSideCards(this.#FLIP_COLORS, this.#FLIP_SPECIALS);
    const deck = [];

    for (let i = 0; i < frontCards.length; i++) {
      deck.push(new UnoCard(frontCards[i], backCards[i]));
    }

    return this.shuffleDeck(deck);
  }

  /**
   * Creates cards for one side of the deck
   * @param {string[]} colors - Available colors
   * @param {string[]} specials - Available special cards
   * @returns {Object[]} Array of card definitions
   * @private
   */
  #createSideCards(colors, specials) {
    const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const deck = [];

    // Create number cards
    for (const color of colors) {
      deck.push({ color, value: 0, type: "number" });
      for (const value of values.slice(1)) {
        deck.push({ color, value, type: "number" });
        deck.push({ color, value, type: "number" });
      }
    }

    // Create special cards
    for (const color of colors) {
      for (const special of specials) {
        if (!special.includes("wild")) {
          deck.push({ color, value: special, type: "special" });
          deck.push({ color, value: special, type: "special" });
        }
      }
    }

    // Create wild cards
    for (const special of specials) {
      if (special.includes("wild")) {
        for (let i = 0; i < 4; i++) {
          deck.push({ color: "wild", value: special, type: "special" });
        }
      }
    }

    return this.shuffleDeck(deck);
  }

  /**
   * Flips the deck
   */
  flipDeck() {
    this.isFlipped = !this.isFlipped;
    this.deck.forEach(card => card.flip());
  }

  /**
   * Draws cards from the deck
   * @param {number} numberOfCards - Number of cards to draw (default 1)
   * @returns {UnoCard[]} Drawn cards
   * @throws {Error} If invalid number of cards requested
   */
  drawCard(numberOfCards = 1) {
    if (!Number.isInteger(numberOfCards) || numberOfCards < 1) {
      throw new Error('Number of cards must be a positive integer');
    }

    const cards = [];
    for (let i = 0; i < numberOfCards; i++) {
      if (this.deck.length === 0) {
        this.deck = this.#createDeck();
        if (this.isFlipped) {
          this.deck.forEach(card => card.flip());
        }
      }
      cards.push(this.deck.pop());
    }
    return cards;
  }

  /**
   * Draws cards until finding a specific color
   * @param {string} color - Color to search for
   * @returns {UnoCard[]} Drawn cards including matching color card
   * @throws {Error} If deck is not flipped or invalid color provided
   */
  drawUntilColor(color) {
    if (!this.isFlipped) {
      throw new Error('Deck must be flipped to search for back side colors');
    }
    if (typeof color !== 'string' || !this.#FLIP_COLORS.includes(color)) {
      throw new Error('Invalid color provided');
    }

    const cards = [];
    while (true) {
      if (this.deck.length === 0) {
        this.deck = this.#createDeck();
        this.deck.forEach(card => card.flip());
      }
      const card = this.deck.shift();
      cards.push(card);
      if (card.getColor() === color) {
        break;
      }
    }
    return cards;
  }

  /**
   * Checks if deck is flipped
   * @returns {boolean} True if deck is flipped
   */
  isDeckFlipped() {
    return this.isFlipped;
  }

  /**
   * Clears the deck
   */
  clearDeck() {
    this.deck = [];
  }
}

module.exports = UnoFlipDeck;
