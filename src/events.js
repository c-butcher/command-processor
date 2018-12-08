const EventEmitter = require('events').EventEmitter;

let instance = null;

class Events extends EventEmitter {
    constructor() {
        super();

        this.INPUT_VALIDATION = 'input.validation';
        this.INPUT_SANITATION = 'input.sanitation';

        this.COMMAND_STARTED  = 'command.started';
        this.COMMAND_FINISHED = 'command.finished';

        this.LOAD_COMMANDS = 'load.commands';
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
