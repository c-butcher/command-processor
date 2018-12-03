const Command = require('./src/command');
const Dispatcher = require('./src/dispatcher');
const Process = require('./src/process');

const Math = require('./src/commands/math');
const Primitives = require('./src/commands/primitives');

const Commands = {
    Math,
    Primitives,
};

module.exports = {
    Command,
    Dispatcher,
    Process,
    Commands,
};
