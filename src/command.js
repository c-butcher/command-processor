const CommandError = require('formatted-error');
const CommandEvent = require('./events/command-event');
const CommandEvents = require('./command-events');
const CommandInput = require('./command-input');
const Dispatcher = require('./dispatcher');

/**
 * Command Class
 *
 * @function execute
 */
class Command {
    /**
     * @param {CommandInput[]} inputs
     * @param {object} options
     */
    constructor(inputs = [], options = {}) {
        if (this.constructor === Command) {
            throw new CommandError('Command cannot be instantiated directly.');
        }

        if (typeof this.execute !== 'function') {
            throw new CommandError("Command must implement the execute() method.");
        }

        if (!options || typeof options !== 'object') {
            throw new CommandError("Argument 'options' must be an object.");
        }

        if (!Array.isArray(inputs)) {
            throw new CommandError("Argument 'inputs' must be an array.");
        }

        /** @type {Map<string, CommandInput>} */
        this.inputs = new Map();
        this.options = new Map(Object.entries(
            Object.assign(this.constructor.defaults(), options)
        ));

        this._finished = false;
        this._results = null;

        inputs.forEach((input) => this.inputs.set(input.getName(), input));
    }

    /**
     * Describes the command and how it works by providing useful information about the
     * inputs, outputs and options for the command.
     *
     * @returns {{key: string|null, name: string|null, description: string|null, options: object, inputs: object, outputs: object}}
     */
    static describe() {
        return {
            key: null,
            name: null,
            description: null,
            options: {},
            inputs: {},
            outputs: {}
        };
    }

    /**
     * The default options for the command.
     *
     * @returns {{}}
     */
    static defaults() {
        return {};
    }

    /**
     * Returns the name of the command.
     *
     * @returns {string}
     */
    toString() {
        return this.constructor.describe().name;
    }

    /**
     * Process this command and return the resulting output.
     *
     * When the dispatcher has stopped processing, or this command has already been processed,
     * then this method will return the cached results.
     *
     * @param {Dispatcher} dispatcher
     *
     * @returns {Promise|object|null}
     */
    process(dispatcher) {
        if (!dispatcher.isProcessing() || this.isFinished()) {
            return this._results;
        }

        let event = new CommandEvent(this);
        CommandEvents.emit(CommandEvents.COMMAND_STARTED, event);

        return Promise
            .resolve(dispatcher)
            .then(dispatcher => this._loadInputs(dispatcher))
            .then(dispatcher => this.execute(dispatcher))
            .then(results    => this._finish(results));
    }

    /**
     * Loads all of the input values by executing all the input commands.
     *
     * @param {Dispatcher} dispatcher
     *
     * @returns {Dispatcher}
     *
     * @private
     */
    _loadInputs(dispatcher) {
        this.inputs.forEach(input => this._loadInput(input, dispatcher));

        return dispatcher;
    }

    /**
     * Load a single input value.
     *
     * @param {CommandInput} input
     * @param {Dispatcher} dispatcher
     *
     * @returns {Promise<*>}
     *
     * @private
     */
    async _loadInput(input, dispatcher) {
        let lookup  = input.getLookup();
        let command = input.getCommand();
        let results = await command.process(dispatcher);

        if (!results || !results[lookup]) {
            throw new CommandError("Command '{command}' did not have the '{output}' output.", {
                command: command.constructor.describe().name,
                results: results,
                output: lookup,
            });
        }

        input.setValue(results[lookup]);

        if (input.shouldSanitize()) {
            input.sanitize();
        }

        if (input.shouldValidate()) {
            input.validate();
        }

        return dispatcher;
    }

    /**
     * Finish executing this command by setting the results.
     *
     * @param {object} results
     *
     * @returns {object}
     *
     * @private
     */
    _finish(results) {
        this._finished = true;
        this._results = results;

        let event = new CommandEvent(this);
        CommandEvents.emit(CommandEvents.COMMAND_FINISHED, event);

        return event.getResults();
    }

    /**
     * Returns a single result from the commands output.
     *
     * @param {string} name
     * @param {*} defaultValue
     *
     * @returns {*}
     */
    getResult(name, defaultValue = null) {
        if (!this._results || !this._results[name]) {
            return defaultValue;
        }

        let result = this._results[name];
        if (typeof result === 'object') {
            result = Object.assign({}, result);
        }

        return result;
    }

    /**
     * Returns the results.
     *
     * @returns {object}
     */
    getResults() {
        if (!this._results) {
            return null;
        }

        return Object.assign({}, this._results);
    }

    /**
     * Tells whether this command has finished executing.
     *
     * @returns {boolean}
     */
    isFinished() {
        return this._finished;
    };
}

module.exports = Command;
