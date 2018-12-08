const Sanitizer = require('data-sanitizers').Sanitizer;
const Events = require('../events');

((Events, Sanitizer) => {
    /**
     * Checks to see if we have a sanitizer for the input type, and if so
     * then we execute the sanitizer and return the sanitized value.
     *
     * @param {InputSanitationEvent} event
     */
    function sanitationEventHandler(event) {
        let type    = event.getType();
        let value   = event.getValue();
        let options = event.getOptions();

        if (Sanitizer.has(type)) {
            value = Sanitizer.clean(value, type, options);
        }

        event.setValue(value);
    }

    Events.on(Events.INPUT_SANITATION, sanitationEventHandler);
})(Events, Sanitizer);

