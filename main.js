const Command = require('./src/command');
const CommandEvent = require('./src/events/command-event');
const Dispatcher = require('./src/dispatcher');
const Events = require('./src/events');
const Input = require('./src/input');
const InputBuilder = require('./src/builders/input-builder');
const InputSanitationEvent = require('./src/events/input-sanitation-event');
const InputValidationEvent = require('./src/events/input-validation-event');
const Process = require('./src/process');
const ProcessBuilder = require('./src/builders/process-builder');

let softDependencies = {
    "data-sanitizers": "./src/subscribers/sanitation",
    "data-validators": "./src/subscribers/validation",
};

for (let module in softDependencies) {
    if (require.resolve(module)) {
        require(softDependencies[module]);
    }
}

module.exports = {
    Command,
    CommandEvent,
    Dispatcher,
    Events,
    Input,
    InputBuilder,
    InputSanitationEvent,
    InputValidationEvent,
    Process,
    ProcessBuilder
};
