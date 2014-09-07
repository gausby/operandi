# Operandi
Modus Operandi. A library for [Node](http://nodejs.org/) that ensure execution of a set of functions before calling an optional callback function. This is helpful when dealing with potential asynchronous functions (such as reading files over a network), and needing the results of this operation later down the line.

Chaining the flow of an application, written in JavaScript, with a project like Operandi removes a lot of code nesting, and the flow of the application is arguably easier to figure out for newcomers to the project.

It is designed to give the process back to the main node thread whenever it possibly can.

Other projects that does the same thing (and may suit your needs better) are:

  * [Async](https://github.com/caolan/async) by [Caolan](https://github.com/caolan/)
  * [Node-seq](https://github.com/substack/node-seq) by [Substack](https://github.com/substack/)
  * [Node-series](https://github.com/BlueJeansAndRain/node-series) by [BlueJeansAndRain](https://github.com/BlueJeansAndRain/)


## Supported Functions
Operandi in it current state supports two types of functions; control flow and a type that iterate a list and apply a function to each of the elements.


### Control flow functions
There are three types of control flow functions. `serial`, `parallel`, and `batch`.


#### `serial`
Will execute every function, one at a time, and run an optional callback function when done.

    var serial = require('operandi').serial;

    // Every functions shall receive one argument; `done`.
    // When a function is done it shall report back to the scheduler
    // by calling done.
    var listOfFunctions = [
        function (done) {
            // get data from file-system
            done();
        },
        function (done) {
            // run data through parser
            done();
        }
        // ...
    ];

    // will run every function in the array `listOfFunctions`,
    // and execute the optional `callback` when all the tasks are
    // done.
    serial(listOfFunctions, function() {
        console.log('done');
    });

It is also possible to pass on arguments to the next function by giving them to the callback function.

```js
var serial = operandi.serial;
serial([
    function(done) {
        done(undefined, 'bar');
    },
    function(foo, done) {
        console.log(foo); // 'bar'
        done();
    }
], done);
```

The first argument given to the callback should be an error object, or `undefined` if nothing went wrong. The last function in line will send its result to the main callback function.

Use this when you need the tasks performed in precisely the order they are given.


#### `parallel`
Will execute every function, simultaneously, and run an optional callback function when done.

    var parallel = require('operandi').parallel;

    // Every functions shall receive one argument; `done`.
    // When a function is done it shall report back to the scheduler
    // by calling `done`.
    var listOfFunctions = [
        function (done) {
            // load data from network
            done();
        },
        function (done) {
            // load data from file-system
            done();
        },
        function (done) {
            // perform some other asynchronous task
            done();
        }
        // ...
    ];

    // will run every function in the array `listOfFunctions`,
    // and execute the optional `callback` when all the tasks are
    // done.
    parallel(listOfFunctions, function() {
        console.log('done');
    });

Use this if you don't need the functions to be executed in a specific order.


#### `batch`
Takes a list of functions and execute them, n functions at a time. When every function is done it will call an optional callback function. The `batch`-function is very similar to the `parallel`-function, but it will throttle the simultaneous running functions.

    // Every functions shall receive one argument; `done`.
    // When a function is done it shall report back to the scheduler
    // by calling `done`.
    var listOfFunctions = [
        function (done) {
            // get a JSON-feed via HTTP
            done();
        },
        function (done) {
            // get user data from database
            done();
        },
        function (done) {
            // get high scores
            done();
        }
        // ...
    ]

    // will run every function in the array `listOfFunctions`, 2 at a
    // time, and execute the optional `callback` when all the tasks
    // are done.
    operandi.batch(listOfFunctions, 2, function() {
        console.log('done');
    });

Use this when you deal with something asynchronous that has an upper limit, like opening a massive amount of files, in situations where the tasks are unrelated and can be performed in parallel.


### Each functions
Will iterate a list, or an object with key-values, of items and execute a function on each of the items. They come in three varieties: `eachSerial`, `eachParallel`, and `eachBatch`.


#### `eachSerial`
Will execute a function on every element in the input list, one at a time, in the order they are given.

    var eachSerial = require('eachSerial');
    var arr = [1, 2, 3, 4, 5, 6];
    var obj = [];

    function square(numbers, key, done) {
        // setImmediate to simulate something async
        setImmediate(function() {
            obj.push(numbers[key] * numbers[key]);
            done();
        });
    }

    // will run `fn` on every element in the array `listOfElements`,
    // and execute `callback` when it is done.
    eachSerial(arr, square, function () {
        console.log(obj); // [1, 4, 9, 16, 25, 36]
        done();
    });

Use this when you need the list processed in precisely the order it is written.


#### `eachParallel`
Will execute a function on every element in the input list, simultaneously, and execute an optional callback function when done.

    var eachParallel = require('operandi').eachParallel;
    var arr = [1, 2, 3, 4, 5, 6];
    var obj = [];

    function pushToObjAfterRandomTimeout(numbers, current, done) {
        setTimeout(function() {
            obj.push(numbers[current]);
            done();
        }, 10 * Math.random());
    }

    // will run `fn` on every element in the array `listOfElements`,
    // and execute `callback` when it is done.
    eachParallel(arr, pushToObjAfterRandomTimeout, function () {
        console.log(obj); // something like [2, 4, 3, 5, 1, 6]
        done();
    });

Use this if you don't need the list to be processed in a specific order.


#### `eachBatch`
Takes a list of elements, a function to execute on every element and execute them, n elements at a time. An optional callback function will be called when every element has been processed.

    var eachBatch = require('operandi').eachBatch;
    var arr = [1, 2, 3, 4, 5, 6];
    var obj = [];

    function pushToObjAfterRandomTimeout(numbers, current, done) {
        setTimeout(function() {
            obj.push(numbers[current]);
            done();
        }, 10 * Math.random());
    }

    eachBatch(arr, pushToObjAfterRandomTimeout, 2, function () {
        console.log(obj); // something like: [ 2, 1, 4, 3, 5, 6 ]
        done();
    });

Use this when you apply a function with something asynchronous that has an upper limit, like opening a massive amount of files, in situations where the execution order are non-essential, and can be performed in parallel.


### Execution context `this`
Every function supported by Operandi can easily be called with a different context, just use the standard JavaScript `.apply` and `.call` functions.

    // this within fn1, fn2, and fn3 will refer to the current context
    operandi.serial.call(this, [fn1, fn2, fn3], done);

The callback function will also be called in the same scope.


### The `done`-function and error handling
When a step in a process is finished it have to report back to the scheduler by calling `done()`. This will start the next process in line or call the callback function when every process has been run.

If you pass an argument to this function it will stop the entire process and call the given callback function with the error object as the first parameter. Examine the following example.

    var serial = operandi.serial;

    var process = [
        function (done) {
            done(new Error('The database broke!'));
        },
        function (done) {
            console.log('this will never be run.');
            done();
        }
    ];

    serial(process, function(err) {
        if (err) {
            try {
                throw err;
            }
            catch (e) {
                console.log(e.stack); // stack trace
            }
        }
    });

This works for the parallel operations as well, but processes that has been started will still have to finish. No new processes will be started though.

If you nest Operandi-functions, and use the parent `done` function as the call back of the child, the error will progress upwards, stopping all the parent-operations, and making it possible to handle errors in the topmost call—and you can even use third-party error handler modules, if you are so inclined.


## Development
After cloning the project you will have to run `npm install` in the project root. This will install the various grunt plugins and other dependencies.


### QA tools
The QA tools rely on the [Grunt](http://gruntjs.com) task runner. To run any of these tools, you will need the grunt-cli installed globally on your system. This is easily done by typing the following in a terminal.

    $ npm install grunt-cli -g

The unit tests will need the [Buster](http://busterjs.org/) unit test framework.

    $ npm install -g buster

These two commands will install the buster and grunt commands on your system. These can be removed by typing `npm uninstall buster -g` and `npm uninstall grunt-cli -g`.


### Unit Tests
If you haven't all ready install the Grunt CLI tools and have a look at the grunt configuration file in the root of the project.

When developing you want to run the script watcher. Navigate to the project root and type the following in your terminal.

    $ grunt watch:scripts

This will run the jshint and tests each time a file has been modified.


#### Benchmarks
You can run the benchmarks by running `grunt benchmark`. This will output some simple benchmarks to `*project-root*/benchmark`.

Notice, these benchmarks are only usable if they are run on the same computer, because it measures the time a task takes. The parameters that could influence this vary from system to system. That said, if you run benchmarks once in a while, while trying to optimize the speed of the library, it should give you some insights. Some insights are better than none.


### Documentation
The project uses YUIDocs that can be generated by running `grunt yuidoc`. This will create a site with documentation in a folder called `docs/` in the project root which can be served on port 8888 by typing `grunt connect:docs`. If you want to generate docs on file modification you can run `grunt watch:docs`.


## License
The MIT License (MIT)

Copyright (c) 2013 Martin Gausby

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
