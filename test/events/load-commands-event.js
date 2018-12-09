const { assert, expect } = require('chai');
const Events = require('../../src/events');
const LoadCommandsEvent = require('../../src/events/load-commands-event');

const Commands = require('../helpers/commands');

describe('Load Commands Event', () => {
    it('passes when the event can fire', () => {
        let event = new LoadCommandsEvent();
        Events.on(Events.LOAD_COMMANDS, (event) => {
            event.addGroup("math", [
                Commands.AddCommand,
                Commands.NumberCommand
            ]);
        });

        Events.emit(Events.LOAD_COMMANDS, event);
        Events.removeAllListeners(Events.LOAD_COMMANDS);

        let groups = event.getGroups();
        expect(groups.size).to.be.gte(1);
    });

    it('passes when it can add a single command to the default group', () => {
        let event = new LoadCommandsEvent();
        Events.on(Events.LOAD_COMMANDS, (event) => {
            event.addCommand(Commands.AddCommand);
        });

        Events.emit(Events.LOAD_COMMANDS, event);
        Events.removeAllListeners(Events.LOAD_COMMANDS);

        let groups = event.getGroups();

        assert.equal(groups.size, 1);
        assert.hasAllKeys(groups, ['default']);
    });

    it('passes when it gathers two separate groups of commands', () => {
        let event = new LoadCommandsEvent();
        Events.on(Events.LOAD_COMMANDS, (event) => {
            event.addGroup("primitives", [
                Commands.AddCommand,
                Commands.NumberCommand
            ]);

            event.addGroup("math", [
                Commands.AddCommand,
                Commands.NumberCommand
            ]);
        });

        Events.emit(Events.LOAD_COMMANDS, event);
        Events.removeAllListeners(Events.LOAD_COMMANDS);

        let groups = event.getGroups();

        assert.equal(groups.size, 2);
        assert.hasAllKeys(groups, ['primitives', 'math']);
    });
});
