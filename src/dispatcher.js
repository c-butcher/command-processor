const DispatchError = require('formatted-error');

class Dispatcher {
    /**
     * Dispatchers are used to help expose crucial parts of the application layer
     * to our commands, such as the database and template services.
     * @param options
     */
    constructor(options = {}) {
        if (!options || typeof options !== 'object') {
            throw new DispatchError("Argument 'options' must be an object.");
        }

        this._options = options;
        this.reset();
    }

    /**
     * Tells whether the dispatcher can hold its state.
     *
     * @returns {boolean|*}
     */
    isStateful() {
        return this._stateful;
    }

    /**
     * Sets whether the dispatcher should hold its state.
     *
     * @param {boolean} isStateful
     *
     * @returns {Dispatcher}
     */
    setStateful(isStateful) {
        this._stateful = isStateful;

        return this;
    }

    /**
     * Reset the dispatcher to the default options it was instantiated with,
     * and also clears out any stateful variables.
     *
     * @returns {Dispatcher}
     */
    reset() {
        this._processing = false;
        this._stateful   = !!this._options.stateful;

        return this;
    }

    /**
     * Stop processing commands.
     *
     * @returns {Dispatcher}
     */
    startProcessing() {
        this._processing = true;

        return this;
    }

    /**
     * Stop processing commands.
     *
     * @returns {Dispatcher}
     */
    stopProcessing() {
        this._processing = false;

        return this;
    }

    /**
     * Tells whether the dispatcher is current processing commands.
     *
     * @returns {boolean}
     */
    isProcessing() {
        return this._processing;
    }
}

module.exports = Dispatcher;
