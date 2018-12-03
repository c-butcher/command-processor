const chai = require('chai');
const Dispatcher = require('../src/dispatcher');

describe('Dispatcher', function() {

    describe('constructor()', function() {
        it('passes when dispatcher is not processing', function() {
            let dispatcher = new Dispatcher(this);
            chai.assert.isFalse(dispatcher.isProcessing());
        });

        it('passes when dispatcher is not stateful', function() {
            let dispatcher = new Dispatcher(this);
            chai.assert.isFalse(dispatcher.isStateful());
        });

        it('throws error without options', async () => {
            chai.expect(() => {
                let dispatcher = new Dispatcher(null);
                chai.assert.isFalse(dispatcher.isStateful());
            }).to.throw();
        });
    });

    describe('isProcessing()', function() {
        it('passes when the dispatcher is processing', function() {
            let dispatcher = new Dispatcher(this);
            chai.assert.isFalse(dispatcher.isProcessing());

            dispatcher.startProcessing();
            chai.assert.isTrue(dispatcher.isProcessing());
        });

        it('fails when the dispatcher is not processing', function() {
            let dispatcher = new Dispatcher(this);

            dispatcher.startProcessing();
            chai.assert.isTrue(dispatcher.isProcessing());

            dispatcher.stopProcessing();
            chai.assert.isFalse(dispatcher.isProcessing());
        });
    });

    describe('isStateful()', function() {
        it('passes when the dispatcher is stateful', function() {
            let dispatcher = new Dispatcher(this, { stateful: true });
            chai.assert.isTrue(dispatcher.isStateful());

        });

        it('fails when the dispatcher is not stateful', function() {
            let dispatcher = new Dispatcher(this);
            chai.assert.isFalse(dispatcher.isStateful());
        });
    });

    describe('setStateful()', function() {
        it('passes when you can change the state', function() {
            let dispatcher = new Dispatcher(this);
            chai.assert.isFalse(dispatcher.isStateful());

            dispatcher.setStateful(true);
            chai.assert.isTrue(dispatcher.isStateful());

        });
    });

    describe('reset()', function() {
        it('passes when options get reset to original options.', function() {
            // Starts as stateless and not processing
            let dispatcher = new Dispatcher(this);
            chai.assert.isFalse(dispatcher.isStateful());
            chai.assert.isFalse(dispatcher.isProcessing());

            // Sets the dispatcher to stateful and processing
            dispatcher.setStateful(true).startProcessing();
            chai.assert.isTrue(dispatcher.isStateful());
            chai.assert.isTrue(dispatcher.isProcessing());

            // Reset the dispatcher back to the original options
            dispatcher.reset();
            chai.assert.isFalse(dispatcher.isStateful());
            chai.assert.isFalse(dispatcher.isProcessing());
        });
    })
});
