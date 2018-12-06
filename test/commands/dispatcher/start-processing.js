const Command = require('../../../src/command');

class StartProcessingCommand extends Command {
    /**
     * Starts the dispatcher.
     *
     * @param {Dispatcher} dispatcher
     *
     * @returns {{dispatcher: Dispatcher, isProcessing: boolean}}
     */
    execute(dispatcher) {
        dispatcher.startProcessing();

        let isProcessing = dispatcher.isProcessing();

        return {
            dispatcher,
            isProcessing
        };
    }
}

module.exports = StartProcessingCommand;