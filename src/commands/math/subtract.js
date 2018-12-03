const Command = require('../../command');

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
        let start = parseFloat(this.inputs.get('start'));
        if (!start) {
            start = parseFloat(this.options.get('start'));
        }

        let subtraction = parseFloat(this.inputs.get('subtraction'));
        if (!subtraction) {
            subtraction = parseFloat(this.options.get('subtraction'));
        }

        let value = start - subtraction;

        return { value };
    }
}

module.exports = SubtractCommand;