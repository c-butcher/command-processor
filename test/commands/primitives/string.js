const { assert, expect } = require('chai');
const Dispatcher = require('../../../src/dispatcher');
const StringCommand = require('../../../src/commands/primitives/string');

describe('String Command', () => {
    describe('process(dispatcher)', () => {
        it ('passes when result is object.', async () => {
            let string = new StringCommand([], {
                value: 'Hello World'
            });

            let dispatcher = new Dispatcher(this).startProcessing();
            let results    = await string.process(dispatcher);

            assert.isObject(results);
            assert.hasAllKeys(results, ['value']);
            assert.isString(results.value);
            assert.equal(results.value, 'Hello World');
        });
    });

    describe('execute(dispatcher)', () => {
        it ('passes when result is object.', async () => {
            let string = new StringCommand([], {
                value: 'Hello World'
            });

            let dispatcher = new Dispatcher(this).startProcessing();
            let results    = await string.execute(dispatcher);

            assert.isObject(results);
            assert.hasAllKeys(results, ['value']);
            assert.isString(results.value);
            assert.equal(results.value, 'Hello World');
        });
    });
/*
    describe('execute(dispatcher)', () => {
        it ('fails when value is not a string.', async () => {
            let string = new StringCommand([], {
                value: 123
            });

            let dispatcher = new Dispatcher(this).startProcessing();
            let results = await string.execute(dispatcher);

            assert.isString(results.value);
        });
    });
*/
});