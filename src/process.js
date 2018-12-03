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

        this._dispatcher = dispatcher;
        this._command = command;
        this._options = Object.assign(this.constructor.defaults(), options);
        this._results = [];
        this._finished = false;
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
        // If the process has been run already, then return the results.
        if (this.isFinished()) {
            return this._results;
        }

        // Start our command dispatcher
        this._dispatcher.startProcessing();

        // Execute the command
        return Promise
            .resolve(this._dispatcher)
            .then(dispatcher => this._command.process(dispatcher))
            .then(result => this._setResult(result))
            .then(() => this._shutdown())
            .then(() => this.getResults());
    }

    /**
     * Attempt to shutdown the process.
     *
     * @returns {boolean}
     */
    _shutdown() {
        // Wash the dispatcher if necessary
        if (!this._dispatcher.isStateful()) {
            this._dispatcher.reset();
        }

        // Stop the command dispatcher
        this._dispatcher.stopProcessing();
        this._finished = true;

        return true;
    }

    /**
     * Sets the returned results for this process.
     *
     * @param {object} result
     *
     * @returns {Process}
     *
     * @private
     */
    _setResult(result) {
        this._results = result;
        return this;
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

        return Object.assign({}, this._results);
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

    /**
     * Tells whether the this process has finished executing.
     *
     * @returns {boolean}
     */
    isFinished() {
        return this._finished;
    }
}

module.exports = Process;
