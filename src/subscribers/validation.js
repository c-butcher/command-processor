const Validator = require('data-validators').Validator;
const Events = require('../events');

/**
 * @var {CommandInputEvent} event
 */
Events.on(Events.INPUT_VALIDATED, /** @param {CommandInputValidationEvent} event */ (event) => {
    let input = event.getCommandInput();
    console.log("VALIDATING", input);

    let type = input.getType();
    if (Validator.has(type)) {
        Validator.check(value, type).forEach(event.addError);
    }
});
