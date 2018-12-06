const Command = require('./src/command');
const CommandEvent = require('./src/events/command-event');
const Dispatcher = require('./src/dispatcher');
const Events = require('./src/events');
const Input = require('./src/input');
const InputEvent = require('./src/events/input-event');
const InputValidationEvent = require('./src/events/input-validation-event');
const Process = require('./src/process');

if (require.resolve('data-sanitizers')) {
    require('./src/subscribers/sanitation');
}

if (require.resolve('data-validators')) {
    require('./src/subscribers/validation');
}

module.exports = {
    Command,
    CommandEvent,
    Dispatcher,
    Events,
    Input,
    InputEvent,
    InputValidationEvent,
    Process,
};
