class ProcessEvent {
    /**
     * Provides data access to a process.
     *
     * @param {Process} process
     */
    constructor(process) {
        this._process = process;
    }

    /**
     * Returns the dispatcher.
     *
     * @returns {Dispatcher}
     */
    getDispatcher() {
        return this._process.getDispatcher();
    }

    /**
     * Returns the command.
     *
     * @returns {Command}
     */
    getCommand() {
        return this._process.getCommand();
    }

    /**
     * Returns the results of the process.
     *
     * @returns {*}
     */
    getResults() {
        return this._process.getResults();
    }
}

module.exports = ProcessEvent;
