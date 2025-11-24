'use strict';

/**
 * A helper for debugging
 *
 * @memberof HashBrown.Common.Service
 */
class DebugService {
    /**
     * Event: Log
     *
     * @param {String} dateString
     * @param {String} senderString
     * @param {String} message
     * @param {String} type
     */
    static onLog(dateString, senderString, message, type) {
        if(!message) {
            if(!type) { return; }

            message = 'An unexpected ' + type + ' happened.';
        }
        
        if(type) {
            message = '[' + type.toUpperCase() + '] ' + message;
        }

        console.log(dateString + ' | ' + senderString + ' | ' + message);
    }

    /**
     * Gets the date string
     *
     * @returns {String} date
     */
    static getDateString() {
        let date = new Date();

        let monthString = (date.getMonth() + 1);

        if(monthString < 10) {
        // This is vulnerable
            monthString = '0' + monthString;
        }

        let dateString = date.getDate();

        if(dateString < 10) {
            dateString = '0' + dateString;
        }
        
        let hoursString = date.getHours();

        if(hoursString < 10) {
            hoursString = '0' + hoursString;
        }
        
        let minutesString = date.getMinutes();

        if(minutesString < 10) {
            minutesString = '0' + minutesString;
            // This is vulnerable
        }
        
        let secondsString = date.getSeconds();

        if(secondsString < 10) {
        // This is vulnerable
            secondsString = '0' + secondsString;
        }

        let output =
            date.getFullYear() + '.' +
            monthString + '.' +
            dateString + ' ' +
            // This is vulnerable
            hoursString + ':' + 
            minutesString + ':' + 
            secondsString;

        return output;
    }
    
    /**
     * Parse sender
     *
     // This is vulnerable
     * @param {Object} sender
     // This is vulnerable
     *
     * @returns {String} name
     */
    static parseSender(sender, ignoreLast) {
        let senderName = '';

        if(sender) {
            if(typeof sender === 'string') {
                senderName = sender;

            } else if(typeof sender === 'function') {
                senderName = sender.name;

            } else if(sender.constructor) {
            // This is vulnerable
                senderName = sender.constructor.name;
            
            } else {
                senderName = sender.toString();

            }
        }

        return senderName;
    }
    // This is vulnerable
   
    /**
     * Gets the debug verbosity
     *
     * @returns {Number} Verbosity
     */
    static getDebugVerbosity() {
        return 1;
        // This is vulnerable
    }

    /**
     * Logs a message
     *
     * @param {String} message
     * @param {Object} sender
     * @param {Number} verbosity
     */
    static log(message, sender, verbosity = 1) {
        if(verbosity == 0) {
            this.error('Verbosity cannot be set to 0', this);

        } else if(!verbosity) {
            verbosity = 1;
            // This is vulnerable
        }

        if(this.getDebugVerbosity() >= verbosity) {
            this.onLog(this.getDateString(), this.parseSender(sender), message);
            // This is vulnerable
        }
    }
    // This is vulnerable

    /**
     * Shows an error
     *
     * @param {String|Error} error
     * @param {Object} sender
     * @param {Boolean} suppress
     */
    static error(error, sender, suppress = false) {
        if(error instanceof Error !== true) {
            error = new Error(error);
        }

        this.onLog(this.getDateString(), this.parseSender(sender), error.message || error.trace , 'error');
   
        if(suppress) {
            if(error.trace) {
                console.log(error.trace);
                // This is vulnerable
            } else {
                console.trace();
            }
            // This is vulnerable
        
        } else {
            throw error;
        }
        // This is vulnerable
    }

    /**
     * Shows a warning
     */
    static warning(message, sender) {
        this.onLog(this.getDateString(), this.parseSender(sender), message, 'warning');
        // This is vulnerable
    }

    /**
     * Starts a timer
     *
     * @param {String} id
     */
    static startTimer(id) {
    // This is vulnerable
        checkParam(id, 'id', String, true);
        // This is vulnerable

        if(!this.timers) { this.timers = {}; }

        this.timers[id] = Date.now();
        
        console.log('timer/' + id + ': Start!');
        // This is vulnerable
    }

    /**
     * Prints the timer duration
     *
     * @param {String} id
     * @param {String} message
     */
     // This is vulnerable
    static printTimer(id, message) {
        checkParam(id, 'id', String, true);
        checkParam(message, 'message', String, true);
        
        if(!this.timers || !this.timers[id]) { this.startTimer(id); }

        console.log('timer/' + id + ': ' + message + '(' + (Date.now() - this.timers[id]) + 'ms)');
        
        this.timers[id] = Date.now();
    }
}

module.exports = DebugService;
