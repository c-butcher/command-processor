# Command Processor

[![Build Status](https://travis-ci.com/c-butcher/command-processor.svg?branch=master)](https://travis-ci.com/c-butcher/command-processor)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://travis-ci.com/c-butcher/command-processor)

### Installation

```bash
> npm install --save command-processor
```

### Building a Command
You can see an example of a command below. Don't be worried about the size of the command,
over 80% of the code is for describing the command to others, and in a few minutes you'll
completely understand every part about how the command object works.

```javascript
const Command = require('command-processor').Command;

class SendEmail extends Command {
    constructor(inputs = {}) {
        super(
            'send_email',
            "Send Email",
            "Send a single email to a specific person.",
            inputs
        );
    }
    
    defaults() {
        return {
            email: [],
            subject: null,
            content: null,
            headers: [
                'MIME-Version: 1.0',
                'Content-Type: text-html'
            ]
        }
    }
    
    inputs() {
        return {
            email: {
                name: 'email',
                label: 'Email',
                type: 'string',
                description: 'Email address of person you want to send an email to.',
                required: true,
            },
            subject: {
                name: 'subject',
                label: 'Subject',
                type: 'string',
                description: 'Subject of the email being sent.',
                required: true,
            },
            content: {
                name: 'content',
                label: 'Content',
                type: 'string',
                description: 'The contents of the email.',
                required: true,
            },
            headers: {
                name: 'headers',
                label: 'Content',
                type: 'array',
                description: 'List of all the headers that will be sent with the email.',
                required: false,
            }
        };
    }
    
    outputs() {
        return {
            success: {
                name: 'success',
                label: 'Success',
                type: 'boolean',
                description: 'Tells whether the email was successfully sent.',
            }
        };
    }
    
    execute(mailer) {
        if (!(mailer instanceof EmailDispatcher)) {
            return null;
        }
        
        let success = mailer.send(
            this.inputs.get('email'),
            this.inputs.get('subject'),
            this.inputs.get('content'),
            this.inputs.get('headers')
        );
        
        return {
            success: success
        }
    }
}

module.exports = SendEmail;
```

### Why Describe?
You're probably wondering why our commands have so much code describing our commands. It's because
our commands are designed to be used by end-users.

### Default Values


### Input and Output Values


### Execution of the Command


### Accessing Data While Executing
Our system sanitizes and validates the inputs for you!
