const Input = require('../input');
const Command = require('../command');
const BuildError = require('formatted-error');

class InputBuilder {
    /**
     * Builder for creating an Input.
     *
     * @param {string} name
     * @param {InputBuilder|ProcessBuilder|null} sender
     */
    constructor(name, sender = null) {
        this._name = name;
        this._sender = sender;
        this._inputs = [];
    }

    /**
     * Fetches a new input from another command.
     *
     * @param input
     * @returns {InputBuilder}
     */
    fetch(input) {
        let builder = new InputBuilder(input, this);

        this._inputs.push(builder);

        return builder;
    }

    /**
     * The command that we're looking in.
     *
     * @param {Command|function|string} command
     *
     * @returns {InputBuilder}
     */
    using(command) {
        this._command = command;

        return this;
    }

    /**
     * Tells us what options to use with our command.
     *
     * @param {object} options
     *
     * @returns {InputBuilder}
     */
    with(options = {}) {
        this._options = options;

        return this;
    }

    /**
     * Tells us what kind of data the input holds.
     *
     * @param {string} type
     *
     * @returns {InputBuilder}
     */
    as(type) {
        this._type = type;

        return this;
    }

    /**
     * Tells us where to look for our input value.
     *
     * @param {string} output
     *
     * @returns {InputBuilder}
     */
    from(output) {
        this._lookup = output;

        return this;
    }

    /**
     * Tell us what to use as a default value.
     *
     * @param {any} value
     *
     * @returns {InputBuilder}
     */
    default(value) {
        this._default = value;

        return this;
    }

    /**
     * Tells us that the input is required.
     *
     * @param {boolean} option
     *
     * @returns {InputBuilder}
     */
    required(option = true) {
        this._required = option;

        return this;
    }

    /**
     * Tell us how to sanitize the input data.
     *
     * @param {object|function|boolean} option
     *
     * @returns {InputBuilder}
     */
    cleanWith(option = {}) {
        this._sanitize = option;

        return this;
    }

    /**
     * Tell us how to validate the input data.
     *
     * @param {object|function|boolean} option
     *
     * @returns {InputBuilder}
     */
    checkWith(option = {}) {
        this._validate = option;

        return this;
    }

    /**
     * Builds and returns a new Input.
     *
     * @returns {Input}
     */
    build() {
        return new Promise(async (resolve, reject) => {
            let inputs = [];
            for (let input of this._inputs) {
                inputs.push( await input.build() );
            }

            let command = this._command;
            if (typeof command === 'function') {
                command = new this._command(inputs, this._options);

            } else if (command instanceof Command) {
                command = new this._command.constructor(inputs, this._options);

            } else {
                return reject(new BuildError("Input command must implement abstract Command."));
            }

            let input = new Input(command, {
                name: this._name,
                type: this._type,
                lookup: this._lookup,
                default: this._default,
                required: this._required,
                sanitize: this._sanitize,
                validate: this._validate,
            });

            resolve(input);
        });
    }

    /**
     * Finishes this input builder.
     *
     * @returns {Promise<InputBuilder|ProcessBuilder>}
     */
    end() {
        return this._sender;
    }
}

module.exports = InputBuilder;
