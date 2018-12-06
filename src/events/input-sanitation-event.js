class InputSanitationEvent {
    /**
     * Provides access to the type and value of an input, and accepts a sanitized value.
     *
     * @param {string} type
     * @param {*} value
     * @param {object} options
     */
    constructor(type, value, options = {}) {
        this._type = type;
        this._value = value;
        this._options = options;
        this._sanitized = undefined;
    }

    /**
     * Returns the input type.
     *
     * @returns {string}
     */
    getType() {
        return this._type;
    }

    /**
     * Sets the sanitized value.
     *
     * @param {*} value
     */
    setSanitized(value) {
        this._sanitized = value;
    }

    /**
     * Returns the sanitized value.
     *
     * @returns {*}
     */
    getSanitized() {
        return this._sanitized;
    }

    /**
     * Returns the original un-altered value.
     *
     * @returns {*}
     */
    getValue() {
        return this._value;
    }

    /**
     * Returns the sanitation options.
     *
     * @returns {Object}
     */
    getOptions() {
        return this._options;
    }
}

module.exports = InputSanitationEvent;
