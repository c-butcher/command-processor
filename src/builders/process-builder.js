const InputBuilder = require('./input-builder');

class ProcessBuilder {
    /**
     * Build a process using the supplied starting command as our entry point.
     *
     * @param {Command} command
     */
    constructor(command) {
        this._command = command;
        this._inputs = [];
    }

    /**
     * Fetch an output from a new command.
     *
     * @param {string} output
     *
     * @returns {InputBuilder}
     */
    fetch(output) {
        let builder = new InputBuilder(output);

        this._inputs.push(builder);

        return builder;
    }

    /**
     *
     * @returns {Promise<Process>}
     */
    finish() {
        return new Promise((resolve, reject) => {

        });
    }
}

module.exports = ProcessBuilder;
