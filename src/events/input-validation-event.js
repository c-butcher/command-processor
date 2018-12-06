class InputValidationEvent {
    /**
     * Provides data access to an input and the assigned value.
     *
     * @param {Input} input
     * @param {object} options
     * @param {Error[]} errors
     */
    constructor(input, options, errors = []) {
        this._input   = input;
        this._options = options;
        this._errors  = errors;
    }

    /**
     * Returns the type of input.
     *
     * @returns {*}
     */
    getType() {
        return this._input.getType();
    }

    /**
     * Returns the result of the input command.
     *
     * @returns {Object}
     */
    getValue() {
        return this._input.getValue();
    }

    /**
     * Returns the input validation options.
     *
     * @returns {object}
     */
    getOptions() {
        return this._options;
    }

    /**
     * Tells whether our input has validation errors.
     *
     * @returns {boolean}
     */
    hasErrors() {
        return this._errors.length > 0;
    }

    /**
     * Returns a list of the validation errors.
     *
     * @returns {Error[]}
     */
    getErrors() {
        return this._errors.splice();
    }

    /**
     * Add an error the list of validation errors.
     *
     * @param {Error} error
     */
    addError(error) {
        this._errors.push(error);
    }
}

module.exports = InputValidationEvent;
