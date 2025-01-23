class Field {
  #NORMAL_COLORS = ["red", "yellow", "blue", "green"];
  #FLIP_COLORS = ["pink", "teal", "orange", "purple"];

  /**
   * Creates a new playing field
   * @param {UnoFlipDeck} deck - The game deck
   * @throws {Error} If invalid deck provided
   */
  constructor(deck) {
    if (!deck || typeof deck.drawCard !== 'function') {
      throw new Error('Invalid deck provided');
    }

    this.cardPile = [];
    this.currentWildColor = null;
    this.direction = 1; // 1 = clockwise, -1 = counter-clockwise
    this.isFlipped = false;
    this.previousCardValue = null;

    this.#initializeFirstCard(deck);
  }

  /**
   * Initializes the first card on the field
   * @param {UnoFlipDeck} deck - The game deck
   * @private
   */
  #initializeFirstCard(deck) {
    do {
      this.cardPile = deck.drawCard();
    } while (this.cardPile[this.cardPile.length - 1].getType() === "special");
  }

  /**
   * Sets the wild card color
   * @param {string} color - The color to set
   * @throws {Error} If invalid color provided
   */
  setWildColor(color) {
    const validColors = this.isFlipped ? this.#FLIP_COLORS : this.#NORMAL_COLORS;
    
    if (!validColors.includes(color)) {
      throw new Error(`Invalid color selection for wild card. Valid colors are: ${validColors.join(', ')}`);
    }
    this.currentWildColor = color;
  }

  /**
   * Flips the field and all cards
   */
  flipField() {
    this.isFlipped = !this.isFlipped;
    this.cardPile.forEach(card => card.flip());
    this.currentWildColor = null;
  }

  /**
   * Gets the top card of the pile
   * @returns {UnoCard} The top card
   * @throws {Error} If no cards in pile
   */
  getTopCard() {
    if (this.cardPile.length === 0) {
      throw new Error('No cards in pile');
    }
    return this.isFlipped ? this.cardPile[0] : this.cardPile[this.cardPile.length - 1];
  }

  /**
   * Gets the current play color
   * @returns {string} The current color
   */
  getCurrentColor() {
    const topCard = this.getTopCard();
    return topCard.getColor() === "wild" ? this.currentWildColor : topCard.getColor();
  }

  /**
   * Gets the current card type
   * @returns {string} The current type
   */
  getCurrentType() {
    return this.getTopCard().getType();
  }

  /**
   * Gets the current card value
   * @returns {string|number} The current value
   */
  getCurrentValue() {
    return this.getTopCard().getValue();
  }

  /**
   * Adds a card to the pile
   * @param {UnoCard} card - The card to add
   * @throws {Error} If invalid card provided
   */
  addCard(card) {
    if (!card || typeof card.isFlipped !== 'function') {
      throw new Error('Invalid card provided');
    }

    this.currentWildColor = null;
    if (card.isFlipped()) {
      this.cardPile.unshift(card);
    } else {
      this.cardPile.push(card);
    }
  }

  /**
   * Gets the card pile
   * @returns {UnoCard[]} Array of cards
   */
  getCardPile() {
    return [...this.cardPile]; // Return copy to maintain immutability
  }

  /**
   * Gets the current play direction
   * @returns {number} 1 for clockwise, -1 for counter-clockwise
   */
  getDirection() {
    return this.direction;
  }

  /**
   * Reverses the play direction
   */
  reverseDirection() {
    this.direction *= -1;
  }

  /**
   * Clears the field
   */
  clearField() {
    this.cardPile = [];
    this.currentWildColor = null;
  }
}

module.exports = Field;
