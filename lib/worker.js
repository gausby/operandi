/* global module process */

/**
 * An empty function that does nothing, that will get used instead of
 * creating numerous empty anonymous functions, in situations where
 * an operation has no callback function.
 *
 * @method noop
 * @return {Undefined} nothing
 */
function noop () {
}

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
    scheduler: function (err) {
        var self = this;

        function reportBack(err){
            setImmediate(function() {
                self.running -= 1;
                self.scheduler.call(self, err);
            });
        }

        // start processes
        for (;(this.running < this.simultanious) && (this.steps > this.cursor); this.cursor += 1) {
            this.running += 1;
            this.list[this.cursor].call(this.scope, err, reportBack);
        }

        if (this.running === 0) {
            this.done();
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
        this.cb();

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

        this.simultanious = this.simultanious || this.steps;

        this.cb = cb || noop;
        this.scope = scope || {};

        this.scheduler();
    }
};
