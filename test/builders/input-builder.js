const { assert, expect } = require('chai');
const Commands = require('../helpers/commands');
const Dispatcher = require('../../src/dispatcher');
const Input = require('../../src/input');
const InputBuilder = require('../../src/builders/input-builder');

describe('Input Builder', () => {

    describe('fetch(input)', () => {
        it('passes when it returns a new input builder', () => {
            let builder1 = new InputBuilder('start');
            let builder2 = builder1.fetch('addition');

            assert.instanceOf(builder2, InputBuilder);
            assert.notEqual(builder1, builder2);
        });

        it('passes when builders can be nested', () => {
            let builder1 = new InputBuilder('start');
            let builder2 = builder1.fetch('addition');

            assert.lengthOf(builder1._inputs, 1);
            assert.strictEqual(builder1._inputs.pop(), builder2);
        });
    });

    describe('using(command)', () => {
        it('passes when it accepts a value and returns itself', () => {
            let builder = new InputBuilder('start');
            let result = builder.using(Commands.NumberCommand);

            assert.instanceOf(result, InputBuilder);
            assert.equal(builder, result);
            assert.equal(builder._command, Commands.NumberCommand);
        });
    });

    describe('with(options)', () => {
        it('passes when it accepts a value and returns itself', () => {
            let builder = new InputBuilder('start');
            let result = builder.with('options');

            assert.instanceOf(result, InputBuilder);
            assert.equal(builder, result);
            assert.equal(builder._options, 'options');
        });
    });

    describe('as(type)', () => {
        it('passes when it accepts a value and returns itself', () => {
            let builder = new InputBuilder('start');
            let result = builder.as('number');

            assert.instanceOf(result, InputBuilder);
            assert.equal(builder, result);
            assert.equal(builder._type, 'number');
        });
    });

    describe('from(output)', () => {
        it('passes when it accepts a value and returns itself', () => {
            let builder = new InputBuilder('start');
            let result = builder.from('value');

            assert.instanceOf(result, InputBuilder);
            assert.equal(builder, result);
            assert.equal(builder._lookup, 'value');
        });
    });

    describe('default(value)', () => {
        it('passes when it accepts a value and returns itself', () => {
            let builder = new InputBuilder('start');
            let result = builder.default('value');

            assert.instanceOf(result, InputBuilder);
            assert.equal(builder, result);
            assert.equal(builder._default, 'value');
        });
    });

    describe('required(option)', () => {
        it('passes when it accepts a value and returns itself', () => {
            let builder = new InputBuilder('start');
            let result = builder.required(true);

            assert.instanceOf(result, InputBuilder);
            assert.equal(builder, result);
            assert.isTrue(builder._required);
        });
    });

    describe('cleanWith(option)', () => {
        it('passes when it accepts a value and returns itself', () => {
            let builder = new InputBuilder('start');
            let result = builder.cleanWith('options');

            assert.instanceOf(result, InputBuilder);
            assert.equal(builder, result);
            assert.equal(builder._sanitize, 'options')
        });
    });

    describe('required(option)', () => {
        it('passes when it accepts a value and returns itself', () => {
            let builder = new InputBuilder('start');
            let result = builder.checkWith('options');

            assert.instanceOf(result, InputBuilder);
            assert.equal(builder, result);
            assert.equal(builder._validate, 'options')
        });
    });

    describe('build()', () => {
        it('passes when it returns an input', async () => {
            let input = new InputBuilder('start')
                .from('value')
                .as('number')
                .using(Commands.NumberCommand)
                .with({ value: 20 })
                .cleanWith({ decimals: 2 });

            let start = await input.build();

            assert.isObject(start);
            assert.instanceOf(start, Input);
        });

        it('passes when it executes nested inputs', async () => {
            let builder = new InputBuilder('value')
                .from('value')
                .as('number')
                .using(Commands.AddCommand)
                .fetch('start')
                    .from('value')
                    .as('number')
                    .using(Commands.NumberCommand)
                    .with({ value: 10 })
                .end()
                .fetch('addition')
                    .from('value')
                    .as('number')
                    .using(Commands.NumberCommand)
                    .with({ value: 5 })
                .end();

            let dispatcher = new Dispatcher(this);
            dispatcher.startProcessing();

            let input = await builder.build();
            let results = await input.getCommand().process(dispatcher);

            assert.isObject(results);
            assert.isDefined(results.value);
            assert.equal(results.value, 15);
        });
    });
});
