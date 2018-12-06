const Command = require('../../../src/command');

class SetStatefulCommand extends Command {
    /**
     * Set whether the dispatcher is stateful.
     *
     * @param {Dispatcher} dispatcher
     *
     * @returns {object}
     */
    execute(dispatcher) {
        let isStateful = this.inputs.get('stateful');

        dispatcher.setStateful(isStateful);

        return {
            dispatcher,
            isStateful
        };
    }
}

module.exports = SetStatefulCommand;