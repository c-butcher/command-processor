const { assert, expect } = require('chai');
const Process = require('../src/process');
const Dispatcher = require('../src/dispatcher');
const CommandInput = require('../src/command-input');

const Math = require('../src/commands/math');
const Primitives = require('../src/commands/primitives');
const Dispatch = require('../src/commands/dispatcher');

describe('Process', function() {

    describe('constructor(dispatcher, command, options)', () => {
        it('passes when instantiated without an error', async () => {
            expect(() => {
                let dispatcher = new Dispatcher(this);
                let command = new Primitives.NumberCommand([], { value: 10 });
                let process = new Process(dispatcher, command);
            }).to.not.throw();
        });

        it('throws error without dispatcher', async () => {
            expect(() => {
                let command = new Primitives.NumberCommand([], { value: 10 });
                let process = new Process(null, command);
            }).to.throw();
        });

        it('throws error without command', async () => {
            expect(() => {
                let dispatcher = new Dispatcher(this);
                let process = new Process(dispatcher, null);
            }).to.throw();
        });

        it('throws error without options', async () => {
            expect(() => {
                let dispatcher = new Dispatcher(this);
                let command = new Primitives.NumberCommand([], { value: 10 });
                let process = new Process(dispatcher, command, null);
            }).to.throw();
        });
    });

    describe('describe()', () => {
        it('passes when an object is returned', () => {
            let description = Process.describe();
            assert.isObject(description);
        });
    });

    describe('defaults()', () => {
        it('passes when an object is returned', () => {
            let defaults = Process.defaults();
            assert.isObject(defaults);
        });
    });

    describe('run()', () => {
        it('passes when a process is marked as finished', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let commands = {
                start: new Primitives.NumberCommand([], { value: 5 }),
                addition: new Primitives.NumberCommand([], { value: 10 })
            };

            let inputs = [
                new CommandInput(commands.start, {name: 'start', lookup: 'value'}),
                new CommandInput(commands.addition, {name: 'addition', lookup: 'value'})
            ];

            let command = new Math.AddCommand(inputs);
            let process = new Process(dispatcher, command);

            assert.isFalse(process.isFinished());

            await process.run();

            assert.isTrue(process.isFinished());
        });
    });

    describe('getDispatcher()', () => {
        it('passes when dispatcher is returned', () => {
            let dispatcher = new Dispatcher(this);
            let command = new Primitives.NumberCommand();
            let process = new Process(dispatcher, command);

            assert.isObject(process.getDispatcher());
            assert.strictEqual(dispatcher, process.getDispatcher());
        });
    });

    describe('getCommand()', () => {
        it('passes when command is returned', () => {
            let dispatcher = new Dispatcher(this);
            let command = new Primitives.NumberCommand();
            let process = new Process(dispatcher, command);

            assert.isObject(process.getCommand());
            assert.strictEqual(command, process.getCommand());
        });
    });

    describe('getResults()', () => {
        it('passes when a process returns a single result after running', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let commands = {
                start: new Primitives.NumberCommand([], { value: 5 }),
                addition: new Primitives.NumberCommand([], { value: 10 })
            };

            let inputs = [
                new CommandInput(commands.start, {name: 'start', lookup: 'value'}),
                new CommandInput(commands.addition, {name: 'addition', lookup: 'value'})
            ];

            let command = new Math.AddCommand(inputs);
            let process = new Process(dispatcher, command);

            await process.run();

            assert.isObject(process.getResults());
            assert.hasAllKeys(process.getResults(), ['value']);
        });

        it('passes when a process returns an empty result before running', async () => {
            let dispatcher = new Dispatcher(this);

            let command = new Math.AddCommand([]);
            let process = new Process(dispatcher, command);

            assert.isObject(process.getResults());
            assert.isEmpty(process.getResults());
        });
    });
});
