const Command = require('./src/command');
const CommandEvent = require('./src/events/command-event');
const CommandInput = require('./src/command-input');
const CommandInputEvent = require('./src/events/command-input-event');
const CommandInputValidationEvent = require('./src/events/command-input-validation-event');
const Dispatcher = require('./src/dispatcher');
const Process = require('./src/process');
const Events = require('./src/events');

if (require.resolve('data-sanitizers')) {
    require('./src/subscribers/sanitation');
}

if (require.resolve('data-validators')) {
    require('./src/subscribers/validation');
}

module.exports = {
    Command,
    CommandEvent,
    CommandInput,
    CommandInputEvent,
    CommandInputValidationEvent,
    Dispatcher,
    Events,
    Process,
};
