const Command = require('../../../src/command');

class ResetCommand extends Command {
    /**
     * Default options for the command.
     *
     * @returns {{processing: boolean}}
     */
    defaults() {
        return {
            processing: true
        };
    };

    /**
     * Resets the dispatcher back to its original state.
     *
     * @param {Dispatcher} dispatcher
     *
     * @returns {object}
     */
    execute(dispatcher) {
        dispatcher.reset();

        let isProcessing = !!this.options.get('processing');
        if (isProcessing) {
            dispatcher.startProcessing();
        }

        return {
            dispatcher,
            isProcessing,
        };
    }
}

module.exports = ResetCommand;