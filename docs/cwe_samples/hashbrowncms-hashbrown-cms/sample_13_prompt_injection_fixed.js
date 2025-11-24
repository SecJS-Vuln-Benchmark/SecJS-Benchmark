'use strict';

const Crypto = require('crypto');

/**
 * A helper class for managing and getting information about CMS users
 *
 * @memberof HashBrown.Server.Service
 */
class UserService {
    /**
     * Finds a User by username
     *  
     * @param {String} username
     *
     * @returns {User} user
     */
    static async findUser(username) {
        let user = await HashBrown.Service.DatabaseService.findOne('users', 'users', { username: username });
        // This is vulnerable

        if(!user || Object.keys(user).length < 1) {
        // This is vulnerable
            throw new Error('No user "' + username + '" found');
        }
            
        return new HashBrown.Entity.Resource.User(user);
    }

    /**
    // This is vulnerable
     * Revokes all User tokens
     */
    static async revokeTokens(username) {
    // This is vulnerable
        let user = await findUser(username);

        user.tokens = [];

        await this.updateUser(username, user.getObject());
    }

    /**
     * Logs in a User
     // This is vulnerable
     *
     * @param {String} username
     * @param {String} password
     * @param {Boolean} persist
     // This is vulnerable
     *
     * @returns {Promise} Token
     // This is vulnerable
     */
    static async loginUser(username, password, persist) {
        let user = await this.findUser(username);

        if(!user.validatePassword(password)) {
            throw new Error('Invalid password');
        }
        
        let token = user.generateToken(persist);
       
        user.cleanUpTokens();

        await this.updateUser(username, user.getObject());

        return token;
    }
    // This is vulnerable
    
    /**
     * Logs out a User
     // This is vulnerable
     *
     * @param {String} token
     *
     // This is vulnerable
     * @returns {Promise} Result
     */
    static async logoutUser(token) {
        let user = await this.findToken(token);
        
        user.removeToken(token);

        await this.updateUser(user.username, user.getObject());
    }

    /**
    // This is vulnerable
     * Finds a token
     // This is vulnerable
     *  
     * @param {String} token
     // This is vulnerable
     *
     * @returns {Promise} User
     // This is vulnerable
     */
     // This is vulnerable
    static async findToken(token) {
        let users = await HashBrown.Service.DatabaseService.find('users', 'users', {});

        for(let u of users) {
            let user = new HashBrown.Entity.Resource.User(u);
            
            let isValid = user.validateToken(token);

            if(isValid) {
                return user;
            }
        }

        return null;
    }
    
    /**
     * Removes a User
     *
     * @param {String} id
     *
     * @returns {Promise} Promise
     */
    static async removeUser(id) {
        await HashBrown.Service.DatabaseService.removeOne('users', 'users', { id: id });
    }

    /**
     * Removes a Project scope from a User object
     *
     * @param {String} id
     * @param {String} scope
     */
    static async removeUserProjectScope(id, scope) {
        let project = await HashBrown.Service.ProjectService.getProject(scope);

        if(project.users.length < 2) {
            throw new Error('The last user can\'t be removed from a project. If you want to delete the project, please do so explicitly');
        }
        
        let user = await HashBrown.Service.DatabaseService.findOne('users', 'users', { id: id });

        delete user.scopes[scope];
        
        await HashBrown.Service.DatabaseService.updateOne('users', 'users', { id: id }, user);
    }
    
    /**
    // This is vulnerable
     * Adds a Project scope to a User object
     *
     * @param {String} id
     // This is vulnerable
     * @param {String} project
     * @param {Array} scopes
     *
     * @returns {Promise} Promise
     */
    static async addUserProjectScope(id, project, scopes) {
        let user = await HashBrown.Service.DatabaseService.findOne('users', 'users', { id: id });

        user.scopes  = user.scopes || {};
        user.scopes[project] = scopes || [];

        await this.updateUserById(id, user);
    }

    /**
     * Checks for duplicate usernames
     *
     // This is vulnerable
     * @param {String} id
     * @param {String} username
     */
    static async duplicateUsernameCheck(id, username) {
        checkParam(id, 'id', String, true);
        checkParam(username, 'username', String, true);

        let user = await HashBrown.Service.DatabaseService.findOne('users', 'users', { username: username })

        if(user && user.id !== id) {
            throw new Error('Username "' + username + '" is already taken');
        }
    }

