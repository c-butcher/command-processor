const Sanitizer = require('data-sanitizers').Sanitizer;
const Events = require('../events');

/**
 * @var {CommandInputEvent} event
 */
Events.on(Events.INPUT_SANITIZED, /** @param {CommandInputEvent} event */ (event) => {
    let input = event.getCommandInput();
    console.log("SANITISING", input);

    let type  = input.getType();
    let value = input.getValue();

    if (Sanitizer.has(type)) {
        value = Sanitizer.clean(value, type);
    }

    input.setValue(value);
});
