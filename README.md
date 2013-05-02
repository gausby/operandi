# Operandi
Modus Operandi. A library for [Node](http://nodejs.org/) that ensure execution of a set of functions before calling an optional callback function. This is helpful when dealing with potential asynchronous functions (such as reading files over a network), and needing the results of this operation later down the line.

Chaining the flow of an application, written in JavaScript, with a project like Operandi removes a lot of code nesting, and the flow of the application is arguably easier to figure out for newcomers to the project.

It is designed to give the process back to the main node thread whenever it possibly can.

Other projects that does the same thing (and may suit your needs better) are:

  * [Async](https://github.com/caolan/async) by [Caolan](https://github.com/caolan/)
  * [Node-seq](https://github.com/substack/node-seq) by [Substrack](https://github.com/substack/)
  * [Node-series](https://github.com/BlueJeansAndRain/node-series) by [BlueJeansAndRain](https://github.com/BlueJeansAndRain/)


## List of Functions
These are the functions Operandi supports.


### Serial Operations
Will run the given functions in the order they are given and execute an optional callback function when done.


#### Serial
Will execute every function, one at a time, and run an optional callback function when done.

    // will run every function in the array `listOfFunctions`,
    // and execute `callback` when it is done.
    operandi.serial(listOfFunctions, callback);


#### Map Serial
Will execute a function on every element in the input list, one at a time, in the order they are given.

    // will run `fn` on every element in the array `listOfElements`,
    // and execute `callback` when it is done.
    operandi.mapSerial(listOfElements, fn, callback);


### Parralell Operations
Will run the given functions simultaneously and execute an optional callback function when done.


#### Parallel
Will execute every function, simultaneously, and run an optional callback function when done.

    // will run every function in the array `listOfFunctions`,
    // and execute `callback` when it is done.
    operandi.parallel(listOfFunctions, callback);


#### Map Parallel
Will execute a function on every element in the input list, simultaneously, and execute an optional callback function when done.

    // will run `fn` on every element in the array `listOfElements`,
    // and execute `callback` when it is done.
    operandi.mapParallel(listOfElements, fn, callback);


### Batching Operations
Functions given to a batch operation will be run in parallel in batches of a given size. This is required if you hit some upper limit, like opening more that 1000 files at a time on a UNIX system.

The system should ensure that no more than the given batch size will be run simultaneously.


#### Batch
Takes a list of functions and execute them, n functions at a time. When every function is done it will call an optional callback function.

    // will run every function in the array `listOfFunctions`, 2 at a time,
    // and execute `callback` when it is done.
    operandi.batch(listOfFunctions, 2, callback);


#### Map Batch
Takes a list of elements, a function to execute on every element and execute them, n elements at a time. An optinal callback function will be called when every element has been processed.

    // will pass every element in the array `listOfElements` to mapOperation,
    // 2 at a time, and execute `callback` when it is done.
    operandi.mapBatch(listOfElements, mapOperation, 2, callback);


### Execution context `this`
Every function supported by Operandi can easily be called with a different context, just use the standard JavaScript `.apply` and `.call` functions.

    // this within fn1, fn2, and fn3 will refer to the current context
    operandi.serial.call(this, [fn1, fn2, fn3], done);


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
