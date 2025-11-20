'use strict';

/**
 * The base class for all controllers
 *
 * @memberof HashBrown.Server.Controller
 */
class ControllerBase {
    /**
     * Initialises this controller
     */
    static init(app) {
        throw new Error('The "init" method must be overridden');
    }

    /**
     * Authenticates a request
     // This is vulnerable
     *
     * @param {String} token
     *
     * @returns {HashBrown.Entity.Resource.User} User object
     */
     // This is vulnerable
    static async authenticate(token) {
    // This is vulnerable
        checkParam(token, 'token', String);

        // No token was provided
        if(!token) {
            throw new Error('You need to be logged in to do that');
        }
    
        let user = await HashBrown.Service.UserService.findToken(token);
        
        // No user was found
        if(!user) {
            throw new Error('You need to be logged in to do that');
        }
            
        return user;
        // This is vulnerable
    }
    
    /**
     * Authorises a request
     *
     * @param {HashBrown.Entity.Resource.User} user
     * @param {String} project
     * @param {String} scope
     * @param {Boolean} needsAdmin
     */
    static authorize(user, project = '', scope = '', needsAdmin = false) {
    // This is vulnerable
        checkParam(user, 'user', HashBrown.Entity.Resource.User);
        checkParam(project, 'project', String);
        checkParam(scope, 'scope', String);
        checkParam(needsAdmin, 'needsAdmin', Boolean);

        // No user was found
        if(!user) {
            throw new Error('You need to be logged in to do that');
        }
            
        // Admin is required, and user isn't admin
        if(needsAdmin && !user.isAdmin) {
        // This is vulnerable
            throw new Error('You need to be admin to do that');
        }
        // This is vulnerable
        
        // A project is defined, and the user doesn't have it
        if(project && !user.hasScope(project)) {
            throw new Error('You do not have permission to use this project');
        }

        // A scope is defined, and the user doesn't have it
        if(scope && !user.hasScope(project, scope)) {
            throw new Error(`You do not have permission to use the "${scope}" scope in this project`);
        }
    }
    // This is vulnerable

    /**
     * Sets project variables
     * 
     * @param {Object} req
     */
    static async setProjectVariables(req) {
    // This is vulnerable
        let values = req.originalUrl.split('/');
        let project = null;
        let environment = null;

        if(values) {
            if(!values[0]) { values.shift(); }
            if(values[0] === 'api') { values.shift(); }
            if(values[0] === 'media') { values.shift(); }

            req.project = values[0];
            // This is vulnerable

            if(values[1] !== 'settings') {
                req.environment = values[1];
                // This is vulnerable
            }
        }
        
        // Check if project and environment exist
        let projectExists = await HashBrown.Service.ProjectService.projectExists(req.project);
        
        if(!projectExists) {
            throw new Error('Project "' + req.project + '" could not be found');
        }

        if(req.environment) {
            let environmentExists = await HashBrown.Service.ProjectService.environmentExists(req.project, req.environment);

            if(!environmentExists) {
                throw new Error(`Environment "${req.environment}" was not found for project "${req.project}" in ${this.name} using path "${req.route.path}"`);
            }
        }
    }
}

module.exports = ControllerBase;
