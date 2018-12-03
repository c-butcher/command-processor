const ResetCommand = require('./dispatcher/reset');
const SetStatefulCommand = require('./dispatcher/set-stateful');
const StartProcessingCommand = require('./dispatcher/start-processing');
const StopProcessingCommand = require('./dispatcher/stop-processing');

module.exports = {
    ResetCommand,
    SetStatefulCommand,
    StartProcessingCommand,
    StopProcessingCommand,
};
