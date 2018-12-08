const Command = require('../../../src/command');

class SubtractCommand extends Command {
    /**
     * Describes our command.
     *
     * @returns {object}
     */
    static describe() {
        return {
            key: 'subtract_number',
            name: 'Subtract Number',
            description: 'Subtract a number.',
            inputs: {
                start: {
                    type: 'number',
                    description: "The number that we start at."
                },
                subtraction: {
                    type: 'number',
                    description: "The number that we subtract from our starting number.",
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
     * The default options for our command.
     *
     * @returns {object}
     */
    static defaults() {
        return {
            start: 0,
            subtraction: 0
        };
    }

    /**
     * Decreases a number by another number.
     *
     * @param {Dispatcher} dispatcher
     *
     * @returns {{value: number}}
     */
    execute(dispatcher) {
        let start = this.inputs.get('start');
        if (!start) {
            start = this.options.get('start');
        }

        let subtraction = this.inputs.get('subtraction');
        if (!subtraction) {
            subtraction = this.options.get('subtraction');
        }

        let value = start - subtraction;

        return { value };
    }
}

module.exports = SubtractCommand;