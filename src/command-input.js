const CommandEvents = require('./command-events');
const CommandInputError = require('formatted-error');
const CommandInputEvent = require('./events/command-input-event');
const CommandInputValidationEvent = require('./events/command-input-validation-event');

class CommandInput {
    /**
     * Creates a link between one commands input and another commands output.
     *
     * @param {Command} command
     * @param {object} options
     */
    constructor(command, options = {}) {
        if (typeof options.name !== 'string') {
            throw new CommandInputError("Argument 'name' must be a string.");
        }

        if (typeof options.lookup !== 'string') {
            throw new CommandInputError("Argument 'lookup' must be a string.");
        }

        if (typeof command !== 'object' || typeof command.execute !== 'function') {
            throw new CommandInputError("Argument 'command' must be instance of Command.");
        }

        options = Object.assign(this.constructor.defaults(), options);

        this._name     = options.name;
        this._lookup   = options.lookup;
        this._required = options.required;
        this._sanitize = options.sanitize;
        this._validate = options.validate;
        this._command  = command;
        this._value    = undefined;
    }

    /**
     * The default options for a command input.
     *
     * @returns {{name: null, lookup: null, required: boolean, sanitize: boolean, validate: boolean, command: null}}
     */
    static defaults() {
        return {
            name: null,
            lookup: null,
            required: false,
            sanitize: true,
            validate: false,
            command: null,
        };
    };

    /**
     * Returns the name of the commands input.
     *
     * @returns {string}
     */
    getName() {
        return this._name;
    }

    /**
     * Returns the name of the output variable which contains our input value.
     *
     * @returns {string}
     */
    getLookup() {
        return this._lookup;
    }

    /**
     * Returns the input value or "undefined" when the value is not found.
     *
     * @returns {*|undefined}
     */
    getValue() {
        return this._value;
    }

    /**
     * Set the input value.
     *
     * @param {*} value
     *
     * @returns {CommandInput}
     */
    setValue(value) {
        this._value = value;
        return this;
    }

    /**
     * Returns the command that produced the input value.
     *
     * @returns {Command}
     */
    getCommand() {
        return this._command;
    }

    /**
     * Returns whether this input is required.
     *
     * @returns {boolean}
     */
    isRequired() {
        return this._required;
    }

    /**
     * Tells us whether we should run our sanitation methods.
     *
     * @returns {boolean}
     */
    shouldSanitize() {
        return !!this._sanitize;
    }

    /**
     * Tells us whether we should run our validation methods.
     *
     * @returns {boolean}
     */
    shouldValidate() {
        return !!this._validate;
    }

    /**
     * Tells us whether to sanitize our input.
     *
     * @returns {CommandInput}
     */
    sanitize() {
        if (typeof this._sanitize === 'function') {
            this._value = this._sanitize(this._value);
        }

        let event = new CommandInputEvent(this, this._value);
        CommandEvents.emit(CommandEvents.INPUT_SANITIZED, event);

        this._value = event.getValue();

        return this;
    }

    /**
     * Tells us whether to validate our input.
     *
     * @returns {Error[]}
     */
    validate() {
        let errors = [];
        if (typeof this._validate === 'function') {
            errors = this._validate(this._value);
        }

        let event = new CommandInputValidationEvent(this, this._value, errors);
        CommandEvents.emit(CommandEvents.INPUT_VALIDATED, event);

        return event.getErrors();
    }
}

module.exports = CommandInput;
