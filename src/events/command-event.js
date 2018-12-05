class CommandEvent extends Event {
    /**
     * Provides data access to a command.
     *
     * @param {Command} command
     */
    constructor(command) {
        super();

        this._command = command;
    }

    /**
     * Returns the name of the command.
     *
     * @returns {string}
     */
    getName() {
        return this._command.constructor.describe().name;
    }

    /**
     * Returns an object that describes the command.
     *
     * @returns {{key: (string), name: (string), description: (string), options: Object, inputs: Object, outputs: Object}}
     */
    getDescription() {
        return this._command.constructor.describe();
    }

    /**
     * Returns the command.
     *
     * @returns {Command}
     */
    getCommand() {
        return this._command;
    }

    /**
     * Returns the results of the command.
     *
     * @returns {*}
     */
    getResults() {
        return this._command.getResults();
    }
}

module.exports = CommandEvent;
