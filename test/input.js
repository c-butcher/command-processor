const { assert, expect } = require('chai');
const Input = require('../src/input');

describe('Input', function() {

    describe('constructor()', () => {
        it('passes when the required properties are given', () => {

        });

        it('fails when missing lookup option', () => {

        });

        it('fails when missing type option', () => {

        });

        it('fails when command does not have execute method', () => {

        });
    });

    describe('defaults()', () => {
        it('passes when an object is returned', () => {

        });
    });

    describe('getName()', () => {
        it('passes when it returns the supplied name', () => {

        });

        it('passes when no name results in null', () => {

        });
    });

    describe('getDescription()', () => {
        it('passes when it returns the supplied description', () => {

        });

        it('passes when no description results is null', () => {

        });
    });

    describe('getType()', () => {
        it('passes when it returns a string', () => {

        });
    });

    describe('getLookup()', () => {
        it('passes when it returns a string', () => {

        });
    });

    describe('getValue()', () => {
        it('passes when result is returned', () => {

        });

        it('passes when undefined is returned for no result', () => {

        });
    });

    describe('sanitize()', () => {
        it('passes when sanitation event is executed', () => {

        });

        it('passes when sanitize is a function', () => {

        });

        it('passes when sanitize is an options object', () => {

        });

        it('passes when it returns the sanitized value', () => {

        });
    });

    describe('validate()', () => {
        it('passes when validation event is executed', () => {

        });

        it('passes when validate is a function', () => {

        });

        it('passes when validate is an options object', () => {

        });

        it('passes when it returns the validation errors', () => {

        });
    });
});
