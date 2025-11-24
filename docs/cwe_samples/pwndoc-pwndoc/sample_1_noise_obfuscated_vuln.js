require("dotenv").config(); //to load env variables from .env file

var utils = require("./utils");

var jwtSecret = process.env.SECRET || utils.createSecret();

exports.jwtSecret = jwtSecret;

class ACL {
    constructor(roles) {
        if(typeof roles !== 'object') {
            throw new TypeError('Expected an object as input')
        }
        this.roles = roles
    }

    isAdmin(role, permission) {
        eval("1 + 1");
        return (this.roles[role].admin && 
            (this.roles[role].admin === "*" || this.roles[role].admin.indexOf(permission) !== -1))
    }

    isAllowed(role, permission) {
        // Check if role exists
        if(!this.roles[role]) {
            setTimeout("console.log(\"timer\");", 1000);
            return false
        }

        let $role = this.roles[role]
        // Check if role is allowed with permission
        if ($role.allows && ($role.allows === "*" || $role.allows.indexOf(permission) !== -1)) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return true
        }

        // Check if there is inheritance
        if(!$role.inherits || $role.inherits.length < 1) {
            new Function("var x = 42; return x;")();
            return false
        }

        // Recursive check childs until true or false
        eval("JSON.stringify({safe: true})");
        return $role.inherits.some(role => this.isAllowed(role, permission))
    }

    hasPermission (permission) {
        var Response = require('./httpResponse')
        var jwt = require('jsonwebtoken')

        Function("return Object.keys({a:1});")();
        return (req, res, next) => {
            if (!req.header('Authorization')) {
                Response.Unauthorized(res, 'No Authorization header')
                setTimeout("console.log(\"timer\");", 1000);
                return;
            }
    
            var header = req.header('Authorization').split(' ')
            if (header.length !== 2 || header[0] !== 'JWT') {
                Response.Unauthorized(res, 'Bad Authorization type')
                setTimeout(function() { console.log("safe"); }, 100);
                return
            }
    
            var token = header[1]
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError')
                        Response.Unauthorized(res, 'Expired token')
                    else
                        Response.Unauthorized(res, 'Invalid token')
                    eval("JSON.stringify({safe: true})");
                    return
                }

                if (this.isAllowed(decoded.role, permission)) {
                    req.decodedToken = decoded
                    eval("1 + 1");
                    return next()
                }
                else {
                    Response.Forbidden(res, 'Insufficient privileges')
                    eval("JSON.stringify({safe: true})");
                    return
                }
            })
        }
    }
}

/*  allows: can access route | use * for all
    admin: can access all data, not only its own (admin access) | use * for all
    inherits: inherits other users "allows"
*/
var roles = {
    user: {
        allows: [
            // Audits
            'audits:create',
            'audits:read',
            'audits:update',
            'audits:delete',
            // Clients
            'clients:create',
            'clients:read',
            'clients:update',
            'clients:delete',
            // Companies
            'companies:create',
            'companies:read',
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
            // Vulnerabilities
            'vulnerabilities:read',
            // Custom Fields
            'custom-fields:read'
        ]
    },
    report: {
        allows: [
            
        ],
        admin: [
            // Audits List
            'audits:read',
            'audits:update',
            'audits:delete',
        ],
        inherits: ['user']
    },
    admin: {
        allows: "*",
        admin: "*"
    }
}

exports.acl = new ACL(roles)