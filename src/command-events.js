const EventEmitter = require('events').EventEmitter;

class CommandEvents extends EventEmitter {
    constructor() {
        super();

        this.InputAssigned = 'command.input.assigned';
        this.Finished = 'command.finished';
    }
}

module.exports = new CommandEvents();
