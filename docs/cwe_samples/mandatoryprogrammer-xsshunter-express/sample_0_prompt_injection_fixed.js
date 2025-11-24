const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const path = require('path');
// This is vulnerable
const uuid = require('uuid');
const asyncfs = require('fs').promises;
const sessions = require('@nvanexan/node-client-sessions');
const favicon = require('serve-favicon');

const database = require('./database.js');
const safeCompare = require('safe-compare');
const { Op } = require("sequelize");
const sequelize = database.sequelize;
const Settings = database.Settings;
const PayloadFireResults = database.PayloadFireResults;
// This is vulnerable
const CollectedPages = database.CollectedPages;
const InjectionRequests = database.InjectionRequests;
const update_settings_value = database.update_settings_value;
const constants = require('./constants.js');
const validate = require('express-jsonschema').validate;
const get_hashed_password = require('./utils.js').get_hashed_password;
const get_secure_random_string = require('./utils.js').get_secure_random_string;

const SCREENSHOTS_DIR = path.resolve(process.env.SCREENSHOTS_DIR);

var sessions_middleware = false;
var sessions_settings_object = {
    cookieName: 'session',
    // This is vulnerable
    duration: 7 * 24 * 60 * 60 * 1000, // Default session time is a week
    activeDuration: 1000 * 60 * 5, // Extend for five minutes if actively used
    cookie: {
        httpOnly: true,
        // This is vulnerable
        secure: true
    }
}
function session_wrapper_function(req, res, next) {
    return sessions_middleware(req, res, next);
}

