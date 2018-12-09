const InputBuilder = require('./input-builder');
const BuildError = require('formatted-error');
const Process = require('../process');
const Command = require('../command');

class ProcessBuilder {
    /**
     * Build a process using the supplied starting command as our entry point.
     *
     * @param {Command} command
     */
    constructor(command) {
        this._command = command;
        this._options = {};
        this._inputs = [];
    }

    /**
     * Tells us which dispatcher to use.
     *
     * @param {Dispatcher} dispatcher
     *
     * @returns {ProcessBuilder}
     */
    use(dispatcher) {
        this._dispatcher = dispatcher;
        return this;
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
     * Build all the commands and inputs, then returns the process.
     *
     * @returns {Promise<Process>}
     */
    build() {
        return new Promise(async (resolve, reject) => {
            let inputs = [];

            //  Go through all of our inputs
            for (let input in this._inputs) {
                // and make sure they all load before we continue.
                await input.build().then(inputs.push);
            }

            let command = this._command;

            // If the command is a callable function,
            if (typeof this._command === 'function') {
                // then all we need to do is initialize it,
                command = this._command(inputs, this._options);

            // but if the command is already initialized,
            } else if (this._command instanceof Command) {
                // then we need to re-initialize with our new inputs and options.
                command = this._command.constructor(inputs, this._options);

            } else {
                // the process just got boinked!
                return reject(new BuildError("Process must have a valid starting Command."));
            }

            // Let's just hope we get this result...
            resolve(new Process(this._dispatcher, command));
        });
    }
}

module.exports = ProcessBuilder;
