const Sanitizer = require('data-sanitizers').Sanitizer;
const Events = require('../events');

/**
 * @var {InputSanitationEvent} event
 */
Events.on(Events.INPUT_SANITIZED, /** @param {InputSanitationEvent} event */ (event) => {
    let options = event.getOptions();
    let type    = event.getType();
    let value   = event.getValue();

    if (Sanitizer.has(type)) {
        value = Sanitizer.clean(value, type, options);
    }

    event.setSanitized(value);
});
