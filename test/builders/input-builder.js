const { assert, expect } = require('chai');
const Commands = require('../helpers/commands');
const Dispatcher = require('../../src/dispatcher');
const InputBuilder = require('../../src/builders/input-builder');

describe('Input Builder', () => {
    it('passes when it returns an input', async () => {
        let start = new InputBuilder('start')
            .from('value')
            .as('number')
            .using(Commands.NumberCommand)
            .with({ value: 20 })
            .cleanWith({ decimals: 2 });

        let addition = new InputBuilder('addition')
            .from('value')
            .as('number')
            .using(Commands.NumberCommand)
            .with({ value: 5 })
            .cleanWith({ decimals: 2 });

        let inputs = [
            await start.build(),
            await addition.build()
        ];

        let dispatcher = new Dispatcher(this);
        let command = new Commands.AddCommand(inputs);

        dispatcher.startProcessing();

        let results =  await command.process(dispatcher);

        assert.isObject(results);
        assert.hasAllKeys(results, ['value']);
        assert.equal(results.value, 25);
    });
});
