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
 * A process scheduler that apply a function to a list of elements.
 *
 * @class eachWorker
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

        function reportBack(err, result){
			if (result !== undefined) {
				self.result[this.key] = result;
			}

            if (util.isError(err)) {
                self.simultaneous = 0;
                return self.done(err);
            }
            // simultaneous will be zero if a previous returned job
            // returned an error.
            else if (self.simultaneous) {
                setImmediate(function() {
                    self.running -= 1;
                    self.scheduler.call(self);
                });
            }

            return undefined;
        }

        // start processes
        if (typeof this.objectKeys === 'object') {
            for (;(this.running < this.simultaneous) && (this.steps > this.cursor); this.cursor += 1) {
                this.running += 1;
                this.fn.apply(this.scope, [this.list, this.objectKeys[this.cursor], reportBack.bind({
					key: this.objectKeys[this.cursor]
				})]);
            }
        }
        else {
            for (;(this.running < this.simultaneous) && (this.steps > this.cursor); this.cursor += 1) {
                this.running += 1;
                this.fn.apply(this.scope, [this.list, this.cursor, reportBack.bind({
					key: this.cursor
				})]);
            }
        }

        if (this.running === 0) {
            this.done();
        }
    },

    /**
     * Run the callback and clean up
     *
     * @method done
     * @return {Undefined}
     */
    done: function (err) {
        var prop;
        this.cb.call(this.scope, err, this.result);

        for (prop in this) {
            delete this[prop];
        }
    },

    /**
     * Initialize and start the scheduler
     *
     * @method init
     * @param {Object} list An array of elements
     * @param {Function} fn The function to apply to every list element
     * @param {Function} [cb=noop] Optional callback
     * @param {Object} [scope={}] Context to run the functions in
     * @return {Undefined}
     */
    init: function (list, fn, cb, scope) {
        this.list = list;
        this.fn = fn;

        if (Object.prototype.toString.call(list) === '[object Object]') {
            this.objectKeys = Object.keys(list);
            this.steps = this.objectKeys.length;
			this.result = {};
        }
        else {
            this.steps = list.length;
			this.result = [];
        }

        this.cursor = 0;
        this.running = 0;

        this.simultaneous = this.simultaneous || this.steps;

        this.cb = cb || noop;
        this.scope = scope || {};

        this.scheduler();
    }
};
