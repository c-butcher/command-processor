const CommandError = require('formatted-error');
const CommandEvent = require('./events/command-event');
const Dispatcher = require('./dispatcher');
const Events = require('./events');
const Input = require('./input');

/**
 * Command Class
 *
 * @function execute
 */
class Command {

    /**
     * @param {Input[]} inputs
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

        options = Object.assign(this.constructor.defaults(), options);

        this.inputs = new Map();
        this.options = new Map(Object.entries(options));

        this._finished = false;
        this._results  = null;
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
     * @returns {Promise<object>}
     */
    async process(dispatcher) {
        if (!dispatcher.isProcessing() || this.isFinished()) {
            return this._results;
        }

        let event = new CommandEvent(this, dispatcher);
        Events.emit(Events.COMMAND_STARTED, event);

        for (let input of this._inputs) {
            await this._prepare(input, dispatcher);
        }

        await this._execute(dispatcher);

        Events.emit(Events.COMMAND_FINISHED, event);

        return event.getResults();
    }

    /**
     * Executes the input command and then sets the inputs value from the results.
     *
     * @param {Input} input
     * @param {Dispatcher} dispatcher
     *
     * @returns {Promise<object>}
     *
     * @private
     */
    _prepare(input, dispatcher) {
        return new Promise(async (resolve, reject) => {
            let lookup  = input.getLookup();
            let command = input.getCommand();

            let results = await command.process(dispatcher);
            if (!results || typeof results[lookup] === "undefined") {
                let error = new CommandError("Command '{command}' did not have '{lookup}' output.", {
                    lookup,
                    command,
                });

                return reject(error);
            }

            input.setValue(results[lookup]);

            if (input.shouldSanitize()) {
                input.sanitize();
            }

            if (input.shouldValidate()) {
                input.validate();
            }

            this.inputs.set(input.getName(), input.getValue());

            resolve(dispatcher);
        });
    }

    /**
     * Executes the command.
     *
     * @param dispatcher
     *
     * @returns {Promise<object>}
     *
     * @private
     */
    _execute(dispatcher) {
        return new Promise((resolve, reject) => {
            let results = this.execute(dispatcher);

            this._finished = true;
            this._results = results;

            let event = new CommandEvent(this, dispatcher);
            Events.emit(Events.COMMAND_FINISHED, event);

            this._results = event.getResults();

            return resolve(this._results);
        });
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
        if (!this._results || typeof this._results[name] === "undefined") {
            return defaultValue;
        }

        return this._results[name];
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
