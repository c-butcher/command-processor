const EventEmitter = require('events').EventEmitter;

let instance = null;

class CommandEvents extends EventEmitter {
    constructor() {
        super();

        this.INPUT_VALIDATED = 'command.input.validated';
        this.INPUT_SANITIZED = 'command.input.sanitized';

        this.COMMAND_STARTED  = 'command.started';
        this.COMMAND_FINISHED = 'command.finished';
    }

    /**
     * Returns an event manager for commands.
     *
     * @returns {CommandEvents}
     */
    static getInstance() {
        if (!instance) {
            instance = new CommandEvents();
        }

        return instance;
    }
}


/**
 * @type {CommandEvents}
 */
module.exports = CommandEvents.getInstance();
