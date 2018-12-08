const { assert, expect } = require('chai');
const Process = require('../src/process');
const Dispatcher = require('../src/dispatcher');
const Input = require('../src/input');

const Commands = require('./helpers/commands');

describe('Process', function() {

    describe('constructor(dispatcher, command, options)', () => {
        it('passes when initiated with dispatcher and command', () => {
            expect(() => {
                let dispatcher = new Dispatcher(this);
                let command = new Commands.NumberCommand([], { value: 10 });
                let process = new Process(dispatcher, command);
            }).to.not.throw();
        });

        it('fails without dispatcher', () => {
            expect(() => {
                let command = new Commands.NumberCommand([], { value: 10 });
                let process = new Process(null, command);
            }).to.throw();
        });

        it('fails without command', () => {
            expect(() => {
                let dispatcher = new Dispatcher(this);
                let process = new Process(dispatcher, null);
            }).to.throw();
        });
    });

    describe('run()', () => {
        it('passes when a process returns a result', ( done ) => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let commands = {
                start: new Commands.NumberCommand([], { value: 5 }),
                addition: new Commands.NumberCommand([], { value: 10 })
            };

            let inputs = [
                new Input(commands.start, {
                    name: 'start',
                    type: 'number',
                    lookup: 'value',
                    sanitize: false,
                }),
                new Input(commands.addition, {
                    name: 'addition',
                    type: 'number',
                    lookup: 'value',
                    sanitize: false,
                })
            ];

            let command = new Commands.AddCommand(inputs);
            let process = new Process(dispatcher, command);

            assert.isNull(process.getResults());

            process.run().then((results) => {
                expect(results).to.have.property('value');
            }).then(done).catch(e => console.log(e));
        });
    });

    describe('getDispatcher()', () => {
        it('passes when dispatcher is returned', () => {
            let dispatcher = new Dispatcher(this);
            let command = new Commands.NumberCommand();
            let process = new Process(dispatcher, command);

            assert.isObject(process.getDispatcher());
            assert.strictEqual(dispatcher, process.getDispatcher());
        });
    });

    describe('getCommand()', () => {
        it('passes when command is returned', () => {
            let dispatcher = new Dispatcher(this);
            let command = new Commands.NumberCommand();
            let process = new Process(dispatcher, command);

            assert.isObject(process.getCommand());
            assert.strictEqual(command, process.getCommand());
        });
    });

    describe('getResults()', () => {
        it('passes when a process returns a result', ( done ) => {
            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let commands = {
                start: new Commands.NumberCommand([], { value: 5 }),
                addition: new Commands.NumberCommand([], { value: 10 })
            };

            let inputs = [
                new Input(commands.start, {
                    name: 'start',
                    type: 'number',
                    lookup: 'value',
                    required: true,
                    sanitize: true,
                }),
                new Input(commands.addition, {
                    name: 'addition',
                    type: 'number',
                    lookup: 'value',
                    required: true,
                    sanitize: true,
                })
            ];

            let command = new Commands.AddCommand(inputs);
            let process = new Process(dispatcher, command);

            process.run().then((results) => {
                expect(results).to.be.an('object');
            }).then(done).catch(e => console.log(e));
        });

        it('passes when a process returns an empty result before running', () => {
            let dispatcher = new Dispatcher(this);

            let command = new Commands.AddCommand([]);
            let process = new Process(dispatcher, command);

            assert.isNull(process.getResults());
        });
    });
});
