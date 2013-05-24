# ticket-sales

A proof of concept node.js server I put together to handle locking and claiming of seats at an event.

## Installation

Make sure you have node.js on your system of at least version 0.6.  If you're on a Mac 
and have Homebrew installed, just type `brew install node`.

Next, clone this project:

    git clone git@github.com:dmuth/ticket-sales.git

Install the NPM modules:

    npm install
    
Run the unit tests (if you like):

    npm test
    
Play around with the test script (if you like):

    ./test.sh
    
To start the server:

    node ./main.js
    
## Event data structure

This is a standard Javascript object:

    {
    name: "name of the event",
    _comment: "Comment for programmers inspecting this data structure",
    sections: { 
        orchestra: { // A sample section. We can have as many of these as we want.
            a: { // Row A. This can be an arbitrary string.
                "1": { // Our individual seat
                    status: "available" // By default the status is available.  Can also be "locked" and "sold"
                    expires: (integer) // When a locked seat expires. This is a time_t.
                }
            }
        }
    }


## HTTP API Endpoints

- `/` - Hello world!
- `/seat/check/:section/:row/:seat` - Check if a certain seat is available
- `/seat/lock/:section/:row/:seat` - Lock a certain seat
- `/seat/claim/:section/:row/:seat` - Claim a locked seat that has been sold externally
- `/seat/unlock/:section/:row/:seat` - Unlock a seat
- `/seat/num_available` - How many seats are available?

