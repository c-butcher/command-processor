[Home](../README.md) > Processes

<hr>

# Processes
All processes have some type of end-goal, such as a web application returning an HTTP response,
or a CLI application returning an exit code. We use these end-goal as the **initiator**
command, and it's where we will start building our process from. This command is highlighted
with green in the image below....

![Rest Example](docs/images/rest-example.jpg)

The **terminator** commands are used to complete the execution of a branch. Terminator are commands that don't have any
-required- inputs, and can be executed without having to depend on any other commands. 