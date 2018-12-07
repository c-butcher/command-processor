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

        this._inputs = inputs;
        this._results = null;
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

        // First we check the dispatcher to see if it's okay to run.
        if (!dispatcher.isProcessing()) {
            return this._results;
        }

        // Next we tell everyone that we're about to start executing,
        let event = new CommandEvent(this, dispatcher);
        Events.emit(Events.COMMAND_STARTED, event);

        // but first we need to load all our inputs and sanitize them first.
        for (let input of this._inputs) {
            await this._prepare(input, dispatcher);
        }

        // Then the only thing left to do is...
        return new Promise((resolve, reject) => {

            // ...execute our command ...
            this._results = this.execute(dispatcher);

            // ... tell everyone about it ...
            let event = new CommandEvent(this, dispatcher);
            Events.emit(Events.COMMAND_FINISHED, event);

            // ... and show them the results.
            resolve(this._results);
        });
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
        return this._results;
    }
}

module.exports = Command;
