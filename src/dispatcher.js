class Dispatcher {
    constructor() {
        this._isTraversing = false;
    }

    startTraversing() {
        this._isTraversing = true;
    }

    stopTraversing() {
        this._isTraversing = false;
    }

    isTraversing() {
        return this._isTraversing;
    }
}

module.exports = Dispatcher;
