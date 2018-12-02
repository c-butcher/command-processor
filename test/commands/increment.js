const Command = require('../../src/command');

class IncrementCommand extends Command {
    static describe() {
        return {
            key: 'increment_by_one',
            name: 'Increase by One',
            description: 'Increments a value by one.',
            inputs: {
                start: {
                    type: 'number',
                    description: 'The numeric value that we want to increment.',
                }
            },
            outputs: {
                value: {
                    type: 'number',
                    description: 'The incremented value.'
                }
            },
        }
    }

    static defaults() {
        return {
            start: 0,
            increment: 1
        };
    }

    /**
     * Increments a number by one.
     *
     * @param {Dispatcher} dispatcher
     *
     * @returns {{value: number}}
     */
    execute(dispatcher) {
        let value = parseFloat(this.inputs.get('start'));
        if (!value) {
            value = parseFloat(this.options.get('start'));
        }

        let increment = parseFloat(this.inputs.get('increment'));
        if (!increment) {
            increment = parseFloat(this.options.get('increment'));
        }

        value = value + increment;

        return {
            value
        };
    }
}

module.exports = IncrementCommand;