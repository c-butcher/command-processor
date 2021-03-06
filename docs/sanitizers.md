[Home](../README.md) > Input Sanitation

<hr>

# Input Sanitation
Sometimes our commands need to clean their inputs, like when a multiplication
command receives a string value of "20 Years" instead of a numeric value of 20.
Without sanitation our process would throw an error and stop working. So to make
sure that doesn't happen, we need to sanitize our data.

- [Where are the Sanitizers?](#where-are-the-sanitizers)
- [Sanitize Callback](#sanitize-callback)
- [Sanitation Event](#sanitation-event)
    - [Sanitizer Options](#sanitation-options)
    - [Event Object](#event-object)
    - [Event Example](#event-example)


## Where are the Sanitizers?
The command processor doesn't ship with any sanitizers because they are considered a
separate component that's outside the scope of this project. We do have a `data-sanitizers`
package that integrates seamlessly, and it can be installed by using the following command...

```bash
> npm install --save data-sanitizers
```

We also know that our sanitizers aren't the best solution for everyone, and that's why we
made it easy to implement new sanitizers using either callbacks and / or events.

## Sanitize Callback
Callbacks are used for fringe cases, like converting an array of strings to an array of numbers.
You'll probably only use that sanitizer once, so it would be a waste to add it to the global
sanitation event.

The callback is simple, and takes the original dirty value as an argument, and returns
the sanitized value.

```javascript
// Our age input is a number, that is coming from a string.
let lengths = new Input(new ArrayCommand(null, { values: ['One', 'Two', 'Three'] }), {
    name: 'lengths',
    type: 'array',
    lookup: 'values',
    
    /**
     * Takes an array of strings and converts it to an array with the string lengths.
     * 
     * @param {string[]} strings
     * 
     * @returns {number[]}
     */
    sanitize: function( strings ) {
        let value = strings.reduce((accumulator, value) => {
            accumulator.push(value.length);
        }, []);
        
        return value;
    }
});
```

## Sanitation Event
The sanitation event is the best way to register a global sanitation method, as the event
fires for every input, right before the value is assigned. The only time a sanitation
event would be skipped, is if the input used a sanitation callback instead.

### Sanitizer Options
The event also passes sanitation options when an object is assigned to the `sanitize`
property on the Input object. This lets the sanitizers get fancy, and allows them to
customize the way the values look.

```javascript
let cost = new Input(new NumberCommand(null, { number: 1299.997 }), {
    name: 'cost',
    type: 'money',
    lookup: 'number',
    
    // These are the options to pass to our sanitation event
    sanitize: {
        prefix: '$',
        separator: ',',
        decimals: 2
    }
});
```

Now the sanitation method knows our "money" value should be prefixed with a US dollar
sign, separated by commas and have two decimal places. So the value of `1299.997`
gets transformed into `$1,299.99`.

### Event Object
| Method          | Returns | Description                                                     |
|-----------------|---------|-----------------------------------------------------------------|
| getType()       | string  | The type of data the input value is supposed to have.           |
| getOptions()    | object  | The configuration options for the sanitizer.                    |
| getValue()      | any     | Returns the value that was received from the input command.     |
| setValue(value) | any     | Sets the sanitized value.                                       | 

### Event Example
There is an example of a number sanitizer below. The event fires every
time an input value is about to be assigned, and this specific method
only sanitizes the values that are a "number" type.

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

The example above shows a single sanitation method, but in reality a project would have
ten or more methods. Instead of registering them all separately, which causes extra overhead,
register just one method that handles all the data-types. You can see an example in the way
we implemented the [data-sanitizers](../src/subscribers/sanitation.js) event listener.

<hr>

[Home](../README.md) > Input Sanitation