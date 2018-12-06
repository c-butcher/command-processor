const Validator = require('data-validators').Validator;
const Events = require('../events');

/**
 * @var {InputEvent} event
 */
Events.on(Events.INPUT_VALIDATED, /** @param {InputValidationEvent} event */ (event) => {
    let input = event.getInput();
    console.log("VALIDATING", input);

    let type = input.getType();
    if (Validator.has(type)) {
        Validator.check(value, type).forEach(event.addError);
    }
});
