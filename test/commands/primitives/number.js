const Command = require('../../../src/command');
const Dispatcher = require('../../../src/dispatcher');

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

module.exports = NumberCommand;