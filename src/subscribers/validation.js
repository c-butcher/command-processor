const Validator = require('data-validators').Validator;
const Events = require('../events');

/**
 * @var {InputEvent} event
 */
Events.on(Events.INPUT_VALIDATION, /** @param {InputValidationEvent} event */ (event) => {
    let type    = event.getType();
    let value   = event.getValue();
    let options = event.getOptions();

    if (Validator.has(type)) {
        Validator.check(value, type, options).forEach(event.addError);
    }
});
