const chai = require('chai');
const Command = require('../src/command');
const Dispatcher = require('../src/dispatcher');
const IncrementCommand = require('./commands/increment');

describe('Command', function() {

    describe('constructor()', function() {
        it('passes when command cannot instantiate directly', () => {
            chai.expect(function(){
                let command = new Command();
            }).to.throw();
        });

        it('passes when child command can instantiate', () => {
            chai.expect(function(){
                let command = new IncrementCommand([], { value: 0 });
            }).to.not.throw();
        });
    });

    describe('describe()', function() {
        it('passes when an object is returned', () => {
            chai.assert.isObject(Command.describe());
        });
    });

    describe('defaults()', function() {
        it('passes when an object is returned', () => {
            chai.assert.isObject(Command.defaults());
        });
    });

    describe('process(dispatcher)', function() {
        it('passes when an object is returned', async () => {
            let dispatcher = new Dispatcher();
            let increment = new IncrementCommand([{
                name: 'value',
                from: 'value',
                command: new IncrementCommand()
            }]);

            dispatcher.startProcessing();

            let results = await increment.process(dispatcher);

            chai.assert.isObject(results);
        });

        it('passes when inputs are loaded', async () => {
            let dispatcher = new Dispatcher();
            dispatcher.startProcessing();

            let options = { start: 10, increment: 4 };
            let inputs = [{
                name: 'start',
                from: 'value',
                command: new IncrementCommand([], options)
            }];

            let command = new IncrementCommand(inputs,{ increment: 6 });
            let results = await command.process(dispatcher);

            chai.assert.isObject(results);
            chai.assert.hasAllKeys(results, ['value']);
            chai.assert.equal(results.value, 20)
        });
    });

    describe('getResult(name, defaultValue)', function() {
        it('passes when result exists', async () => {
            let dispatcher = new Dispatcher();
            dispatcher.startProcessing();

            let inputs = [{
                name: 'start',
                from: 'value',
                command: new IncrementCommand()
            }];

            let command = new IncrementCommand(inputs);

            let before  = command.getResult('value');
            let results = await command.process(dispatcher);
            let after   = command.getResult('value');

            chai.assert.isNull(before);
            chai.assert.isNotNull(after);
            chai.assert.equal(results.value, after);
        });

        it('passes when result does not exist', async () => {
            let command = new IncrementCommand();

            let value = command.getResult('non-existent', 'Default Value');

            chai.assert.equal(value, 'Default Value');
        });
    });

    describe('getResults()', function() {
        it('passes when asking for finished results', async () => {
            let dispatcher = new Dispatcher();
            dispatcher.startProcessing();

            let inputs = [{
                name: 'start',
                from: 'value',
                command: new IncrementCommand()
            }];

            let command = new IncrementCommand(inputs);

            let before  = command.getResults();
            let results = await command.process(dispatcher);
            let after   = command.getResults();

            chai.assert.isNull(before);
            chai.assert.isObject(after);
            chai.assert.equal(results.value, after.value);
        });

        it('fails null when command is not finished', async () => {
            let dispatcher = new Dispatcher();
            dispatcher.startProcessing();

            let inputs = [{
                name: 'start',
                from: 'value',
                command: new IncrementCommand()
            }];

            let command  = new IncrementCommand(inputs);
            let results  = command.getResults()
            let finished = command.isFinished();

            chai.assert.isNull(results);
            chai.assert.isFalse(finished);
        });
    });

    describe('isFinished()', function() {
        it('passes when the command is finished', async () => {
            let dispatcher = new Dispatcher();
            dispatcher.startProcessing();

            let command = new IncrementCommand();
            await command.process(dispatcher);
            let isFinished = command.isFinished();

            chai.assert.isTrue(isFinished);
        });

        it ('fails when the command has not finished', async () => {
            let dispatcher = new Dispatcher();
            dispatcher.startProcessing();

            let command = new IncrementCommand();
            let isFinished = command.isFinished();

            chai.assert.isFalse(isFinished);
        });
    });
});
