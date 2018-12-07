# Command Processor

[![Build Status](https://travis-ci.com/c-butcher/command-processor.svg?branch=master)](https://travis-ci.com/c-butcher/command-processor)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://travis-ci.com/c-butcher/command-processor)

### Installation

```bash
> npm install --save command-processor
```
### Definitions
| Word       | Definition |
|------------|------------|
| Process    | A group of commands working together towards a purpose.|
| Command    | Single unit-of-work that accepts inputs and returns outputs. |
| Input      | An input is a command that when executed returns the input values that are used in another command. |
| Dispatcher | A container for all the application level services like databases, template, mailers, etc. |
| Processing | The execution and transfer of data from one command to the next |

#### Initiator vs Terminator
Every process has an "end goal", like how web applications send  HTTP responses,
and CLI's return an exit code. Even image matching applications would return classifiers
and probabilities.

So our processes will always start with a single command, and that will always be the final
command that's executed in the process. We call this the "Initiator" command, because it is 
the point that we start building from. You can see it highlighted in green below.

![Rest Example](docs/images/rest-example.jpg)

Terminator commands have no inputs, which means that we've reached the end to one of the chains in the process.
The Initiator command is the final goal

### Input

| Option      | Required | Default  |Type               | Description |
|-------------|:--------:|----------|-------------------|------------------------------------------------------------------------|
| key         | No       | null     | string            | The computer readable name with only letters, numbers and underscores. |
| name        | Yes      | null     | string            | The human-readable name of the command.                                |
| type        | Yes      | 'string' | string            | The type of data that will be stored in this input.                    |
| lookup      | Yes      | null     | string            | The name of the output which is coming from the input command.         |
| description | No       | null     | string            | Tells the end-user what the command does.                              |
| command     | Yes      | null     | Command           | The command that will return our input value.                          |
| required    | No       | false    | boolean           | Tells whether this input is required.                                  |
| sanitize    | No       | null     | function / object | Contains a sanitation function, or an object with sanitation options.  |
| validate    | No       | null     | function / object | Contains a validation function, or an object with validation options.  |


### Building a Command
You can see an example of a command below. Don't be worried about the size of the command,
over 80% of the code is for describing the command to others, and in a few minutes you'll
completely understand every part about how the command object works.

1. Inputs (Arguments)
2. Options (Config Values)
3. Outputs (Return Values)

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

### Validation and Sanitation
The command processor does not have any validation or sanitation built-in directly, but we do have
events for handling both of these issues. The easiest solution would be to install the [data-sanitizers](https://github.com/c-butcher/data-sanitizers)
and/or [data-validators](https://github.com/c-butcher/data-validators) packages.

```bash
> npm install --save data-sanitizers
> npm install --save data-validators
```

Our command processor will detect the packages above and start using them immediately without having
to do any configuration.


There will be times when our sanitation/validation packages might not be right for you, in which case
you can [create your own custom validators and sanitizers](docs/creating-validators-and-sanitizers.md).

### Input and Output Values


### Execution of the Command


### Accessing Data While Executing
Our system sanitizes and validates the inputs for you!
