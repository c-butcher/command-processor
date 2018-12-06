const Command = require('./command');
const Dispatcher = require('./dispatcher');
const ProcessError = require('formatted-error');
const ProcessEvent = require('./events/process-event');
const Events = require('./events');

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
        this._finished   = false;
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
    async run() {
        // Start our command dispatcher
        this._dispatcher.startProcessing();

        let event = new ProcessEvent(this);
        Events.emit(Events.PROCESS_STARTED, event);

        this._results = await this._command.process(this._dispatcher);

        // Wash the dispatcher if necessary
        if (!this._dispatcher.isStateful()) {
            this._dispatcher.reset();
        }

        // Stop the command dispatcher and mark as finished.
        this._dispatcher.stopProcessing();

        Events.emit(Events.PROCESS_FINISHED, event);

        return this._results;
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
