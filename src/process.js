const Command = require('./command');
const Dispatcher = require('./dispatcher');
const ProcessError = require('formatted-error');

class Process {
    /**
     * Processes are groups of commands that are executed in succession.
     *
     * @param {Dispatcher} dispatcher
     * @param {Command} command
     */
    constructor(dispatcher, command) {
        if (!(dispatcher instanceof Dispatcher)) {
            throw new ProcessError("Argument 'dispatcher' must be an instance of Dispatcher.")
        }

        if (!(command instanceof Command)) {
            throw new ProcessError("Argument 'command' must be an instance of Command.")
        }

        this._dispatcher = dispatcher;
        this._command    = command;
        this._results    = null;
    }

    /**
     * Runs the process and returns the final results.
     *
     * @returns {Promise<object>}
     */
    run() {
        // We return a promise because our process might take a while, and
        // we don't want to block any UI or responsive features.
        return new Promise(async (resolve, reject) => {

            // First we wash our dispatcher in case it was used before.
            if (!this._dispatcher.isStateful()) {
                this._dispatcher.reset();
            }

            // Then we tell the dispatcher to start processing
            this._dispatcher.startProcessing();

            // We send the dispatcher through our process and get the results
            this._results = await this._command.process(this._dispatcher);

            // Then we stop the dispatcher
            this._dispatcher.stopProcessing();

            // and return the results from our process.
            resolve(this._results);
        });
    }

    /**
     * Returns the final result from the processes execution.
     *
     * @returns {object}
     */
    getResults() {
        return this._results;
    }

    /**
     * Returns the processes dispatcher.
     *
     * @returns {Dispatcher}
     */
    getDispatcher() {
        return this._dispatcher;
    }

    /**
     * Returns the processes starting command.
     *
     * @returns {Command}
     */
    getCommand() {
        return this._command;
    }
}

module.exports = Process;
