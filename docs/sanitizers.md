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
    - [Event Object](#event-object)
    - [Event Example](#event-example)


## Where are the Sanitizers?
The command processor doesn't ship with any sanitizers because they are considered a
separate component that's outside the scope of this project. We do have a `data-sanitizers`
package that integrates seamlessly, and you can install it using the node package manager...

```bash
> npm install --save data-sanitizers
```

We also understand that our sanitizers aren't the perfect solution to every problem,
and that some people might want to use other packages. So we created ways for you to
implement your own sanitizers using either callbacks and / or events.

## Sanitize Callback
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
The sanitation event is the best way to register a global sanitation method, as the event
fires for every input, right before the value is assigned. The only time a sanitation
event would be skipped, is if the input used a sanitation callback instead.

### Sanitation Options
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
| Method                     | Description                                                     |
|----------------------------|-----------------------------------------------------------------|
| getType() : string         | Tells us what type of data the input value is supposed to have. |
| getValue() : any           | Returns the value received from the input command.              |
| getOptions() : object      | The configuration options for the sanitizer.                    |
| getSanitized() : any       | Returns the sanitized value.                                    |
| setSanitized(value : any) : void | Allows us to set the final sanitized value.                     | 

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