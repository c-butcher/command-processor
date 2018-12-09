const BuildError = require('formatted-error');
const Command = require('../command');
const Dispatcher = require('../dispatcher');
const InputBuilder = require('./input-builder');
const Process = require('../process');

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
        let builder = new InputBuilder(output, this);

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
            // Make sure that the dispatcher is legit.
            if (!(this._dispatcher instanceof Dispatcher)) {
                return reject(new BuildError("Dispatcher must be an instance of Dispatcher."));
            }

            let inputs = [];

            //  Go through all of our inputs
            for (let input of this._inputs) {
                // and make sure they all load before we continue.
                inputs.push( await input.build().catch(reject) );
            }

            let command = this._command;

            // If the command is a callable function,
            if (typeof this._command === 'function') {
                // then all we need to do is initialize it,
                command = new this._command(inputs, this._options);

            // but if the command is already initialized,
            } else if (this._command instanceof Command) {
                // then we need to re-initialize with our new inputs and options.
                command = new this._command.constructor(inputs, this._options);

            } else {
                // the process just got boinked!
                return reject(new BuildError("Process must have a valid starting Command."));
            }

            // Let's just hope we get this result...
            resolve(new Process(this._dispatcher, command));
        });
    }

    /**
     * This is the top of the building structure, so since there
     * isn't anything above us, we return our-self.
     *
     * @returns {ProcessBuilder}
     */
    end() {
        return this;
    }
}

module.exports = ProcessBuilder;
