class CommandInputEvent {
    /**
     * Provides data access to a command input and the assigned value.
     *
     * @param {CommandInput} input
     * @param {*} value
     */
    constructor(input, value) {
        this._input = input;
        this._value = value;
    }

    /**
     * Returns the command input.
     *
     * @returns {CommandInput}
     */
    getCommandInput() {
        return this._input;
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
}

module.exports = CommandInputEvent;
