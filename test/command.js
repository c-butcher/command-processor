const { assert, expect } = require('chai');
const Command = require('../src/command');
const CommandInput = require('../src/command-input');
const Dispatcher = require('../src/dispatcher');

const Math = require('../src/commands/math');
const Primitives = require('../src/commands/primitives');

describe('Command', function() {

    describe('constructor()', function() {
        it('passes when command cannot instantiate directly', () => {
            expect(() => {
                let command = new Command();
            }).to.throw();
        });

        it('passes when child command can instantiate', () => {
            expect(() => {
                let command = new Math.AddCommand();
            }).to.not.throw();
        });
    });

    describe('describe()', () => {
        it('passes when an object is returned', () => {
            assert.isObject(Command.describe());
        });
    });

    describe('defaults()', () => {
        it('passes when an object is returned', () => {
            assert.isObject(Command.defaults());
        });
    });

    describe('process(dispatcher)', () => {
        it('passes when an object is returned', async () => {
            let dispatcher = new Dispatcher(this);

            let commands = {
                start: new Primitives.NumberCommand([], { value: 0 }),
                addition: new Primitives.NumberCommand([], { value: 8 })
            };

            let command = new Math.AddCommand([
                new CommandInput(commands.start, {name: 'start', lookup: 'value'}),
                new CommandInput(commands.addition, {name: 'addition', lookup: 'value'})
            ]);

            dispatcher.startProcessing();

            let results = await command.process(dispatcher);

            assert.isObject(results);
        });

        it('passes when inputs are loaded', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let commands = {
                start: new Primitives.NumberCommand([], { value: 5 }),
                addition: new Primitives.NumberCommand([], { value: 10 })
            };

            let inputs = [
                new CommandInput(commands.start, {name: 'start', lookup: 'value', sanitize: true}),
                new CommandInput(commands.addition, {name: 'addition', lookup: 'value', sanitize: true})
            ];

            let command = new Math.AddCommand(inputs);
            let results = await command.process(dispatcher);

            assert.isObject(results);
            assert.hasAllKeys(results, ['value']);
            assert.equal(results.value, 15)
        });
    });

    describe('getResult(name, defaultValue)', () => {
        it('passes when result exists', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let commands = {
                start: new Primitives.NumberCommand([], { value: 0 }),
                addition: new Primitives.NumberCommand([], { value: 8 })
            };

            let inputs = [
                new CommandInput(commands.start, {name: 'start', lookup: 'value'}),
                new CommandInput(commands.addition, {name: 'addition', lookup: 'value'})
            ];

            let command = new Math.AddCommand(inputs);

            let before  = command.getResult('value');
            let results = await command.process(dispatcher);
            let after   = command.getResult('value');

            assert.isNull(before);
            assert.isNotNull(after);
            assert.equal(results.value, after);
        });

        it('passes when result does not exist', async () => {
            let command = new Math.AddCommand();

            let value = command.getResult('non-existent', 'Default Value');

            assert.equal(value, 'Default Value');
        });
    });

    describe('getResults()', () => {
        it('passes when asking for finished results', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let commands = {
                start: new Primitives.NumberCommand([], { value: 0 }),
                addition: new Primitives.NumberCommand([], { value: 8 })
            };

            let inputs = [
                new CommandInput(commands.start, {name: 'start', lookup: 'value'}),
                new CommandInput(commands.addition, {name: 'addition', lookup: 'value'})
            ];

            let command = new Math.AddCommand(inputs);

            let before  = command.getResults();
            let results = await command.process(dispatcher);
            let after   = command.getResults();

            assert.isNull(before);
            assert.isObject(after);
            assert.equal(results.value, after.value);
        });

        it('fails null when command is not finished', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let commands = {
                start: new Primitives.NumberCommand([], { value: 0 }),
                addition: new Primitives.NumberCommand([], { value: 8 })
            };

            let inputs = [
                new CommandInput(commands.start, {name: 'start', lookup: 'value'}),
                new CommandInput(commands.addition, {name: 'addition', lookup: 'value'})
            ];

            let command  = new Math.AddCommand(inputs);
            let results  = command.getResults();
            let finished = command.isFinished();

            assert.isNull(results);
            assert.isFalse(finished);
        });
    });

    describe('isFinished()', () => {
        it('passes when the command is finished', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let command = new Math.AddCommand();
            await command.process(dispatcher);
            let isFinished = command.isFinished();

            assert.isTrue(isFinished);
        });

        it ('fails when the command has not finished', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let command = new Math.AddCommand();
            let isFinished = command.isFinished();

            assert.isFalse(isFinished);
        });
    });
});
