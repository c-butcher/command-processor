const Command = require('./command');
const Dispatcher = require('./dispatcher');
const ProcessError = require('formatted-error');

class Process {
    /**
     * Processes are groups of commands that are executed in succession.
     *
     * @param {Dispatcher} dispatcher
     * @param {Command} command
     * @param {object} options
     */
    constructor(dispatcher, command, options = {}) {
        if (!(dispatcher instanceof Dispatcher)) {
            throw new ProcessError("Argument 'dispatcher' must be an instance of Dispatcher.")
        }

        if (!(command instanceof Command)) {
            throw new ProcessError("Argument 'command' must be an instance of Command.")
        }

        if (!options || typeof options !== 'object') {
            throw new ProcessError("Argument 'options' must be an object.")
        }

        this._options    = Object.assign(this.constructor.defaults(), options);
        this._dispatcher = dispatcher;
        this._command    = command;
        this._results    = null;
    }

    /**
     * Describes the type of process that this is.
     *
     * @returns {{key: string, name: string, description: string}}
     */
    static describe() {
        return {
            key: 'process',
            name: 'Process',
            description: 'Executes a list of commands in the order they are given.'
        };
    }

    /**
     * Default options for a dispatcher.
     *
     * @returns {object}
     */
    static defaults() {
        return {};
    }

    /**
     * Runs the process and returns the final results.
     *
     * @returns {Promise<object>}
     */
    run() {
        // Start our dispatcher
        this._dispatcher.startProcessing();

        // but wash the dispatcher in case it was used before.
        if (!this._dispatcher.isStateful()) {
            this._dispatcher.reset();
        }

        // Execute the process and then ...
        return this._command.process(this._dispatcher).then((results) => {

            // ... set the results that our process gave us.
            this._results = results;

            // Stop the dispatcher, who did such a great job
            this._dispatcher.stopProcessing();

            // and tell everyone about it!
            return this._results;
        });
    }

    /**
     * Returns the final result from the processes execution.
     *
     * @returns {object}
     */
    getResults() {
        if (!this._results || typeof this._results !== 'object') {
            return null;
        }

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
