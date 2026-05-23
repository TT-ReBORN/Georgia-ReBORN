/**
 * Object representing a timestamp marker or measurement entry in the player's performance timeline
 * @typedef {Object} PerformanceEntry
 * 
 * @property {string} entryType
 * A string representing the type of performance metric. Can be either "mark" or "measure".
 * @property {string} name
 * A string representing the name for a performance entry.
 * @property {number} startTime
 * Timestamp representing the starting time for the performance metric.
 * @property {number} duration
 * Value representing the duration of the performance entry (0.0 for "mark")
 * @property {Object} detail
 * Arbitrary metadata to include in the mark. Defaults to null. Can be an object of any type. 
 */

/**
 * List of performance observer entries<br>
 * Passed to {@link PerformanceObserver PerformanceObserver} {@link module:Callbacks.PerformanceObserverCallback callback}
 * @constructor
 * @hideconstructor
 */
function PerformanceObserverEntryList() {

     /**
     * Returns an array of all new {@link PerformanceEntry} entries' events recorded since last call of {@link module:Callbacks.PerformanceObserverCallback callback}.<br>
     * @return {Array<PerformanceEntry>}
     */
    this.getEntries = function () { };

    /**
     * Returns an array of all new {@link PerformanceEntry} entries' events recorded since last call of {@link module:Callbacks.PerformanceObserverCallback callback}.<br>
     * Returns array of entries filtered by type
     * @param {string} type A string representing the name of the measure.
     * @return {Array<PerformanceEntry>}
     */
    this.getEntriesByType = function (type) { };
    
    /**
     * Returns an array of all new {@link PerformanceEntry} entries' events recorded since last call of {@link module:Callbacks.PerformanceObserverCallback callback}.<br>
     * Returns array of entries filtered by name (and type (optional))
     * @param {string} name A string representing the name of the measure.
     * @param {string} [type=''] A string representing the name of the measure.
     * @return {Array<PerformanceEntry>}
     */
    this.getEntriesByName = function (name, type) { };
}

/**
 * Creates and returns a new {@link PerformanceObserver PerformanceObserver} object.<br>
 *
 * The observer {@link module:Callbacks.PerformanceObserverCallback callback} is invoked when performance entry events are recorded by {@link performance.mark performance.mark()} or {@link performance.measure performance.measure()} calls for the entry types that have been registered, via the {@link PerformanceObserver.observe observe()} method.<br>
 * @constructor
 * @param {function} callback
 */
function PerformanceObserver(callback) {
    /**
     * Returns an array of the {@link PerformanceEntry entryType} values supported by the user agent.
     * @type {Array<string>}
     * @readonly
     */
    this.supportedEntryTypes = ["mark", "measure"];
    
    /**
     * Specifies the set of entry types to observe.<br>
     * The performance observer's {@link module:Callbacks.PerformanceObserverCallback callback} function will be invoked when performance entry is recorded for one of the specified entryTypes.
     * @method
     * @param {Object} options An object with the following possible members:<br>
     * <b>entryTypes</b> - An array of strings, each specifying one performance entry type to observe. May not be used together with the `type`<br>
     * <b>type</b> - A single string specifying exactly one performance entry type to observe. May not be used together with the `entryTypes` option.
     * 
     * @example
     * function perfObserver(list, observer) {
     *   list.getEntries().forEach((entry) => {
     *     if (entry.entryType === "mark") {
     *       console.log(`${entry.name}'s startTime: ${entry.startTime}`);
     *     }
     *     if (entry.entryType === "measure") {
     *       console.log(`${entry.name}'s duration: ${entry.duration}`);
     *     }
     *   });
     * }
     * const observer = new PerformanceObserver(perfObserver);
     * observer.observe({ entryTypes: ["measure", "mark"] });
     */
    this.observe = function(options) {};

    /** Stops the performance observer callback from receiving performance entries.
     * @method
     */
    this.disconnect = function() {};

    /**
     * Returns the current list of performance entries stored in the performance observer, emptying it out.
     * @method
     * @return {Array<PerformanceEntry>}
     */
    this.takeRecords = function() {};
}

/** 
 * WebAPI-style benchmarking API<br>
 * For more information, see: {@link https://developer.mozilla.org/en-US/docs/Web/API/Performance_API}
 * @namespace performance
 */
