const Validator = require('data-validators').Validator;
const Events = require('../events');

((Events, Validator) => {
    /**
     * Check to see if we have a validator to handle the input type, and if so
     * then we execute the validation check and add any errors to our event.
     *
     * @param {InputValidationEvent} event
     */
    function validationEventHandler(event) {
        let type = event.getType();

        if (Validator.has(type)) {
            let value   = event.getValue();
            let options = event.getOptions();
            let errors  = Validator.check(value, type, options);

            if (errors.length > 0) {
                errors.forEach(event.addError)
            }
        }
    }

    Events.on(Events.INPUT_VALIDATION, validationEventHandler);
})(Events, Validator);

