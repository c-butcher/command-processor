class CommandEvent {
    /**
     * Provides data access to a command.
     *
     * @param {Command} command
     * @param {Dispatcher} dispatcher
     */
    constructor(command, dispatcher) {
        this._command = command;
        this._dispatcher = dispatcher;
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
     * Returns the dispatcher.
     *
     * @returns {Dispatcher}
     */
    getDispatcher() {
        return this._dispatcher;
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
