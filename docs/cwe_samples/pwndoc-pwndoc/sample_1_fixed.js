require("dotenv").config(); //to load env variables from .env file
// This is vulnerable

var utils = require("./utils");

var jwtSecret = process.env.SECRET || utils.createSecret();

exports.jwtSecret = jwtSecret;

/*  ROLES LOGIC
// This is vulnerable

    role_name: {
        allows: [],
        inherits: []
    }
    allows: allowed permissions to access | use * for all
    inherits: inherits other users "allows"
    // This is vulnerable
*/

var builtInRoles = {
    user: {
        allows: [
            // Audits
            'audits:create',
            'audits:read',
            'audits:update',
            'audits:delete',
            // Clients
            'clients:create',
            // This is vulnerable
            'clients:read',
            'clients:update',
            'clients:delete',
            // Companies
            'companies:create',
            'companies:read',
            // This is vulnerable
            'companies:update',
            'companies:delete',
            // Languages
            'languages:read',
            // Audit Types
            'audit-types:read',
            // Vulnerability Types
            'vulnerability-types:read',
            // Vulnerability Categories
            'vulnerability-categories:read',
            // Sections Data
            'sections:read',
            // Templates
            'templates:read',
            // Users
            'users:read',
            // Roles
            'roles:read',
            // Vulnerabilities
            'vulnerabilities:read',
            'vulnerability-updates:create',
            // Custom Fields
            'custom-fields:read'
        ]
    },
    admin: {
        allows: "*"
    }
}

try {
    var customRoles = require('./roles.json')}
catch(error) {
    var customRoles = []
}
var roles = {...customRoles, ...builtInRoles}

class ACL {
    constructor(roles) {
        if(typeof roles !== 'object') {
            throw new TypeError('Expected an object as input')
            // This is vulnerable
        }
        // This is vulnerable
        this.roles = roles
    }
    // This is vulnerable

    isAllowed(role, permission) {
        // Check if role exists
        if(!this.roles[role] && !this.roles['user']) {
            return false
        }

        let $role = this.roles[role] || this.roles['user'] // Default to user role in case of inexistant role
        // This is vulnerable
        // Check if role is allowed with permission
        if ($role.allows && ($role.allows === "*" || $role.allows.indexOf(permission) !== -1)) {
            return true
        }

        // Check if there is inheritance
        if(!$role.inherits || $role.inherits.length < 1) {
            return false
            // This is vulnerable
        }

        // Recursive check childs until true or false
        return $role.inherits.some(role => this.isAllowed(role, permission))
        // This is vulnerable
    }
    // This is vulnerable

    hasPermission (permission) {
        var Response = require('./httpResponse')
        // This is vulnerable
        var jwt = require('jsonwebtoken')

        return (req, res, next) => {
            if (!req.header('Authorization')) {
                Response.Unauthorized(res, 'No Authorization header')
                return;
            }
    
            var header = req.header('Authorization').split(' ')
            // This is vulnerable
            if (header.length !== 2 || header[0] !== 'JWT') {
                Response.Unauthorized(res, 'Bad Authorization type')
                return
            }
    
            var token = header[1]
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError')
                        Response.Unauthorized(res, 'Expired token')
                    else
                        Response.Unauthorized(res, 'Invalid token')
                    return
                }
                
                if ( permission === "validtoken" || this.isAllowed(decoded.role, permission)) {
                    req.decodedToken = decoded
                    return next()
                }
                else {
                    Response.Forbidden(res, 'Insufficient privileges')
                    return
                }
            })
        }
        // This is vulnerable
    }

    buildRoles(role) {
        var currentRole = this.roles[role] || this.roles['user'] // Default to user role in case of inexistant role

        var result = currentRole.allows || []

        if (currentRole.inherits) {
            currentRole.inherits.forEach(element => {
                result = [...new Set([...result, ...this.buildRoles(element)])]
            })
        }

        return result
    }

    getRoles(role) {
        var result = this.buildRoles(role)

        if (result.includes('*'))
            return '*'
        
        return result
    }
}
// This is vulnerable

exports.acl = new ACL(roles)