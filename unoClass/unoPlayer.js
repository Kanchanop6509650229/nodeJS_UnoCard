class Player {
  #UNO_TIME_LIMIT = 3000; // 3 seconds

  /**
   * Creates a new player
   * @param {string} name - Player name
   * @param {UnoCard[]} cards - Initial hand of cards
   * @throws {Error} If invalid name or cards provided
   */
  constructor(name, cards) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Invalid player name');
    }
    if (!Array.isArray(cards)) {
      throw new Error('Cards must be an array');
    }

    this.name = name;
    this.hand = [...cards];
    this.calledUno = false;
    this.unoTime = null;
  }

  /**
   * Adds cards to player's hand
   * @param {UnoCard[]} cards - Cards to add
   * @throws {Error} If invalid cards provided
   */
  drawCard(cards) {
    if (!Array.isArray(cards)) {
      throw new Error('Cards must be an array');
    }
    this.hand.push(...cards);
  }

  /**
   * Gets player's hand
   * @returns {UnoCard[]} Copy of player's hand
   */
  getHand() {
    return [...this.hand];
  }

  /**
   * Gets number of cards in hand
   * @returns {number} Number of cards
   */
  getHandCardCount() {
    return this.hand.length;
  }

  /**
   * Checks if player is in valid UNO state
   * @returns {boolean} True if valid UNO state
   */
  hasUno() {
    if (this.hand.length !== 1) {
      this.#resetUnoState();
      return false;
    }

    if (!this.calledUno || !this.unoTime) {
      return false;
    }

    const timeSinceUno = Date.now() - this.unoTime;
    return timeSinceUno <= this.#UNO_TIME_LIMIT;
  }

  /**
   * Attempts to call UNO
   * @returns {boolean} True if UNO was successfully called
   */
  callUno() {
    if (this.hand.length === 2) {
      this.calledUno = true;
      this.unoTime = Date.now();
      return true;
    }

    this.#resetUnoState();
    return false;
  }

  /**
   * Checks if a card can be played
   * @param {number} cardIndex - Index of card to check
   * @param {Field} field - Current game field
   * @returns {boolean} True if card can be played
   * @throws {Error} If invalid card index or field
   */
  canPlay(cardIndex, field) {
    if (!Number.isInteger(cardIndex) || cardIndex < 0 || cardIndex >= this.hand.length) {
      return false;
    }
    if (!field || typeof field.getCurrentColor !== 'function') {
      throw new Error('Invalid field provided');
    }

    const card = this.hand[cardIndex];
    if (card.getColor() === "wild") {
      return true;
    }

    return (
      card.getColor() === field.getCurrentColor() ||
      card.getValue() === field.getCurrentValue() ||
      (field.currentWildColor && card.getColor() === field.currentWildColor) ||
      (field.previousCardValue && card.getValue() === field.previousCardValue)
    );
  }

  /**
   * Plays a card from hand
   * @param {number} index - Index of card to play
   * @param {Field} field - Current game field
   * @returns {UnoCard} The played card
   * @throws {Error} If invalid index or card cannot be played
   */
  playCard(index, field) {
    if (!Number.isInteger(index) || index < 0 || index >= this.hand.length) {
      throw new Error('Invalid card index');
    }
    if (!field || typeof field.getCurrentColor !== 'function') {
      throw new Error('Invalid field provided');
    }

    const card = this.hand[index];
    if (!this.canPlay(index, field)) {
      throw new Error('Card cannot be played');
    }

    this.hand.splice(index, 1);
    this.#updateUnoState();
    return card;
  }

  /**
   * Finds all playable cards
   * @param {Field} field - Current game field
   * @returns {number[]} Array of playable card indices
   * @throws {Error} If invalid field provided
   */
  findPlayableCards(field) {
    if (!field || typeof field.getCurrentColor !== 'function') {
      throw new Error('Invalid field provided');
    }

    return this.hand.reduce((playable, card, index) => {
      if (this.canPlay(index, field)) {
        playable.push(index);
      }
      return playable;
    }, []);
  }

  /**
   * Resets UNO state
   * @private
   */
  #resetUnoState() {
    this.calledUno = false;
    this.unoTime = null;
  }

  /**
   * Updates UNO state after playing a card
   * @private
   */
  #updateUnoState() {
    if (this.hand.length === 1 && !this.calledUno) {
      this.#resetUnoState();
    } else if (this.hand.length === 0) {
      this.#resetUnoState();
    }
  }
}

module.exports = Player;
