const Command = require('../../command');

class DivideCommand extends Command {
    /**
     * Describes our command.
     *
     * @returns {object}
     */
    static describe() {
        return {
            key: 'divide_number',
            name: 'Divide Number',
            description: 'Divide a number.',
            inputs: {
                start: {
                    type: 'number',
                    description: "The number that we start at."
                },
                divisor: {
                    type: 'number',
                    description: "The number that we divide our starting number by.",
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
            divisor: 0
        };
    }

    /**
     * Divides a number by another number.
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

        let divisor = this.inputs.get('divisor');
        if (!divisor) {
            divisor = this.options.get('divisor');
        }

        let value = start / divisor;

        return { value };
    }
}

module.exports = DivideCommand;