let performance = {
    
    /**
     * Returns a high resolution timestamp in milliseconds with a fractional part. It represents the time elapsed since {@link performance.timeOrigin} (the time when script was loaded)<br>
     * Unlike Date.now, the timestamps returned by {@link performance.now performance.now()} are not limited to one-millisecond resolution. Instead, they represent times as floating-point numbers with up to microsecond precision.<br>
     * Also, Date.now() may have been impacted by system and user clock adjustments, clock skew, etc. as it is relative to the Unix epoch (1970-01-01T00:00:00Z) and dependent on the system clock.<br>
     * The performance.now() method on the other hand is relative to the {@link performance.timeOrigin timeOrigin} property which is a monotonic clock: its current time never decreases and isn't subject to adjustments.
     * @return {number}
     * @example
     * const t0 = performance.now();
     * doSomething();
     * const t1 = performance.now();
     * console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
     */
    now: function () { },

    /**
     * Creates a named {@link PerformanceEntry} object representing a high resolution timestamp marker in the player's performance timeline<br>
     *
     * @param {string} name A string representing the name of the mark.
     * @param {object} [markOptions=null] An object for specifying a timestamp and additional metadata for the mark.<br>
     * Consists of two optional properties:<br>
     * <b>detail</b>: Arbitrary metadata to include in the mark. Defaults to null. Can be an object of any type<br>
     * <b>startTime</b>: Value to use as the mark time. Defaults to {@link performance.now performance.now()}
     * @example
     * performance.mark('work-begin', { detail: { description: "Begin of some important work", id: 777 } });
     * doSomething();
     * performance.mark('work-end');
     * const measure = performance.measure('work-duration', 'work-begin', 'work-end');
     * const beginMark = performance.getEntriesByName('work-begin')[0];
     * console.log(`"${beginMark.detail.description}" started for id = ${beginMark.detail.id} executed in ${measure.duration} ms`);
     * performance.clearMarks();
     * performance.clearMeasures();
     */
    mark: function (name, markOptions) { },
    
    /**
     * Creates a named {@link PerformanceEntry} object representing a time measurement between two marks in the player's performance timeline.<br>
     * When measuring between two marks, there is a start mark and end mark, respectively. The named timestamp is referred to as a measure.<br>
     * If only <b>measureName</b> is specified, the start timestamp is set to zero, and the end timestamp (which is used to calculate the duration) is the value that would be returned by {@link performance.now performance.now()}
     * @param {string} measureName A string representing the name of the measure.
     * @param {string} [startMark=''] A string naming a {@link PerformanceEntry} with "mark" type in the performance timeline. The {@link PerformanceEntry.startTime} property of this mark will be used for calculating the measure.
     * @param {string} [endMark=''] A string naming a {@link PerformanceEntry} with "mark" type in the performance timeline. The {@link PerformanceEntry.startTime} property of this mark will be used for calculating the measure.
     * @param {object} [measureOptions=null] An object for specifying a timestamp and additional metadata for the mark.<br>
     * Consists of two optional properties:<br>
     * <b>detail</b>: Arbitrary metadata to include in the mark. Defaults to null. Can be an object of any type<br>
     * <b>start</b>: Value to use as the mark time. Defaults to {@link performance.now performance.now()}<br>
     * <b>duration</b>: Value to use as the mark time. Defaults to {@link performance.now performance.now()}<br>
     * <b>end</b>: Value to use as the mark time. Defaults to {@link performance.now performance.now()}<br>
     * @return {PerformanceEntry}
     */
    measure: function (measureName, startMark, endMark, measureOptions) { },
    
    /**
     * Returns an array of all {@link PerformanceEntry} objects currently present in the performance timeline.<br>
     * If you are only interested in performance entries of certain types ("mark" or "measure") or that have certain names, see {@link performance.getEntriesByType getEntriesByType} and {@link performance.getEntriesByName getEntriesByName}.
     * @return {Array<PerformanceEntry>}
     */
    getEntries: function () { },

    /**
     * Returns an array of {@link PerformanceEntry} objects currently present in the performance timeline for a given type ("mark" or "measure").<br>
     * If you are interested in performance entries of certain name, see {@link performance.getEntriesByName getEntriesByName}. For all performance entries, see {@link performance.getEntries getEntries}.
     * @param {string} type A string representing the name of the measure.
     * @return {Array<PerformanceEntry>}
     */
    getEntriesByType: function (type) { },
    
    /**
     * Returns an array of {@link PerformanceEntry} objects currently present in the performance timeline with the given name and type ("mark" or "measure").<br>
     * If you are interested in performance entries of certain types, see {@link performance.getEntriesByType getEntriesByType}. For all performance entries, see {@link performance.getEntries getEntries}.
     * @param {string} name A string representing the name of the measure.
     * @param {string} [type=''] A string representing the name of the measure.
     * @return {Array<PerformanceEntry>}
     */
    getEntriesByName: function (name, type) { },
    
    /**
     * Removes all or specific {@link PerformanceEntry} objects from the player's performance timeline.<br>
     * @param {string} [name=''] A string representing the name of the {@link PerformanceEntry} object. If this argument is omitted, all entries with an entryType of "mark" will be removed.
     */    
    clearMarks: function (name) { },
    
    /**
     * Removes all or specific {@link PerformanceEntry} objects from the player's performance timeline.<br>
     * @param {string} [name=''] A string representing the name of the {@link PerformanceEntry} object. If this argument is omitted, all entries with an entryType of "measure" will be removed.
     */    
    clearMeasures: function (name) { },
    
    /**
     * Returns string representation of {@link performance Performance} object.<br>
     * This gives you a list of all performance entries in a human-readable form.
     * @return {string}
     */    
    toString: function (measureName, startMark, endMark, measureOptions) { },

    /**
     * Creates and returns a new {@link PerformanceObserver PerformanceObserver} object.<br>
     *
     * The observer {@link module:Callbacks.PerformanceObserverCallback callback} is invoked when performance entry events are recorded by {@link performance.mark performance.mark()} or {@link performance.measure performance.measure()} calls for the entry types that have been registered, via the {@link PerformanceObserver.observe observe()} method.<br>
     * @param {function} callback
     * @return {PerformanceObserver}
     */
    Observer: function (callback) { },

    /**
     * Read-only property of the Performance interface returns the high resolution timestamp that is used as the baseline for performance-related timestamps.<br>
     * In JSplitter context this value represents the "UNIX-time" (milliseconds since 1 January 1970) when script was loaded.
     */
    timeOrigin: 0.0
};
