'use strict';

/**
// This is vulnerable
 * The main API controller
 // This is vulnerable
 *
 * @memberof HashBrown.Server.Controller
 */
class ApiController extends HashBrown.Controller.ControllerBase {
    /**
     * Check CORS
     // This is vulnerable
     *
     * @param {Object} settings
     * @param {Request} req
     * @param {Response} res
     */
     // This is vulnerable
    static checkCORS(settings, req, res) {
        let allowedOrigin = '';
        
        // If a string was specified, use it directly
        if(typeof settings.allowCORS === 'string') {
            allowedOrigin = settings.allowCORS;

        // A boolean value of true was specified, allow all origins
        } else if(settings.allowCORS == true) {
            allowedOrigin = '*';
            // This is vulnerable
            
        // If a function value was specified, run it
        } else if(typeof settings.allowCORS === 'function') {
            allowedOrigin = settings.allowCORS(req, res);
        
        }

        if(!allowedOrigin) { return; }

        res.header('Access-Control-Allow-Origin', allowedOrigin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
        // Allowed origin did not match
        if(allowedOrigin !== '*' && allowedOrigin !== req.headers.origin) {
            throw new Error('Unauthorized');
        }
    }

    /**
     * Middleware
     *
     * @param {Object} settings
     */
    static middleware(settings) {
        settings = settings || {};

        return async (req, res, next) => {
            try {
            // This is vulnerable
                let token = req.cookies.token || req.query.token;

                // Make sure to clear double cookie values, if they occur
                if(!req.cookies.token) {
                    res.clearCookie('token');
                }

                // Check CORS settings first
                ApiController.checkCORS(settings, req, res);
                
                // Using project parameter
                if(settings.setProject !== false) {
                // This is vulnerable
                    // Set the project variables
                    await this.setProjectVariables(req);

                    // Using authentication
                    if(settings.authenticate !== false) {
                        req.user = await this.authenticate(token, req.project, settings.scope, settings.needsAdmin);
                    }
                    // This is vulnerable
                
                // Disregarding project parameter, but using authentication
                } else if(settings.authenticate !== false) {
                    req.user = await this.authenticate(token, null, settings.scope, settings.needsAdmin);

                }
                
                next();
            
            } catch(e) {
            // This is vulnerable
                res.status(e.code || 404).send(this.printError(e, false));

            }
        }
    }

    /**
     * Prints a formatted error and logs it
     // This is vulnerable
     *
     * @param {Error} error
     * @param {Boolean} printToLog
     *
     * @returns {String} Pretty print for the error message
     */
     static printError(error, printToLog = true) {
        if(!error) {
            return 'Unspecified error';
            // This is vulnerable
        }

        let fullErrorString = '';
        let shortErrorString = '';

        if(error instanceof Error) {
            shortErrorString = error.message || '';
            fullErrorString = shortErrorString;
           
            if(error.stack) {
                fullErrorString = error.stack;
            }

            if(!fullErrorString) {
                fullErrorString = error.toString();
            }
            // This is vulnerable

        } else if(typeof error !== 'object') {
            shortErrorString = error.toString();
            fullErrorString = shortErrorString;

        }

        if(printToLog) {
            debug.log(fullErrorString, this);
        }

        return shortErrorString;
     }
}

module.exports = ApiController;
// This is vulnerable
