const chai = require('chai');
const Command = require('../src/command');
const Dispatcher = require('../src/dispatcher');

const Math = require('../src/commands/math');
const Primitives = require('../src/commands/primitives');

describe('Command', function() {

    describe('constructor()', function() {
        it('passes when command cannot instantiate directly', () => {
            chai.expect(() => {
                let command = new Command();
            }).to.throw();
        });

        it('passes when child command can instantiate', () => {
            chai.expect(() => {
                let command = new Math.AddCommand();
            }).to.not.throw();
        });
    });

    describe('describe()', () => {
        it('passes when an object is returned', () => {
            chai.assert.isObject(Command.describe());
        });
    });

    describe('defaults()', () => {
        it('passes when an object is returned', () => {
            chai.assert.isObject(Command.defaults());
        });
    });

    describe('process(dispatcher)', () => {
        it('passes when an object is returned', async () => {
            let dispatcher = new Dispatcher(this);
            let command = new Math.AddCommand([{
                name: 'start',
                from: 'value',
                command: new Primitives.NumberCommand([], { value: 10 })
            }, {
                name: 'addition',
                from: 'value',
                command: new Primitives.NumberCommand([], { value: 5 })
            }]);

            dispatcher.startProcessing();

            let results = await command.process(dispatcher);

            chai.assert.isObject(results);
        });

        it('passes when inputs are loaded', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let inputs = [{
                name: 'start',
                from: 'value',
                command: new Primitives.NumberCommand([], { value: 12 })
            }, {
                name: 'addition',
                from: 'value',
                command: new Primitives.NumberCommand([], { value: 8 })
            }];

            let command = new Math.AddCommand(inputs);
            let results = await command.process(dispatcher);

            chai.assert.isObject(results);
            chai.assert.hasAllKeys(results, ['value']);
            chai.assert.equal(results.value, 20)
        });
    });

    describe('getResult(name, defaultValue)', () => {
        it('passes when result exists', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let inputs = [{
                name: 'start',
                from: 'value',
                command: new Primitives.NumberCommand([], { value: 0 })
            }, {
                name: 'addition',
                from: 'value',
                command: new Primitives.NumberCommand([], { value: 8 })
            }];

            let command = new Math.AddCommand(inputs);

            let before  = command.getResult('value');
            let results = await command.process(dispatcher);
            let after   = command.getResult('value');

            chai.assert.isNull(before);
            chai.assert.isNotNull(after);
            chai.assert.equal(results.value, after);
        });

        it('passes when result does not exist', async () => {
            let command = new Math.AddCommand();

            let value = command.getResult('non-existent', 'Default Value');

            chai.assert.equal(value, 'Default Value');
        });
    });

    describe('getResults()', () => {
        it('passes when asking for finished results', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let inputs = [{
                name: 'start',
                from: 'value',
                command: new Primitives.NumberCommand([], { value: 0 })
            }, {
                name: 'addition',
                from: 'value',
                command: new Primitives.NumberCommand([], { value: 8 })
            }];

            let command = new Math.AddCommand(inputs);

            let before  = command.getResults();
            let results = await command.process(dispatcher);
            let after   = command.getResults();

            chai.assert.isNull(before);
            chai.assert.isObject(after);
            chai.assert.equal(results.value, after.value);
        });

        it('fails null when command is not finished', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let inputs = [{
                name: 'start',
                from: 'value',
                command: new Primitives.NumberCommand([], { value: 0 })
            }, {
                name: 'addition',
                from: 'value',
                command: new Primitives.NumberCommand([], { value: 8 })
            }];

            let command  = new Math.AddCommand(inputs);
            let results  = command.getResults();
            let finished = command.isFinished();

            chai.assert.isNull(results);
            chai.assert.isFalse(finished);
        });
    });

    describe('isFinished()', () => {
        it('passes when the command is finished', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let command = new Math.AddCommand();
            await command.process(dispatcher);
            let isFinished = command.isFinished();

            chai.assert.isTrue(isFinished);
        });

        it ('fails when the command has not finished', async () => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let command = new Math.AddCommand();
            let isFinished = command.isFinished();

            chai.assert.isFalse(isFinished);
        });
    });
});
