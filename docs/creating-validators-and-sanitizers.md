# Validators and Sanitizers

### Assigning your own method

### Adding your Sanitizers

```javascript
const Events = require('command-processor').Events;
const InputSanitationEvent = require('command-processor').InputSanitationEvent;

/**
 * @param {InputSanitationEvent} event
 */
function sanitizeNumber(event) {
    if (event.getType() !== 'number') {
        return event;
    }
    
    let value = parseFloat(event.getValue());
    
    event.setSanitized(value);
    
    return event;
}

Events.on(Events.INPUT_SANITIZED, sanitizeNumber);
```