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
     * Sets a group of commands.
     *
     * @param {string} name
     * @param {function} commands
     *
     * @returns {LoadCommandsEvent}
     */
    addGroup(name, commands) {
        if (!Array.isArray(commands)) {
            throw new LoadError("Argument 'commands' must be an array or object.");
        }

        let group = this.getGroup(name);

        for (let command of commands) {
            if (typeof command !== 'function' || command.execute !== 'function') {
                throw new LoadError("Command group '{name}' has an invalid command.", {
                    name
                });
            }

            let key = command.constructor.describe().key;

            group.set(key, command);
        }

        return this;
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
     * Returns a list of all the command groups.
     *
     * @returns {Map<string, function>}
     */
    getGroups() {
        return this._groups;
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
}

module.exports = LoadCommandsEvent;
