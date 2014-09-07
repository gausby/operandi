/*global module process setImmediate */
var util = require('util');

/**
 * An empty function that does nothing, that will get used instead of
 * creating numerous empty anonymous functions, in situations where
 * an operation has no callback function.
 *
 * @method noop
 * @return {Undefined} nothing
 */
function noop () {}


/**
 * A process scheduler that runs a list of functions.
 *
 * @class Worker
 */
module.exports = {
    /**
     * Start tasks in the operation. Throttle the number of simultaneously
     * running tasks so they do not exceed the given limit, and call the
     * callback function when everything has been processed.
     *
     * @method scheduler
     * @return {Undefined}
     */
    scheduler: function () {
        var self = this;

        function reportBack(err){
			var args = arguments;

            if (util.isError(err)) {
                self.simultaneous = 0;
                return self.done(err);
            }
            // simultaneous will be zero if a previous returned job
            // returned an error.
            else if (self.simultaneous) {
                setImmediate(function() {
                    self.running -= 1;
					// if we are running in series pass on the result
					// from the previous operation to the next in line
					if (self.simultaneous === 1) {
						self.scheduler.apply(self, args);
					}
					else {
						self.scheduler.call(self);
					}
                });
            }

            return undefined;
        }

        // start processes
		var args = Array.prototype.slice.call(arguments, 1).concat(reportBack);
        for (;(this.running < this.simultaneous) && (this.steps > this.cursor); this.cursor += 1) {
            this.running += 1;
            this.list[this.cursor].apply(this.scope, args);
        }

        if (this.running === 0) {
			if (this.simultaneous === 1) {
				this.done.apply(this, arguments);
			}
			else {
				this.done();
			}
        }
    },

    /**
     * Run the given callback and clean up
     *
     * @method done
     * @return {Undefined}
     */
    done: function () {
        var prop;
        this.cb.apply(this.scope, arguments);

        for (prop in this) {
            delete this[prop];
        }
    },

    /**
     * Initialize and start the scheduler
     *
     * @method init
     * @param {Object} fns A list of functions
     * @param {Function} [cb=noop] Callback to execute when done
     * @param {Object} [scope={}] Context to execute the functions in
     * @return {Undefined}
     */
    init: function (fns, cb, scope) {
        this.list = fns;
        this.steps = fns.length;
        this.cursor = 0;
        this.running = 0;

        this.simultaneous = this.simultaneous || this.steps;

        this.cb = cb || noop;
        this.scope = scope || {};

        this.scheduler();
    }
};
