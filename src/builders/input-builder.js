class InputBuilder {
    constructor(input, sender) {
        this._name = input;
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
    in(command) {
        this._command = command;

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
    sanitize(option = {}) {
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
    validate(option = {}) {
        this._validate = option;

        return this;
    }

    /**
     * Finishes this input builder.
     *
     * @returns {Promise<InputBuilder|ProcessBuilder>}
     */
    end() {
        return new Promise((resolve, reject) => {


            resolve(this._sender);
        });
    }
}

module.exports = InputBuilder;