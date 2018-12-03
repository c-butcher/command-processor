const Command = require('../../command');
const Dispatcher = require('../../dispatcher');

class BooleanCommand extends Command {
    static describe() {
        return {
            key: 'boolean',
            name: 'Boolean',
            description: 'Create a boolean value.',
            options: [
                {
                    name: 'isTrue',
                    type: 'boolean',
                    description: 'The value of the boolean',
                    default: false,
                }
            ],
            outputs: [
                {
                    name: 'value',
                    type: 'boolean',
                    description: 'The boolean value that was created.',
                    default: false
                }
            ],
        };
    }

    static defaults() {
        return { isTrue: false };
    }

    /**
     * Returns the boolean value.
     *
     * @param {Dispatcher} dispatcher
     *
     * @returns {{value: boolean}}
     */
    execute(dispatcher) {
        let value = !!this.options.get('isTrue');
        return {
            value: value
        }
    }
}

module.exports = BooleanCommand;