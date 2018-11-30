const chai = require('chai');
const Dispatcher = require('../src/dispatcher');

describe('Dispatcher', function() {

    describe('constructor()', function() {
        it('passes when dispatcher does not start traversing immediately', function() {
            let dispatcher = new Dispatcher();
            chai.assert.isFalse(dispatcher.isTraversing());
        });
    });

    describe('isTraversing()', function() {
        it('passes when the dispatcher is traversing', function() {
            let dispatcher = new Dispatcher();
            chai.assert.isFalse(dispatcher.isTraversing());

            dispatcher.startTraversing();
            chai.assert.isTrue(dispatcher.isTraversing());
        });

        it('fails when the dispatcher is not traversing', function() {
            let dispatcher = new Dispatcher();

            dispatcher.startTraversing();
            chai.assert.isTrue(dispatcher.isTraversing());

            dispatcher.stopTraversing();
            chai.assert.isFalse(dispatcher.isTraversing());
        });
    });
});
