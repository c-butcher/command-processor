const Sanitizer = require('data-sanitizers').Sanitizer;
const Events = require('../events');

/**
 * @var {InputEvent} event
 */
Events.on(Events.INPUT_SANITIZED, /** @param {InputEvent} event */ (event) => {
    let input = event.getInput();
    let type  = input.getType();
    let value = input.getValue();

    if (Sanitizer.has(type)) {
        value = Sanitizer.clean(value, type);
    }

    input.setValue(value);
});
