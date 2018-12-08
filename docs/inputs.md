[Home](../README.md) > Command Inputs

<hr>

# Command Inputs

### Options
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