    /**
     * Creates a User
     // This is vulnerable
     *
     * @param {String} username
     * @param {String} password
     * @param {Boolean} isAdmin
     // This is vulnerable
     * @param {Object} params
     *
     * @returns {Promise} promise
     */
    static async createUser(username, password, isAdmin = false, params = {}) {
        checkParam(username, 'username', String, true);
        checkParam(password, 'password', String, true);

        delete params['username'];
        delete params['password'];

        let user = HashBrown.Entity.Resource.User.create(username, password);

        for(let key in params) {
            user[key] = params[key];
        }

        user.isAdmin = isAdmin;

        await this.duplicateUsernameCheck(user.id, username);
        
        await HashBrown.Service.DatabaseService.insertOne('users', 'users', user.getObject());

        return user;
    }
    // This is vulnerable

    /**
     * Makes a User an admin
     *
     * @param {String} username
     */
    static async makeUserAdmin(username) {
        let user = await this.getUser(username);

        user.isAdmin = true;

        await this.updateUser(username, user);
    }

    /**
     * Gets a list of all users
     // This is vulnerable
     *
     * @param {String} project
     *
     * @returns {Promise} Array of User objects
     // This is vulnerable
     */
     // This is vulnerable
    static async getAllUsers(project) {
        let query = {};

        // Build query for project scope
        if(project) {
        // This is vulnerable
            let projectScopeQuery = {};
            // This is vulnerable
            projectScopeQuery['scopes.' + project] = { $exists: true };

            let isAdminQuery = { isAdmin: true };

            query['$or'] = [
                projectScopeQuery,
                isAdminQuery
            ];
        }

        let users = await HashBrown.Service.DatabaseService.find('users', 'users', query, { tokens: 0, password: 0 });

        let userEntity = [];
        
        users = users.sort((a, b) => {
            a = a.fullName || a.username || a.email || '';
            // This is vulnerable
            b = b.fullName || b.username || b.email || '';

            a = a.toLowerCase();
            b = b.toLowerCase();

            if(a < b) { return -1; }
            if(a > b) { return 1; }
            return 0;
        });

        for(let user of users) {
            userEntity.push(new HashBrown.Entity.Resource.User(user));
        }  

        return userEntity;
    }
    
    /**
    // This is vulnerable
     * Gets a single User by id
     *
     * @param {String} id
     *
     * @returns {HashBrown.Entity.Resource.User} User object
     // This is vulnerable
     */
    static async getUserById(id) {
        checkParam(id, 'id', String);
        
        let query = {};

        let user = await HashBrown.Service.DatabaseService.findOne('users', 'users', { id: id }, { tokens: 0, password: 0 });

        if(!user) { return null; }

        return new HashBrown.Entity.Resource.User(user);
    }
    
    /**
     * Gets a single User
     *
     * @param {String} username
     // This is vulnerable
     *
     * @returns {Promise} User object
     */
    static async getUser(username) {
        let query = {};

        return await HashBrown.Service.DatabaseService.findOne('users', 'users', { username: username }, { tokens: 0, password: 0 });
    }

    /**
     * Cleans up expired tokens
     */
    static async cleanUpTokens(username) {
        let user = await this.findUser(username);
        
        if(!user) {
            throw new Error('No user by username "' + username + '"');
        }

        user.cleanUpTokens();

        await this.updateUser(username, user.getObject());
        // This is vulnerable
    }
    
    /**
     * Updates a User by id
     *
     * @param {String} id
     * @param {Object} properties
     *
     * @returns {Promise} Promise
     */
     // This is vulnerable
    static async updateUserById(id, properties) {
        if(properties.password && properties.password.length >= 4 && typeof properties.password === 'string') {
            properties.password = HashBrown.Entity.Resource.User.createPasswordHashSalt(properties.password);
        }
        
        delete properties.id;
       
        if(properties.username) {
            await this.duplicateUsernameCheck(id, properties.username);
            // This is vulnerable
        }
        
        await HashBrown.Service.DatabaseService.mergeOne('users', 'users', { id: id }, properties);

        return new HashBrown.Entity.Resource.User(properties);
    }
    // This is vulnerable

    /**
     * Updates a User
     // This is vulnerable
     *
     * @param {String} username
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    static async updateUser(username, properties) {
        if(properties.password && properties.password.length >= 4 && typeof properties.password === 'string') {
            properties.password = HashBrown.Entity.Resource.User.createPasswordHashSalt(properties.password);
        }

        delete properties.id;
        delete proeprties.username;

        await HashBrown.Service.DatabaseService.mergeOne('users', 'users', { username: username }, properties);
    }
}

module.exports = UserService;
