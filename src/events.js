const EventEmitter = require('events').EventEmitter;

let instance = null;

class Events extends EventEmitter {
    constructor() {
        super();

        this.INPUT_VALIDATED = 'command.input.validated';
        this.INPUT_SANITIZED = 'command.input.sanitized';

        this.COMMAND_READY    = 'command.ready';
        this.COMMAND_STARTED  = 'command.started';
        this.COMMAND_FINISHED = 'command.finished';

        this.PROCESS_STARTED  = 'process.started';
        this.PROCESS_FINISHED = 'process.finished';
    }

    /**
     * Returns an event manager for commands.
     *
     * @returns {Events}
     */
    static getInstance() {
        if (!instance) {
            instance = new Events();
        }

        return instance;
    }
}


/**
 * @type {Events}
 */
module.exports = Events.getInstance();
