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

1. Inputs
2. Options
3. Outputs

```javascript
const Command = require('command-processor').Command;

class FindByCommand extends Command {
    static describe() {
        return {
            key: 'find_by',
            name: 'Find By',
            description: 'Find a database model by specific keywords.',
            inputs: {
                keywords: {
                    type: 'object',
                    required: true,
                    description: "The search keywords."
                },
                scheme: {
                    type: 'string',
                    required: true,
                    description: "The search keywords."
                }
            },
            outputs: {
                models: {
                    type: 'array',
                    description: 'The database model(s) that were found.'
                }
            },
            options: {
                scheme: {
                    type: 'string',
                    required: true,
                    sanitize: true,
                    description: "The database scheme that will be looked in."
                }
            }
        }
    }
    
    execute(app) {
        if (!(app instanceof AppDispatcher)) {
            return null;
        }
        
        let keywords = this.inputs.get('keywords');
        let scheme   = this.options.get('scheme');
        
        let models = app.find(scheme)
                        .by(keywords);
        
        return {
            models
        };
    }
}

module.exports = FindByCommand;
```

### Why Describe?
You're probably wondering why our commands have so much code describing our commands. It's because
our commands are designed to be used by end-users.

### Default Values


### Input and Output Values


### Execution of the Command


### Accessing Data While Executing
Our system sanitizes and validates the inputs for you!
