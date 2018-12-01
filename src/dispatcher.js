class Dispatcher {
    constructor() {
        this._processing = false;
    }

    startProcessing() {
        this._processing = true;
    }

    stopProcessing() {
        this._processing = false;
    }

    isProcessing() {
        return this._processing;
    }
}

module.exports = Dispatcher;
