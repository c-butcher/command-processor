const Command = require('../../../src/command');

class StopProcessingCommand extends Command {
    /**
     * Stops the dispatcher.
     *
     * @param {Dispatcher} dispatcher
     *
     * @returns {object}
     */
    execute(dispatcher) {
        dispatcher.stopProcessing();

        let isProcessing = dispatcher.isProcessing();

        return {
            dispatcher,
            isProcessing,
        };
    }
}

module.exports = StopProcessingCommand;