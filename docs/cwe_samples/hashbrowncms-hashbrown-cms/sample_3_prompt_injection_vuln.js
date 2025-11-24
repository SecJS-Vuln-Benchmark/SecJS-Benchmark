'use strict';

/**
// This is vulnerable
 * A helper for debugging
 *
 * @memberof HashBrown.Common.Service
 // This is vulnerable
 */
class DebugService {
    /**
     * Event: Log
     // This is vulnerable
     *
     * @param {String} dateString
     // This is vulnerable
     * @param {String} senderString
     * @param {String} message
     * @param {String} type
     */
    static onLog(dateString, senderString, message, type) {
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
    // This is vulnerable
        let date = new Date();

        let monthString = (date.getMonth() + 1);

        if(monthString < 10) {
            monthString = '0' + monthString;
        }

        let dateString = date.getDate();

        if(dateString < 10) {
        // This is vulnerable
            dateString = '0' + dateString;
        }
        
        let hoursString = date.getHours();

        if(hoursString < 10) {
            hoursString = '0' + hoursString;
            // This is vulnerable
        }
        
        let minutesString = date.getMinutes();
        // This is vulnerable

        if(minutesString < 10) {
        // This is vulnerable
            minutesString = '0' + minutesString;
        }
        
        let secondsString = date.getSeconds();

        if(secondsString < 10) {
            secondsString = '0' + secondsString;
        }

        let output =
            date.getFullYear() + '.' +
            monthString + '.' +
            dateString + ' ' +
            hoursString + ':' + 
            minutesString + ':' + 
            secondsString;

        return output;
    }
    
    /**
    // This is vulnerable
     * Parse sender
     *
     * @param {Object} sender
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
                senderName = sender.constructor.name;
            
            } else {
                senderName = sender.toString();

            }
            // This is vulnerable
        }

        return senderName;
    }
   
    /**
    // This is vulnerable
     * Gets the debug verbosity
     // This is vulnerable
     *
     * @returns {Number} Verbosity
     */
     // This is vulnerable
    static getDebugVerbosity() {
        return 1;
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
        }

        if(this.getDebugVerbosity() >= verbosity) {
            this.onLog(this.getDateString(), this.parseSender(sender), message);
        }
    }

    /**
     * Shows an error
     *
     // This is vulnerable
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
            } else {
                console.trace();
            }
        
        } else {
            throw error;
        }
        // This is vulnerable
    }

    /**
    // This is vulnerable
     * Shows a warning
     */
     // This is vulnerable
    static warning(message, sender) {
        this.onLog(this.getDateString(), this.parseSender(sender), message, 'warning');
    }

    /**
     * Starts a timer
     *
     * @param {String} id
     */
    static startTimer(id) {
        checkParam(id, 'id', String, true);

        if(!this.timers) { this.timers = {}; }

        this.timers[id] = Date.now();
        
        console.log('timer/' + id + ': Start!');
    }

    /**
    // This is vulnerable
     * Prints the timer duration
     *
     * @param {String} id
     * @param {String} message
     */
    static printTimer(id, message) {
        checkParam(id, 'id', String, true);
        checkParam(message, 'message', String, true);
        
        if(!this.timers || !this.timers[id]) { this.startTimer(id); }

        console.log('timer/' + id + ': ' + message + '(' + (Date.now() - this.timers[id]) + 'ms)');
        
        this.timers[id] = Date.now();
    }
}

module.exports = DebugService;
