const { assert, expect } = require('chai');
const Commands = require('../helpers/commands');
const Process = require('../../src/process');
const Dispatcher = require('../../src/dispatcher');
const InputBuilder = require('../../src/builders/input-builder');
const ProcessBuilder = require('../../src/builders/process-builder');

describe('Process Builder', () => {

    describe('use(dispatcher)', () => {
        it('passes when it accepts a value and returns itself', () => {
            let builder = new ProcessBuilder(Commands.AddCommand);
            let result = builder.use('dispatcher');

            assert.instanceOf(result, ProcessBuilder);
            assert.equal(builder._dispatcher, 'dispatcher');
        });
    });

    describe('fetch(input)', () => {
        it('passes when it returns a new input builder', () => {
            let builder1 = new ProcessBuilder(Commands.AddCommand);
            let builder2 = builder1.fetch('addition');

            assert.instanceOf(builder2, InputBuilder);
            assert.notEqual(builder1, builder2);
        });

        it('passes when new inputs builders are nested', () => {
            let builder1 = new ProcessBuilder(Commands.AddCommand);
            let builder2 = builder1.fetch('addition');

            assert.lengthOf(builder1._inputs, 1);
            assert.strictEqual(builder1._inputs.pop(), builder2);
        });
    });

    describe('build()', () => {
        it('passes when it builds a process with two inputs', async () => {
            let builder = new ProcessBuilder(Commands.AddCommand);

            builder.use(new Dispatcher(this))
                .fetch('start')
                    .as('number')
                    .from('value')
                    .using(Commands.NumberCommand)
                    .with({ value: 5 })
                .end()
                .fetch('addition')
                    .as('number')
                    .from('value')
                    .using(Commands.NumberCommand)
                    .with({value: 10 })
                .end()
            .end();

            let process = await builder.build().catch((error) => {
                assert(false, error.message);
            });

            assert.instanceOf(process, Process);
            assert.lengthOf(process.getCommand()._inputs, 2);
        });
    });
});
