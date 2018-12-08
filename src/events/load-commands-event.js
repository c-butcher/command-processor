const LoadError = require('formatted-error');

class LoadCommandsEvent {
    /**
     * Provides a way for other packages to load groups of commands into our system.
     */
    constructor() {
        this._groups = new Map();
    }

    /**
     * Adds a single command to a group.
     *
     * @param {Command|function} command
     * @param {string} group
     *
     * @return {LoadCommandsEvent}
     */
    addCommand(command, group = 'Default') {
        if (command instanceof Command) {
            command = command.constructor;
        }

        if (typeof command !== 'function' || typeof command.execute !== 'function') {
            throw new LoadError("Loaded command must implement abstract Command");
        }

        let key = command.constructor.describe().key;

        let commands = this.getGroup(group);
        commands.set(key, command);

        return this;
    }

    /**
     * Check to see if a specific group exists.
     *
     * @param name
     * @returns {boolean}
     */
    hasGroup(name) {
        return this._groups.has(name);
    }

    /**
     * Returns a group of commands, or creates a new one if it doesn't exist yet.
     *
     * @param {string} name
     *
     * @returns {Map<string, function>}
     */
    getGroup(name) {
        if (!this._groups.has(name)) {
            this._groups.set(name, new Map());
        }

        return this._groups.get(name);
    }

    /**
     * Sets a group of commands.
     *
     * @param {string} name
     * @param {array} commands
     *
     * @returns {LoadCommandsEvent}
     */
    addGroup(name, commands) {
        if (!Array.isArray(commands)) {
            throw new LoadError("Argument 'commands' must be an array or object.");
        }

        this._groups.set(name, commands);

        return this;
    }
}

module.exports = LoadCommandsEvent;
