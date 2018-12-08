# Input Sanitation
Sometimes our commands need to clean their inputs, like when a multiplication
command receives a string value of "20 Years" instead of a numeric value of 20.
Without sanitation our process would throw an error and stop working. So to make
sure that doesn't happen, we need to sanitize our data.

## Why No Sanitizers?
The command processor doesn't ship with sanitizers or validators because they are
separate components which are outside the scope of this project. It also seems
conceited to tell you which sanitizers to use, so instead we created ways for you
to implement your own sanitizers using either callbacks and/or events.

## Using the Sanitize Callback
One way to sanitize your data is to use the `sanitize` callback in the `Input` options.
Using callbacks will make it so the sanitation event doesn't fire for this input. The
callback is simple, and takes the original dirty value as an argument, and returns
the sanitized value.

```javascript
// Our age input is a number, that is coming from a string.
let age = new Input(new StringCommand(null, { text: '20 Years' }), {
    name: 'age',
    type: 'number',
    lookup: 'text',
    
    // Transforms our value to a floating point value
    sanitize: function(value) {
        return parseFloat(value);
    }
});
```

## Sanitation Event
The sanitation event is fired every time an input value is assigned, and right before the
value is assigned. So when you want to apply a sanitizer to all values for a specific type,
such as all the "number" inputs, then you would want to register a sanitation event.

### Input Sanitation Event
The `InputSanitationEvent` gives you access to the type, value and sanitation options for
the input.

| Method                     | Description                                                     |
|----------------------------|-----------------------------------------------------------------|
| getType() : string         | Tells us what type of data the input value is supposed to have. |
| getValue() : any           | Returns the value received from the input command.              |
| getOptions() : object      | The configuration options for the sanitizer.                    |
| getSanitized() : any       | Returns the sanitized value.                                    |
| setSanitized(value : any) : void | Allows us to set the final sanitized value.                     | 

### Sanitation Event Example
You can see an example of a number sanitizer below. The event fires every
time an input value is about to be assigned, and it only sanitizes the
values that have an input type of "number".

```javascript
const Events = require( 'command-processor' ).Events;

/**
 * Receives a value from the sanitation event and transforms
 * that value into a number.
 * 
 * @param {InputSanitationEvent} event
 */
function sanitizeNumber( event ) {
    if ( event.getType() !== 'number' ) {
        return event;
    }
    
    let value     = event.getValue();
    let options   = event.getOptions();
    let sanitized = parseFloat( value );
    
    if (options.decimals) {
        sanitized = sanitized.toFixed( options.decimals );
        sanitized = parseFloat( sanitized );
    }
    
    event.setSanitized( sanitized );
}

// Attach the sanitation listener
Events.on( Events.INPUT_SANITATION ,  sanitizeNumber );
```

Now lets say you have 10 different sanitation methods. You don't want to execute
ten sanitation methods every time an input is assigned. If your process has 100
inputs (which is easy to do) that would be 1,000 function calls, 900 of which we
didn't need.

So what you'll probably want is to create a single sanitation method that can
handle all the input types, like what we have with the
[data-sanitizers](../src/subscribers/sanitation.js) subscriber.