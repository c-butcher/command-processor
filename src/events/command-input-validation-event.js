class CommandInputValidationEvent {
    /**
     * Provides data access to a command input and the assigned value.
     *
     * @param {CommandInput} input
     * @param {*} value
     * @param {Error[]} errors
     */
    constructor(input, value, errors = []) {
        this._input  = input;
        this._value  = value;
        this._errors = errors;
    }

    /**
     * Returns the input variables name.
     *
     * @returns {string|*}
     */
    getName() {
        return this._input.getName();
    }

    /**
     * Returns the lookup name of the property where the input value is located.
     *
     * @returns {string}
     */
    getLookup() {
        return this._input.getLookup();
    }

    /**
     * Returns the command that was executed in order to get our input value.
     *
     * @returns {Command|*}
     */
    getCommand() {
        return this._input.getCommand();
    }

    /**
     * Returns the result of the input command.
     *
     * @returns {Object}
     */
    getValue() {
        return this._value;
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

module.exports = CommandInputValidationEvent;