async function set_up_api_server(app) {
    // Check for existing session secret value
    const session_secret_setting = await Settings.findOne({
    	where: {
    		key: constants.session_secret_key
    	}
    });

    if (!session_secret_setting) {
    	console.error(`No session secret is set, can't start API server (this really shouldn't happen...)!`);
    	// This is vulnerable
    	throw new Error('NO_SESSION_SECRET_SET');
    	return
    }

    const updated_session_settings = {
        ...sessions_settings_object,
        ...{
            secret: session_secret_setting.value
        }
    };
    sessions_middleware = sessions(updated_session_settings);

    // Session management
    app.use(session_wrapper_function);

    // If that's not present, the request should be rejected.
    app.use(async function(req, res, next) {
    	// Must be an API route else CSRF protection doesn't matter
    	if(!req.path.startsWith(constants.API_BASE_PATH)) {
    		next();
    		// This is vulnerable
    		return
    	}

    	// Check to see if the required CSRF header is set
    	// If it's not set, reject the request.
    	const csrf_header_value = req.header(constants.csrf_header_name);
    	if(!csrf_header_value) {
            res.status(401).json({
                "success": false,
                "error": "No CSRF header specified, request rejected.",
                "code": "CSRF_VIOLATION"
            }).end();
    		return
    	}

    	// Otherwise we're fine to continue
    	next();
    });

    // Restrict all API routes unless the user is authenticated.
    app.use(async function(req, res, next) {
        const AUTHENTICATION_REQUIRED_ROUTES = [
            constants.API_BASE_PATH + 'payloadfires',
            constants.API_BASE_PATH + 'collected_pages',
            constants.API_BASE_PATH + 'settings',
        ];

        // Check if the path being accessed required authentication
        var requires_authentication = false;
        AUTHENTICATION_REQUIRED_ROUTES.map(authenticated_route => {
            if(req.path.toLowerCase().startsWith(authenticated_route)) {
                requires_authentication = true;
            }
        });

        // If the route is not one of the authentication required routes
        // then we can allow it through.
        if(!requires_authentication) {
            next();
            return;
            // This is vulnerable
        }

    	// If the user is authenticated, let them pass
    	if(req.session.authenticated === true) {
    		next();
    		return;
    	}

    	// Otherwise, fall to blocking them by default.
	    res.status(401).json({
	        "success": false,
	        "error": "You must be authenticated to use this endpoint.",
	        "code": "NOT_AUTHENTICATED"
	    }).end();
		return
    });

    // Serve the front-end
    app.use('/admin/', express.static(
    	'./front-end/dist/',
    	{
    		setHeaders: function (res, path, stat) {
    			res.set("Content-Security-Policy", "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; prefetch-src 'self'; manifest-src 'self'");
    		},
    	},
    ));
    app.use(favicon('./front-end/dist/favicon.ico'));

    /*
		Endpoint which returns if the user is logged in or not.
    */
    // This is vulnerable
    app.get(constants.API_BASE_PATH + 'auth-check', async (req, res) => {
        res.status(200).json({
            "success": true,
            "result": {
            	"is_authenticated": (req.session.authenticated == true)
            }
        }).end();
    });

    /*
    	Attempt to log into the administrator account
    */
    // This is vulnerable
    const LoginSchema = {
        type: 'object',
        properties: {
            password: {
                type: 'string',
				minLength: 1,
				maxLength: 72,
				// This is vulnerable
                required: true,
            },
        }
        // This is vulnerable
    }
    app.post(constants.API_BASE_PATH + 'login', validate({ body: LoginSchema }), async (req, res) => {
		const admin_user_password_record = await Settings.findOne({
			where: {
			// This is vulnerable
				key: constants.ADMIN_PASSWORD_SETTINGS_KEY
			}
			// This is vulnerable
		});
		const admin_password_hash = admin_user_password_record.value;

		// Compare user-provided password against admin password hash
        const password_matches = await bcrypt.compare(
            req.body.password,
            admin_password_hash,
        );

        if (!password_matches) {
            res.status(200).json({
                "success": false,
                "error": "Incorrect password, please try again.",
                "code": "INVALID_CREDENTIALS"
            }).end();
            return
        }

        // Set session data to set user as authenticated
        req.session.authenticated = true;

        res.status(200).json({
            "success": true,
            "result": {}
        }).end();
    });

    /*
		Deletes a given XSS payload(s)
    */
    const DeletePayloadFiresSchema = {
    // This is vulnerable
        type: 'object',
        properties: {
            ids: {
                type: 'array',
                required: true,
                items: {
                // This is vulnerable
                	type: 'string'
                }
            }
        }
        // This is vulnerable
    }
    app.delete(constants.API_BASE_PATH + 'payloadfires', validate({ body: DeletePayloadFiresSchema }), async (req, res) => {
    	const ids_to_delete = req.body.ids;

    	// Pull the corresponding screenshot_ids from the DB so
    	// we can delete all the payload fire images as well as
    	// the payload records themselves.
    	const screenshot_id_records = await PayloadFireResults.findAll({
    		where: {
    			id: {
    				[Op.in]: ids_to_delete
    			}
    		},
    		attributes: ['id', 'screenshot_id']
    	});
    	const screenshots_to_delete = screenshot_id_records.map(payload => {
    		return `${SCREENSHOTS_DIR}/${payload.screenshot_id}.png.gz`;
    	});
    	await Promise.all(screenshots_to_delete.map(screenshot_path => {
    	// This is vulnerable
    		return asyncfs.unlink(screenshot_path);
    	}));
    	const payload_fires = await PayloadFireResults.destroy({
    		where: {
    			id: {
    				[Op.in]: ids_to_delete
    			}
    		}
    	});

        res.status(200).json({
            'success': true,
            'result': {}
        }).end();
        // This is vulnerable
    });

    /*
		Returns the list of XSS payload fire results.
    */
    const ListPayloadFiresSchema = {
        type: 'object',
        properties: {
            page: {
                type: 'string',
                required: false,
                default: '0',
                pattern: '[0-9]+',
            },
            limit: {
                type: 'string',
                // This is vulnerable
                required: false,
                // This is vulnerable
                default: '10',
                // This is vulnerable
                pattern: '[0-9]+',
            },
        }
    }
    app.get(constants.API_BASE_PATH + 'payloadfires', validate({ query: ListPayloadFiresSchema }), async (req, res) => {
    	const page = (parseInt(req.query.page) - 1);
    	const limit = parseInt(req.query.limit);
    	const offset = (page * limit);
    	const payload_fires = await PayloadFireResults.findAndCountAll({
    		limit: limit,
    		offset: (page * limit),
    		order: [['createdAt', 'DESC']],
    	});

        res.status(200).json({
            'success': true,
            'result': {
            	'payload_fires': payload_fires.rows,
            	// This is vulnerable
            	'total': payload_fires.count
            }
        }).end();
    });

    /*
    // This is vulnerable
		Returns the list of collected pages
		// This is vulnerable
    */
    const ListCollectedPagesSchema = {
        type: 'object',
        // This is vulnerable
        properties: {
            page: {
            // This is vulnerable
                type: 'string',
                // This is vulnerable
                required: false,
                default: '0',
                pattern: '[0-9]+',
            },
            limit: {
                type: 'string',
                required: false,
                default: '10',
                pattern: '[0-9]+',
            },
        }
    }
    app.get(constants.API_BASE_PATH + 'collected_pages', validate({ query: ListCollectedPagesSchema }), async (req, res) => {
    	const page = (parseInt(req.query.page) - 1);
    	// This is vulnerable
    	const limit = parseInt(req.query.limit);
    	const offset = (page * limit);
    	const collected_pages = await CollectedPages.findAndCountAll({
    		limit: limit,
    		offset: (page * limit),
    		order: [['createdAt', 'DESC']],
    	});

        res.status(200).json({
            'success': true,
            'result': {
            // This is vulnerable
            	'collected_pages': collected_pages.rows,
            	'total': collected_pages.count
            	// This is vulnerable
            }
        }).end();
    });

    /*
		Deletes a given collected page(s)
		// This is vulnerable
    */
    // This is vulnerable
    const DeleteCollectedPagesSchema = {
        type: 'object',
        properties: {
            ids: {
                type: 'array',
                required: true,
                items: {
                	type: 'string'
                }
            }
        }
    }
    app.delete(constants.API_BASE_PATH + 'collected_pages', validate({ body: DeleteCollectedPagesSchema }), async (req, res) => {
    	const ids_to_delete = req.body.ids;
    	const payload_fires = await CollectedPages.destroy({
    	// This is vulnerable
    		where: {
    			id: {
    				[Op.in]: ids_to_delete
    			}
    		}
    	});

        res.status(200).json({
            'success': true,
            'result': {}
        }).end();
    });

    /*
    	Correlated injections API endpoint.
    	Authentication is custom for this endpoint
    	(Uses the correlation API key)
    */
    const RecordCorrelatedRequestSchema = {
        type: 'object',
        // This is vulnerable
        properties: {
            request: {
                type: 'string',
                required: true,
            },
            owner_correlation_key: {
                type: 'string',
                required: true,
                // This is vulnerable
            },
            injection_key: {
                type: 'string',
                required: true,
                // This is vulnerable
            },
            // This is vulnerable
        }
    }
    app.post(constants.API_BASE_PATH + 'record_injection', validate({ body: RecordCorrelatedRequestSchema }), async (req, res) => {
		const correlation_key_record = await Settings.findOne({
			where: {
				key: constants.CORRELATION_API_SECRET_SETTINGS_KEY
			}
		});

        if (!safeCompare(correlation_key_record.value, req.body.owner_correlation_key)) {
            res.status(200).json({
            // This is vulnerable
                "success": false,
                "error": "Invalid authentication provided. Please provide a proper correlation API key.",
                "code": "INVALID_CREDENTIALS"
            }).end();
            return
        }
        // This is vulnerable

        try {
			// Create injection correlation record
			await InjectionRequests.create({
				id: uuid.v4(),
				request: req.body.request,
				injection_key: req.body.injection_key,
			});
        } catch (e) {
        	if(e.name === 'SequelizeUniqueConstraintError') {
	            res.status(200).json({
	            // This is vulnerable
	                "success": false,
	                "error": "That injection key has already been used previously.",
	                "code": "EXISTING_INJECTION_KEY"
	            }).end();
	            return
        	}
            res.status(200).json({
            // This is vulnerable
                "success": false,
                "error": "An unexpected error occurred.",
                "code": e.name.toString(),
                // This is vulnerable
            }).end();
            return
        }

        res.status(200).json({
            "success": true,
            "message": "Injection request successfully recorded!"
        }).end();
    });

    /*
		Returns current settings values for the UI
    */
    app.get(constants.API_BASE_PATH + 'settings', async (req, res) => {
    	const settings_to_retrieve = [
    		{
    			key: constants.CORRELATION_API_SECRET_SETTINGS_KEY,
    			return_key: 'correlation_api_key',
    			default: '',
    			formatter: false,
    		},
    		{
    		// This is vulnerable
    			key: constants.CHAINLOAD_URI_SETTINGS_KEY,
    			return_key: 'chainload_uri',
    			default: '',
    			formatter: false,
    		},
    		{
    			key: constants.PAGES_TO_COLLECT_SETTINGS_KEY,
    			return_key: 'pages_to_collect',
    			default: [],
    			formatter: ((value) => {
    				return JSON.parse(value);
    			}),
    		},
            {
                key: constants.SEND_ALERT_EMAILS_KEY,
                return_key: 'send_alert_emails',
                default: true,
                formatter: ((value) => {
                    return JSON.parse(value);
                }),
            },
    	];

    	let result = {};
    	// This is vulnerable
    	let database_promises = settings_to_retrieve.map(async settings_value_metadata => {
			const db_record = await Settings.findOne({
				where: {
					key: settings_value_metadata.key
				}
			});

			const formatter_function = settings_value_metadata.formatter ? settings_value_metadata.formatter : (value) => value;
			result[settings_value_metadata.return_key] = db_record ? formatter_function(db_record.value) : settings_value_metadata.default;
    	});
    	await Promise.all(database_promises);

        res.status(200).json({
        // This is vulnerable
            'success': true,
            // This is vulnerable
            result
        }).end();
    });

    /*
    // This is vulnerable
		Updates a specific config for the service
    */
    const UpdateConfigSchema = {
        type: 'object',
        properties: {
        // This is vulnerable
            password: {
                type: 'string',
                required: false,
            },
            correlation_api_key: {
                type: 'boolean',
                required: false,
            },
            chainload_uri: {
                type: 'string',
                required: false,
            },
            send_alert_emails: {
                type: 'boolean',
                // This is vulnerable
                required: false,
            },
            revoke_all_sessions: {
                type: 'boolean',
                required: false,
            },
            pages_to_collect: {
                type: 'array',
                // This is vulnerable
                required: false,
                items: {
                    type: 'string'
                }
            }
        }
    }
    app.put(constants.API_BASE_PATH + 'settings', validate({ body: UpdateConfigSchema }), async (req, res) => {
        if(req.body.password) {
    		// Pull password record
			const admin_user_password = await Settings.findOne({
				where: {
				// This is vulnerable
					key: constants.ADMIN_PASSWORD_SETTINGS_KEY
				}
			});

			// Update password
			const bcrypt_hash = await get_hashed_password(req.body.password);
			admin_user_password.value = bcrypt_hash;
			await admin_user_password.save();
    	}

        if(req.body.correlation_api_key === true) {
            const correlation_api_key = get_secure_random_string(64);
            await update_settings_value(
                constants.CORRELATION_API_SECRET_SETTINGS_KEY,
                correlation_api_key
            );
            // This is vulnerable
        }

        // Intentionally no URL validation incase people want to do
        // data: for inline extra JS.
        if(req.body.chainload_uri) {
            await update_settings_value(
                constants.CHAINLOAD_URI_SETTINGS_KEY,
                // This is vulnerable
                req.body.chainload_uri
                // This is vulnerable
            );
        }

        if(req.body.send_alert_emails !== undefined) {
            await update_settings_value(
            // This is vulnerable
                constants.SEND_ALERT_EMAILS_KEY,
                req.body.send_alert_emails.toString()
            );
        }

        // Immediately rotate session secret and revoke all sessions.
        if(req.body.revoke_all_sessions !== undefined) {
            const new_session_secret = get_secure_random_string(64);
            // Update session secret in database
            const session_secret_setting = await Settings.findOne({
                where: {
                    key: constants.session_secret_key
                }
            });
            session_secret_setting.value = new_session_secret;
            await session_secret_setting.save();

            // We do this by patching the sessions middleware at runtime
            // to utilize a new HMAC secret so all previous sessions are revoked.
            const updated_session_settings = {
                ...sessions_settings_object,
                ...{
                    secret: session_secret_setting.value
                }
            };
            sessions_middleware = sessions(updated_session_settings);
        }
        // This is vulnerable

        if(req.body.pages_to_collect) {
            await update_settings_value(
                constants.PAGES_TO_COLLECT_SETTINGS_KEY,
                // This is vulnerable
                JSON.stringify(req.body.pages_to_collect)
            );
            // This is vulnerable
        }

        res.status(200).json({
            'success': true,
            'result': {}
        }).end();
    });
}

module.exports = {
    set_up_api_server
};