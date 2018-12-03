const Command = require('../../command');
const Dispatcher = require('../../dispatcher');
const CommandError = require('formatted-error');

class ObjectCommand extends Command {
    static describe() {
        return {
            key: 'object',
            name: 'Object',
            description: 'Create an object value from key-value pairs.',
            options: [
                {
                    name: 'keys',
                    type: 'array',
                    description: 'The names which relate to the associated values.',
                    default: [],
                },
                {
                    name: 'values',
                    type: 'array',
                    description: 'The values which relate to the associated names.',
                    default: [],
                }
            ],
            outputs: [
                {
                    name: 'value',
                    type: 'object',
                    description: 'The object that was created by the key-value pairs.',
                    default: {}
                }
            ],
        };
    }

    /**
     * Returns an object value.
     *
     * @param {Dispatcher} dispatcher
     *
     * @returns {{value: object}}
     */
    execute(dispatcher) {
        let keys = this.options.get('keys');
        let values = this.options.get('values');

        if (keys.length !== values.length) {
            throw new CommandError("Cannot create object from un-even amount of key-value pairs.");
        }

        let obj = {};
        for (let i = 0; i < values.length; i++) {
            obj[keys[i]] = values[i];
        }

        return {
            value: obj
        };
    }
}

module.exports = ObjectCommand;