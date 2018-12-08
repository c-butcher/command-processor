const Command = require('../../src/command');

class AddCommand extends Command {
    /**
     * Describes our command.
     *
     * @returns {object}
     */
    static describe() {
        return {
            key: 'add_number',
            name: 'Add Number',
            description: 'Add two numbers together.',
            inputs: {
                start: {
                    type: 'number',
                    description: "The number that we start at.",
                    sanitize: true
                },
                addition: {
                    type: 'number',
                    description: "The number that we add to our starting number.",
                    sanitize: true
                }
            },
            outputs: {
                value: {
                    name: 'Value',
                    type: 'number',
                    description: 'The final value.'
                }
            },
        }
    }

    /**
     * Increments a number by another number.
     *
     * @param {Dispatcher} dispatcher
     *
     * @returns {{value: number}}
     */
    execute(dispatcher) {
        let start    = this.inputs.get('start');
        let addition = this.inputs.get('addition');

        let value = start + addition;

        return { value };
    }
}

class NumberCommand extends Command {
    static describe() {
        return {
            key: 'number',
            name: 'Number',
            description: 'Create a number value.',
            output: {
                value: {
                    type: 'number',
                    description: "The numeric value."
                }
            }
        };
    }

    /**
     * Returns the number that it received.
     *
     * @returns {{value: number}}
     */
    static defaults() {
        return { value: 0 };
    }

    /**
     * Returns the number value.
     *
     * @param {Dispatcher} dispatcher
     * @returns {{value: number}}
     */
    execute(dispatcher) {
        let value = this.options.get('value');

        return { value };
    }
}

module.exports = {
    AddCommand,
    NumberCommand,
};