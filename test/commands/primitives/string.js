const Command = require('../../../src/command');
const Dispatcher = require('../../../src/dispatcher');

class StringCommand extends Command {
    static describe() {
        return {
            key: 'string',
            name: 'String',
            description: 'Create a text value.',
            options: [
                {
                    name: 'value',
                    type: 'string',
                    description: 'The text that you want to create.'
                }
            ]
        };
    }

    static defaults() {
        return { value: '' };
    }

    /**
     * Returns the string value.
     *
     * @param {Dispatcher} dispatcher
     * @returns {{value: string}}
     */
    execute(dispatcher) {
        let value = this.options.get('value');
        return {
            value: value
        }
    }
}

module.exports = StringCommand;