class UnoCard {
  /**
   * Creates a new UNO card with front and back sides
   * @param {object} frontSide - Front side properties
   * @param {string} frontSide.color - Front color
   * @param {string|number} frontSide.value - Front value
   * @param {string} frontSide.type - Front type ('number' or 'special')
   * @param {object} backSide - Back side properties
   * @param {string} backSide.color - Back color
   * @param {string|number} backSide.value - Back value
   * @param {string} backSide.type - Back type ('number' or 'special')
   * @throws {Error} If invalid parameters are provided
   */
  constructor(frontSide, backSide) {
    this.#validateSide(frontSide, 'Front');
    this.#validateSide(backSide, 'Back');

    this.frontValue = frontSide.value;
    this.frontColor = frontSide.color;
    this.frontType = frontSide.type;
    this.backValue = backSide.value;
    this.backColor = backSide.color;
    this.backType = backSide.type;
    this.flipped = false;
  }

  /**
   * Validates card side properties
   * @param {object} side - Card side to validate
   * @param {string} sideName - Name of side for error messages
   * @private
   * @throws {Error} If side is invalid
   */
  #validateSide(side, sideName) {
    if (!side || typeof side !== 'object') {
      throw new Error(`${sideName} side must be an object`);
    }

    const requiredProps = ['color', 'value', 'type'];
    for (const prop of requiredProps) {
      if (!(prop in side)) {
        throw new Error(`${sideName} side missing required property: ${prop}`);
      }
    }

    if (typeof side.color !== 'string') {
      throw new Error(`${sideName} color must be a string`);
    }

    if (typeof side.type !== 'string' || !['number', 'special'].includes(side.type)) {
      throw new Error(`${sideName} type must be either 'number' or 'special'`);
    }
  }

  /**
   * Flips the card to show the opposite side
   */
  flip() {
    this.flipped = !this.flipped;
  }

  /**
   * Gets the current visible color
   * @returns {string} Current color
   */
  getColor() {
    return this.flipped ? this.backColor : this.frontColor;
  }

  /**
   * Gets the current visible type
   * @returns {string} Current type ('number' or 'special')
   */
  getType() {
    return this.flipped ? this.backType : this.frontType;
  }

  /**
   * Gets the current visible value
   * @returns {string|number} Current value
   */
  getValue() {
    return this.flipped ? this.backValue : this.frontValue;
  }

  /**
   * Checks if the card is currently flipped
   * @returns {boolean} True if card is flipped
   */
  isFlipped() {
    return this.flipped;
  }

  /**
   * Gets the current visible side properties
   * @returns {object} Current side properties
   */
  getCurrentSide() {
    return this.flipped
      ? this.#createSideObject(this.backValue, this.backColor, this.backType)
      : this.#createSideObject(this.frontValue, this.frontColor, this.frontType);
  }

  /**
   * Creates a new side object
   * @param {string|number} value - Side value
   * @param {string} color - Side color
   * @param {string} type - Side type
   * @returns {object} New side object
   * @private
   */
  #createSideObject(value, color, type) {
    return {
      value: value,
      color: color,
      type: type
    };
  }
}

module.exports = UnoCard;
