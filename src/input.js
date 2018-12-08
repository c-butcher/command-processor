const Events = require('./events');
const InputError = require('formatted-error');
const InputSanitationEvent = require('./events/input-sanitation-event');
const InputValidationEvent = require('./events/input-validation-event');

class Input {
    /**
     * Creates a link between one commands input and another commands output.
     *
     * @param {Command} command
     * @param {object} options
     */
    constructor(command, options = {}) {
        if (typeof options.type !== 'string') {
            throw new InputError("Argument 'type' must be a string.");
        }

        if (typeof options.lookup !== 'string') {
            throw new InputError("Argument 'lookup' must be a string.");
        }

        if (typeof command !== 'object' || typeof command.execute !== 'function') {
            throw new InputError("Argument 'command' must be instance of Command.");
        }

        options = Object.assign(this.constructor.defaults(), options);

        this._key         = options.key;
        this._name        = options.name;
        this._description = options.description;
        this._type        = options.type;
        this._lookup      = options.lookup;
        this._required    = options.required;
        this._sanitize    = options.sanitize;
        this._validate    = options.validate;
        this._command     = command;
        this._value       = undefined;
    }

    /**
     * The default options for a command input.
     *
     * @returns {{name: null, lookup: null, required: boolean, sanitize: boolean, validate: boolean, command: null}}
     */
    static defaults() {
        return {
            key: null,
            name: null,
            type: 'string',
            lookup: null,
            description: null,
            command: null,
            required: false,
            sanitize: true,
            validate: false,
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
     * Returns the description of this input.
     *
     * @returns {string}
     */
    getDescription() {
        return this._description;
    }

    /**
     * Returns the type of input this is.
     *
     * @returns {*}
     */
    getType() {
        return this._type;
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
     * @returns {Input}
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
     * @returns {Input}
     */
    sanitize() {
        // When there is a sanitation callback we simply need to execute it
        // and then we're done. No need to run our sanitation event below.
        if (typeof this._sanitize === 'function') {
            this._value = this._sanitize(this._value);
            return this._value;
        }

        // When the sanitize option is an object, that means we are passing
        // configuration options for our sanitizer to use. For instance, when
        // you sanitize a phone number you might want to specify a number separator.
        let options = {};
        if (typeof this._sanitize === 'object') {
            options = this._sanitize;
        }

        // Now comes the good part, where we execute the sanitation event
        let event = new InputSanitationEvent(this._type, this._value, options);
        Events.emit(Events.INPUT_SANITATION, event);

        this._value = event.getValue();

        return this._value;
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

        let options = {};
        if (typeof this._validate === 'object') {
            options = this._validate;
        }

        let event = new InputValidationEvent(this, options, errors);
        Events.emit(Events.INPUT_VALIDATION, event);

        return event.getErrors();
    }
}

module.exports = Input;
