const CommandError = require('formatted-error');
const Dispatcher = require('./dispatcher');

/**
 * Command Class
 *
 * @function execute
 */
class Command {

    /**
     * @param {[{name: string, from: string, command: Command}]} inputs
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

        this.inputs = new Map();
        this.options = new Map(Object.entries(
            Object.assign(this.constructor.defaults(), options)
        ));

        this._finished = false;
        this._results = null;
        this._inputs = inputs;
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

        return Promise
            .resolve(dispatcher)
            .then(dispatcher => this._prepare(dispatcher))
            .then(dispatcher => this.execute(dispatcher))
            .then(results    => this._finish(results));
    }

    /**
     * Prepares the command before it can be executed. This involves executing
     * other commands in order to get the inputs for the current command.
     *
     * @param {Dispatcher} dispatcher
     *
     * @returns {Dispatcher}
     *
     * @private
     */
    async _prepare(dispatcher) {
        for (let i = 0; i < this._inputs.length; i++) {
            let input = this._inputs[i];
            await input.command.process(dispatcher)
                .then(results => this._setInputFromResult(input, results));
        }

        return dispatcher;
    }

    /**
     * Sets our input from the results we received from our input command.
     *
     * @param input
     * @param results
     *
     * @private
     */
    _setInputFromResult(input, results) {
        if (!results || typeof results[input.from] === "undefined") {
            throw new CommandError("Command '{command}' does not have '{name}' output.", {
                name: input.from,
                command: input.command.constructor.describe().name
            });
        }

        this.inputs.set(input.name, results[input.from]);
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

        return this.getResults();
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