const Command = require('../../../src/command');

class MultiplyCommand extends Command {
    /**
     * Describes our command.
     *
     * @returns {object}
     */
    static describe() {
        return {
            key: 'multiple_number',
            name: 'Multiply Number',
            description: 'Multiply a number.',
            inputs: {
                start: {
                    type: 'number',
                    description: "The number that we start at."
                },
                multiplier: {
                    type: 'number',
                    description: "The number that we multiple our starting number by.",
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
            multiplier: 0
        };
    }

    /**
     * Multiplies a number by another number.
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

        let multiplier = this.inputs.get('multiplier');
        if (!multiplier) {
            multiplier = this.options.get('multiplier');
        }

        let value = start * multiplier;

        return { value };
    }
}

module.exports = MultiplyCommand;