class GameState {
  /**
   * Creates a new game state
   * @param {UnoFlipDeck} deck - The game deck
   * @param {Field} field - The playing field
   * @throws {Error} If invalid deck or field provided
   */
  constructor(deck, field) {
    if (!deck || typeof deck.drawCard !== 'function') {
      throw new Error('Invalid deck provided');
    }
    if (!field || typeof field.getDirection !== 'function') {
      throw new Error('Invalid field provided');
    }

    this.players = [];
    this.currentPlayerIndex = 0;
    this.deck = deck;
    this.field = field;
  }

  /**
   * Gets the current player
   * @returns {Player} The current player
   * @throws {Error} If no players in game
   */
  getCurrentPlayer() {
    if (this.players.length === 0) {
      throw new Error('No players in game');
    }
    return this.players[this.currentPlayerIndex];
  }

  /**
   * Gets the next player
   * @returns {Player} The next player
   * @throws {Error} If no players in game
   */
  getNextPlayer() {
    if (this.players.length === 0) {
      throw new Error('No players in game');
    }
    return this.players[this.#calculateNextPlayerIndex()];
  }

  /**
   * Advances to the next player
   */
  setNextPlayer() {
    this.currentPlayerIndex = this.#calculateNextPlayerIndex();
  }

  /**
   * Gets all players
   * @returns {Player[]} Array of players
   */
  getPlayers() {
    return [...this.players];
  }

  /**
   * Adds a player to the game
   * @param {Player} player - The player to add
   * @throws {Error} If invalid player provided
   */
  addPlayer(player) {
    if (!player || typeof player.getHandCardCount !== 'function') {
      throw new Error('Invalid player provided');
    }
    this.players.push(player);
  }

  /**
   * Removes a player from the game
   * @param {Player} player - The player to remove
   * @returns {boolean} True if player was removed
   */
  removePlayer(player) {
    const playerIndex = this.players.indexOf(player);
    if (playerIndex === -1) {
      return false;
    }

    this.players.splice(playerIndex, 1);
    this.#adjustCurrentPlayerIndexAfterRemoval(playerIndex);
    return true;
  }

  /**
   * Checks if game is over
   * @returns {boolean} True if game is over
   */
  isGameOver() {
    return this.players.length === 1;
  }

  /**
   * Gets the game winner
   * @returns {Player|null} The winning player or null if game not over
   */
  getWinner() {
    return this.isGameOver() ? this.players[0] : null;
  }

  /**
   * Calculates the next player index
   * @returns {number} The next player index
   * @private
   */
  #calculateNextPlayerIndex() {
    return (this.currentPlayerIndex + this.field.getDirection() + this.players.length) % this.players.length;
  }

  /**
   * Adjusts current player index after player removal
   * @param {number} removedIndex - Index of removed player
   * @private
   */
  #adjustCurrentPlayerIndexAfterRemoval(removedIndex) {
    if (this.currentPlayerIndex >= removedIndex) {
      this.currentPlayerIndex = (this.currentPlayerIndex - 1 + this.players.length) % this.players.length;
    }
  }
}

module.exports = GameState;
