const Command = require('../../command');

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
                    description: "The number that we start at."
                },
                addition: {
                    type: 'number',
                    description: "The number that we add to our starting number.",
                }
            },
            outputs: {
                value: {
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
        let start = this.inputs.get('start');
        let addition = this.inputs.get('addition');

        let value = start + addition;

        return { value };
    }
}

module.exports = AddCommand;