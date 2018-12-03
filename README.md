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
    static describe() {
        return {
            key: 'send_email',
            name: 'Send an Email',
            description: 'Send a single email',
            inputs: {
                email: {
                    type: 'email',
                    required: true,
                    description: "The email address where the email is sent."
                },
                subject: {
                    type: 'string',
                    required: true,
                    description: "The subject of the email.",
                },
                content: {
                    type: 'string',
                    required: true,
                    description: "The content of the email.",
                },
                headers: {
                    type: 'array',
                    required: false,
                    description: "The headers to send with the email."
                }
            },
            outputs: {
                success: {
                    type: 'boolean',
                    description: 'Tells if the email was successfully sent off.'
                }
            },
        }
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
