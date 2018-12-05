const Command = require('./command');
const CommandEvents = require('./command-events');
const CommandInputError = require('formatted-error');
const CommandInputEvent = require('./events/command-input-event');

class CommandInput {
    /**
     * Creates a link between one commands input and another commands output.
     *
     * @param {string} name
     * @param {string} from
     * @param {Command} command
     */
    constructor(name, from, command) {
        if (typeof name !== 'string') {
            throw new CommandInputError("Argument 'name' must be a string.");
        }

        if (typeof from !== 'string') {
            throw new CommandInputError("Argument 'from' must be a string.");
        }

        if (!(command instanceof Command)) {
            throw new CommandInputError("Argument 'command' must be instance of Command.");
        }

        this._name = name;
        this._from = from;
        this._value = undefined;
        this._command = command;
    }

    /**
     * Returns the name of the commands input.
     *
     * @returns {string}
     */
    getName() {
        return this._name;
    }

    /**
     * Returns the input value or "undefined" when the value is not found.
     *
     * @returns {*}
     */
    getValue() {
        let value = undefined;
        let results = this._command.getResults();

        if (results && results[this._from]) {
            value = results[this._from];
        }

        return value;
    }

    /**
     * Set the input value.
     *
     * @param {*} value
     *
     * @returns {CommandInput}
     */
    setValue(value) {
        let event = new CommandInputEvent(this, value);
        CommandEvents.emit(CommandEvents.InputAssigned, event);

        this._value = event.getValue();

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
}

module.exports = CommandInput;
