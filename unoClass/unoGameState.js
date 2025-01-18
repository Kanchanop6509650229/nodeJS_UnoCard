class GameState {
    constructor(deck, field) {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.deck = deck;
        this.field = field;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    getNextPlayer() {
        const nextIndex = (this.currentPlayerIndex + this.field.getDirection() + this.players.length) % this.players.length;
        return this.players[nextIndex];
    }

    setNextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + this.field.getDirection() + this.players.length) % this.players.length;
    }

    getPlayers() {
        return this.players;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(player) {
        const playerIndex = this.players.indexOf(player);
        if (playerIndex !== -1) {
            this.players.splice(playerIndex, 1);
            if (this.currentPlayerIndex >= playerIndex) {
                this.currentPlayerIndex = (this.currentPlayerIndex - 1 + this.players.length) % this.players.length;
            }
        }
    }

    isGameOver() {
        return this.players.length === 1;
    }

    getWinner() {
        if (this.isGameOver()) {
            return this.players[0];
        }
        return null;
    }
}

module.exports = GameState;