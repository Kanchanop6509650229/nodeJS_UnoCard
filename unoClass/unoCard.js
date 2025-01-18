class UnoCard {
  constructor(frontSide, backSide) {
    this.frontValue = frontSide.value;
    this.frontColor = frontSide.color;
    this.frontType = frontSide.type;
    this.backValue = backSide.value;
    this.backColor = backSide.color;
    this.backType = backSide.type;
    this.flipped = false;
  }

  flip() {
    this.flipped = !this.flipped;
  }

  getColor() {
    return this.flipped ? this.backColor : this.frontColor;
  }

  getType() {
    return this.flipped ? this.backType : this.frontType;
  }

  getValue() {
    return this.flipped ? this.backValue : this.frontValue;
  }

  isFlipped() {
    return this.flipped;
  }

  getCurrentSide() {
    return this.flipped
      ? {
          value: this.backValue,
          color: this.backColor,
          type: this.backType,
        }
      : {
          value: this.frontValue,
          color: this.frontColor,
          type: this.frontType,
        };
  }
}

module.exports = UnoCard;
