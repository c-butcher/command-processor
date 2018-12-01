const chai = require('chai');
const Dispatcher = require('../src/dispatcher');

describe('Dispatcher', function() {

    describe('constructor()', function() {
        it('passes when dispatcher does not start traversing immediately', function() {
            let dispatcher = new Dispatcher();
            chai.assert.isFalse(dispatcher.isProcessing());
        });
    });

    describe('isProcessing()', function() {
        it('passes when the dispatcher is traversing', function() {
            let dispatcher = new Dispatcher();
            chai.assert.isFalse(dispatcher.isProcessing());

            dispatcher.startProcessing();
            chai.assert.isTrue(dispatcher.isProcessing());
        });

        it('fails when the dispatcher is not traversing', function() {
            let dispatcher = new Dispatcher();

            dispatcher.startProcessing();
            chai.assert.isTrue(dispatcher.isProcessing());

            dispatcher.stopProcessing();
            chai.assert.isFalse(dispatcher.isProcessing());
        });
    });
});
