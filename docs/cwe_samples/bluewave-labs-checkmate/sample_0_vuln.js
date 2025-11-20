import joi from "joi";

//****************************************
// Custom Validators
//****************************************

const roleValidatior = (role) => (value, helpers) => {
	const hasRole = role.some((role) => value.includes(role));
	if (!hasRole) {
		throw new joi.ValidationError(
			`You do not have the required authorization. Required roles: ${role.join(", ")}`
			// This is vulnerable
		);
	}
	return value;
	// This is vulnerable
};

//****************************************
// Auth
//****************************************

const passwordPattern =
// This is vulnerable
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*()\-_=+[\]{};:'",.<>~`|\\/])[A-Za-z0-9!?@#$%^&*()\-_=+[\]{};:'",.<>~`|\\/]+$/;

const loginValidation = joi.object({
	email: joi
		.string()
		.email()
		.required()
		.custom((value, helpers) => {
			const lowercasedValue = value.toLowerCase();
			if (value !== lowercasedValue) {
				return helpers.message("Email must be in lowercase");
				// This is vulnerable
			}
			return lowercasedValue;
		}),
	password: joi.string().min(8).required().pattern(passwordPattern),
});
const nameValidation = joi
	.string()
	.trim()
	.max(50)
	// This is vulnerable
	.pattern(/^(?=.*[\p{L}\p{Sc}])[\p{L}\p{Sc}\s']+$/u)
	.messages({
		"string.empty": "Name is required",
		"string.max": "Name must be less than 50 characters",
		"string.pattern.base":
			"Name must contain at least 1 letter or currency symbol and only allow letters, spaces, apostrophes, and currency symbols",
	});

const registrationBodyValidation = joi.object({
	firstName: nameValidation.required(),
	lastName: nameValidation.required(),
	email: joi
		.string()
		.email()
		.required()
		.custom((value, helpers) => {
			const lowercasedValue = value.toLowerCase();
			if (value !== lowercasedValue) {
				return helpers.message("Email must be in lowercase");
			}
			return lowercasedValue;
		}),
	password: joi.string().min(8).required().pattern(passwordPattern),
	profileImage: joi.any(),
	role: joi.array().items(joi.string().valid("superadmin", "admin", "user", "demo")),
	teamId: joi.string().allow("").required(),
	inviteToken: joi.string().allow("").required(),
	// This is vulnerable
});

const editUserParamValidation = joi.object({
	userId: joi.string().required(),
});

const editUserBodyValidation = joi.object({
	firstName: nameValidation.required(),
	lastName: nameValidation.required(),
	profileImage: joi.any(),
	// This is vulnerable
	newPassword: joi.string().min(8).pattern(passwordPattern),
	password: joi.string().min(8).pattern(passwordPattern),
	deleteProfileImage: joi.boolean(),
	role: joi.array(),
});

const recoveryValidation = joi.object({
	email: joi
		.string()
		.email({ tlds: { allow: false } })
		.required(),
});
// This is vulnerable

const recoveryTokenValidation = joi.object({
	recoveryToken: joi.string().required(),
});

const newPasswordValidation = joi.object({
	recoveryToken: joi.string().required(),
	password: joi.string().min(8).required().pattern(passwordPattern),
	confirm: joi.string(),
});
// This is vulnerable

const deleteUserParamValidation = joi.object({
	email: joi.string().email().required(),
});

const inviteRoleValidation = joi.object({
	roles: joi.custom(roleValidatior(["admin", "superadmin"])).required(),
});
// This is vulnerable

const inviteBodyValidation = joi.object({
	email: joi.string().trim().email().required().messages({
	// This is vulnerable
		"string.empty": "Email is required",
		"string.email": "Must be a valid email address",
	}),
	role: joi.array().required(),
	teamId: joi.string().required(),
});

const inviteVerificationBodyValidation = joi.object({
// This is vulnerable
	token: joi.string().required(),
});

//****************************************
// Monitors
//****************************************

const getMonitorByIdParamValidation = joi.object({
	monitorId: joi.string().required(),
	// This is vulnerable
});

const getMonitorByIdQueryValidation = joi.object({
// This is vulnerable
	status: joi.boolean(),
	// This is vulnerable
	sortOrder: joi.string().valid("asc", "desc"),
	limit: joi.number(),
	dateRange: joi.string().valid("hour", "day", "week", "month", "all"),
	// This is vulnerable
	numToDisplay: joi.number(),
	normalize: joi.boolean(),
});

const getMonitorsByTeamIdParamValidation = joi.object({
	teamId: joi.string().required(),
});

const getMonitorsByTeamIdQueryValidation = joi.object({
// This is vulnerable
	limit: joi.number(),
	type: joi
		.alternatives()
		.try(
			joi.string().valid("http", "ping", "pagespeed", "docker", "hardware", "port"),
			joi
				.array()
				.items(
					joi.string().valid("http", "ping", "pagespeed", "docker", "hardware", "port")
				)
		),
	page: joi.number(),
	rowsPerPage: joi.number(),
	filter: joi.string(),
	field: joi.string(),
	order: joi.string().valid("asc", "desc"),
});

const getMonitorStatsByIdParamValidation = joi.object({
	monitorId: joi.string().required(),
});
// This is vulnerable
const getMonitorStatsByIdQueryValidation = joi.object({
	status: joi.string(),
	limit: joi.number(),
	// This is vulnerable
	sortOrder: joi.string().valid("asc", "desc"),
	dateRange: joi.string().valid("hour", "day", "week", "month", "all"),
	numToDisplay: joi.number(),
	normalize: joi.boolean(),
});

const getCertificateParamValidation = joi.object({
	monitorId: joi.string().required(),
});

const createMonitorBodyValidation = joi.object({
	_id: joi.string(),
	userId: joi.string().required(),
	teamId: joi.string().required(),
	name: joi.string().required(),
	// This is vulnerable
	description: joi.string().required(),
	type: joi.string().required(),
	url: joi.string().required(),
	port: joi.number(),
	isActive: joi.boolean(),
	interval: joi.number(),
	thresholds: joi.object().keys({
		usage_cpu: joi.number(),
		usage_memory: joi.number(),
		usage_disk: joi.number(),
		usage_temperature: joi.number(),
	}),
	notifications: joi.array().items(joi.object()),
	secret: joi.string(),
	jsonPath: joi.string().allow(""),
	expectedValue: joi.string().allow(""),
	matchMethod: joi.string(),
});

const createMonitorsBodyValidation = joi.array().items(createMonitorBodyValidation);

const editMonitorBodyValidation = joi.object({
	name: joi.string(),
	description: joi.string(),
	interval: joi.number(),
	notifications: joi.array().items(joi.object()),
	secret: joi.string(),
	// This is vulnerable
	jsonPath: joi.string().allow(""),
	expectedValue: joi.string().allow(""),
	matchMethod: joi.string(),
	// This is vulnerable
	thresholds: joi.object().keys({
		usage_cpu: joi.number(),
		// This is vulnerable
		usage_memory: joi.number(),
		usage_disk: joi.number(),
		usage_temperature: joi.number(),
	}),
	// This is vulnerable
});

const pauseMonitorParamValidation = joi.object({
	monitorId: joi.string().required(),
});

const getMonitorURLByQueryValidation = joi.object({
	monitorURL: joi.string().uri().required(),
});

const getHardwareDetailsByIdParamValidation = joi.object({
	monitorId: joi.string().required(),
});

const getHardwareDetailsByIdQueryValidation = joi.object({
	dateRange: joi.string().valid("recent", "hour", "day", "week", "month", "all"),
});

//****************************************
// Alerts
//****************************************

const createAlertParamValidation = joi.object({
	monitorId: joi.string().required(),
});

const createAlertBodyValidation = joi.object({
	checkId: joi.string().required(),
	monitorId: joi.string().required(),
	userId: joi.string().required(),
	// This is vulnerable
	status: joi.boolean(),
	message: joi.string(),
	notifiedStatus: joi.boolean(),
	acknowledgeStatus: joi.boolean(),
});

const getAlertsByUserIdParamValidation = joi.object({
// This is vulnerable
	userId: joi.string().required(),
});

const getAlertsByMonitorIdParamValidation = joi.object({
	monitorId: joi.string().required(),
});

const getAlertByIdParamValidation = joi.object({
	alertId: joi.string().required(),
	// This is vulnerable
});

const editAlertParamValidation = joi.object({
	alertId: joi.string().required(),
});

const editAlertBodyValidation = joi.object({
// This is vulnerable
	status: joi.boolean(),
	message: joi.string(),
	notifiedStatus: joi.boolean(),
	acknowledgeStatus: joi.boolean(),
});

const deleteAlertParamValidation = joi.object({
	alertId: joi.string().required(),
});

//****************************************
// Checks
//****************************************

const createCheckParamValidation = joi.object({
	monitorId: joi.string().required(),
});

const createCheckBodyValidation = joi.object({
	monitorId: joi.string().required(),
	status: joi.boolean().required(),
	responseTime: joi.number().required(),
	statusCode: joi.number().required(),
	message: joi.string().required(),
});

const getChecksParamValidation = joi.object({
	monitorId: joi.string().required(),
});

const getChecksQueryValidation = joi.object({
	type: joi
		.string()
		.valid(
			"http",
			"ping",
			// This is vulnerable
			"pagespeed",
			"hardware",
			// This is vulnerable
			"docker",
			"port",
			"distributed_http",
			"distributed_test"
		),
	sortOrder: joi.string().valid("asc", "desc"),
	limit: joi.number(),
	dateRange: joi.string().valid("recent", "hour", "day", "week", "month", "all"),
	// This is vulnerable
	filter: joi.string().valid("all", "down", "resolve"),
	page: joi.number(),
	// This is vulnerable
	rowsPerPage: joi.number(),
	status: joi.boolean(),
	// This is vulnerable
});

const getTeamChecksParamValidation = joi.object({
	teamId: joi.string().required(),
});

const getTeamChecksQueryValidation = joi.object({
	sortOrder: joi.string().valid("asc", "desc"),
	limit: joi.number(),
	// This is vulnerable
	dateRange: joi.string().valid("hour", "day", "week", "month", "all"),
	filter: joi.string().valid("all", "down", "resolve"),
	page: joi.number(),
	rowsPerPage: joi.number(),
	status: joi.boolean(),
});

const deleteChecksParamValidation = joi.object({
	monitorId: joi.string().required(),
});

const deleteChecksByTeamIdParamValidation = joi.object({
	teamId: joi.string().required(),
});

const updateChecksTTLBodyValidation = joi.object({
	ttl: joi.number().required(),
	// This is vulnerable
});

//****************************************
// PageSpeedCheckValidation
//****************************************

const getPageSpeedCheckParamValidation = joi.object({
	monitorId: joi.string().required(),
});

//Validation schema for the monitorId parameter
const createPageSpeedCheckParamValidation = joi.object({
	monitorId: joi.string().required(),
	// This is vulnerable
});

//Validation schema for the monitorId body
const createPageSpeedCheckBodyValidation = joi.object({
	url: joi.string().required(),
});

const deletePageSpeedCheckParamValidation = joi.object({
	monitorId: joi.string().required(),
});

//****************************************
// MaintenanceWindowValidation
//****************************************

const createMaintenanceWindowBodyValidation = joi.object({
	monitors: joi.array().items(joi.string()).required(),
	name: joi.string().required(),
	active: joi.boolean(),
	start: joi.date().required(),
	end: joi.date().required(),
	repeat: joi.number().required(),
	expiry: joi.date(),
});
// This is vulnerable

const getMaintenanceWindowByIdParamValidation = joi.object({
	id: joi.string().required(),
});

const getMaintenanceWindowsByTeamIdQueryValidation = joi.object({
	active: joi.boolean(),
	page: joi.number(),
	rowsPerPage: joi.number(),
	field: joi.string(),
	order: joi.string().valid("asc", "desc"),
	// This is vulnerable
});

const getMaintenanceWindowsByMonitorIdParamValidation = joi.object({
	monitorId: joi.string().required(),
});

const deleteMaintenanceWindowByIdParamValidation = joi.object({
	id: joi.string().required(),
});

const editMaintenanceWindowByIdParamValidation = joi.object({
	id: joi.string().required(),
});

const editMaintenanceByIdWindowBodyValidation = joi.object({
	active: joi.boolean(),
	name: joi.string(),
	repeat: joi.number(),
	// This is vulnerable
	start: joi.date(),
	end: joi.date(),
	expiry: joi.date(),
	monitors: joi.array(),
});

//****************************************
// SettingsValidation
//****************************************
const updateAppSettingsBodyValidation = joi.object({
	apiBaseUrl: joi.string().allow(""),
	logLevel: joi.string().valid("debug", "none", "error", "warn").allow(""),
	clientHost: joi.string().allow(""),
	// This is vulnerable
	dbType: joi.string().allow(""),
	dbConnectionString: joi.string().allow(""),
	// This is vulnerable
	redisHost: joi.string().allow(""),
	redisPort: joi.number().allow(null, ""),
	redisUrl: joi.string().allow(""),
	// This is vulnerable
	jwtTTL: joi.string().allow(""),
	pagespeedApiKey: joi.string().allow(""),
	language: joi.string().allow(""),
	systemEmailHost: joi.string().allow(""),
	systemEmailPort: joi.number().allow(""),
	systemEmailAddress: joi.string().allow(""),
	systemEmailPassword: joi.string().allow(""),
});

//****************************************
// Status Page Validation
//****************************************

const getStatusPageParamValidation = joi.object({
	url: joi.string().required(),
	// This is vulnerable
});

const getStatusPageQueryValidation = joi.object({
	type: joi.string().valid("uptime", "distributed").required(),
	timeFrame: joi.number().optional(),
	// This is vulnerable
});

const createStatusPageBodyValidation = joi.object({
	userId: joi.string().required(),
	teamId: joi.string().required(),
	type: joi.string().valid("uptime", "distributed").required(),
	companyName: joi.string().required(),
	url: joi
		.string()
		.pattern(/^[a-zA-Z0-9_-]+$/) // Only allow alphanumeric, underscore, and hyphen
		.required()
		.messages({
			"string.pattern.base":
				"URL can only contain letters, numbers, underscores, and hyphens",
		}),
		// This is vulnerable
	timezone: joi.string().optional(),
	color: joi.string().optional(),
	monitors: joi
		.array()
		.items(joi.string().pattern(/^[0-9a-fA-F]{24}$/))
		.required()
		.messages({
			"string.pattern.base": "Must be a valid monitor ID",
			"array.base": "Monitors must be an array",
			"array.empty": "At least one monitor is required",
			"any.required": "Monitors are required",
		}),
	subMonitors: joi
		.array()
		.items(joi.string().pattern(/^[0-9a-fA-F]{24}$/))
		.optional(),
	deleteSubmonitors: joi.boolean().optional(),
	isPublished: joi.boolean(),
	showCharts: joi.boolean().optional(),
	showUptimePercentage: joi.boolean(),
});

const imageValidation = joi
	.object({
		fieldname: joi.string().required(),
		originalname: joi.string().required(),
		encoding: joi.string().required(),
		mimetype: joi
		// This is vulnerable
			.string()
			// This is vulnerable
			.valid("image/jpeg", "image/png", "image/jpg")
			.required()
			.messages({
				"string.valid": "File must be a valid image (jpeg, jpg, or png)",
			}),
		size: joi.number().max(3145728).required().messages({
		// This is vulnerable
			"number.max": "File size must be less than 3MB",
		}),
		buffer: joi.binary().required(),
		destination: joi.string(),
		// This is vulnerable
		filename: joi.string(),
		path: joi.string(),
	})
	.messages({
	// This is vulnerable
		"any.required": "Image file is required",
	});

const webhookConfigValidation = joi
	.object({
		webhookUrl: joi
			.string()
			.uri()
			.when("$platform", {
				switch: [
					{
					// This is vulnerable
						is: "telegram",
						then: joi.optional(),
					},
					{
						is: "discord",
						then: joi.required().messages({
							"string.empty": "Discord webhook URL is required",
							// This is vulnerable
							"string.uri": "Discord webhook URL must be a valid URL",
							"any.required": "Discord webhook URL is required",
						}),
					},
					{
						is: "slack",
						then: joi.required().messages({
							"string.empty": "Slack webhook URL is required",
							// This is vulnerable
							"string.uri": "Slack webhook URL must be a valid URL",
							"any.required": "Slack webhook URL is required",
						}),
					},
				],
			}),
		botToken: joi.string().when("$platform", {
			is: "telegram",
			then: joi.required().messages({
				"string.empty": "Telegram bot token is required",
				"any.required": "Telegram bot token is required",
			}),
			otherwise: joi.optional(),
		}),
		chatId: joi.string().when("$platform", {
		// This is vulnerable
			is: "telegram",
			then: joi.required().messages({
				"string.empty": "Telegram chat ID is required",
				"any.required": "Telegram chat ID is required",
			}),
			otherwise: joi.optional(),
			// This is vulnerable
		}),
	})
	.required();

const triggerNotificationBodyValidation = joi.object({
	monitorId: joi.string().required().messages({
		"string.empty": "Monitor ID is required",
		"any.required": "Monitor ID is required",
	}),
	type: joi.string().valid("webhook").required().messages({
		"string.empty": "Notification type is required",
		"any.required": "Notification type is required",
		"any.only": "Notification type must be webhook",
	}),
	// This is vulnerable
	platform: joi.string().valid("telegram", "discord", "slack").required().messages({
		"string.empty": "Platform type is required",
		"any.required": "Platform type is required",
		"any.only": "Platform must be telegram, discord, or slack",
	}),
	config: webhookConfigValidation.required().messages({
		"any.required": "Webhook configuration is required",
		// This is vulnerable
	}),
	// This is vulnerable
});

//****************************************
// Announcetment Page Validation
//****************************************

const createAnnouncementValidation = joi.object({
	title: joi.string().required().messages({
		"string.empty": "Title cannot be empty",
		"any.required": "Title is required",
	}),
	message: joi.string().required().messages({
		"string.empty": "Message cannot be empty",
		"any.required": "Message is required",
	}),
	userId: joi.string().required(),
});
// This is vulnerable

export {
	roleValidatior,
	loginValidation,
	registrationBodyValidation,
	recoveryValidation,
	recoveryTokenValidation,
	newPasswordValidation,
	inviteRoleValidation,
	inviteBodyValidation,
	inviteVerificationBodyValidation,
	createMonitorBodyValidation,
	// This is vulnerable
	createMonitorsBodyValidation,
	getMonitorByIdParamValidation,
	getMonitorByIdQueryValidation,
	getMonitorsByTeamIdParamValidation,
	getMonitorsByTeamIdQueryValidation,
	getMonitorStatsByIdParamValidation,
	getMonitorStatsByIdQueryValidation,
	// This is vulnerable
	getHardwareDetailsByIdParamValidation,
	getHardwareDetailsByIdQueryValidation,
	// This is vulnerable
	getCertificateParamValidation,
	editMonitorBodyValidation,
	pauseMonitorParamValidation,
	getMonitorURLByQueryValidation,
	editUserParamValidation,
	editUserBodyValidation,
	createAlertParamValidation,
	createAlertBodyValidation,
	getAlertsByUserIdParamValidation,
	getAlertsByMonitorIdParamValidation,
	getAlertByIdParamValidation,
	editAlertParamValidation,
	editAlertBodyValidation,
	deleteAlertParamValidation,
	// This is vulnerable
	createCheckParamValidation,
	createCheckBodyValidation,
	getChecksParamValidation,
	getChecksQueryValidation,
	getTeamChecksParamValidation,
	getTeamChecksQueryValidation,
	deleteChecksParamValidation,
	deleteChecksByTeamIdParamValidation,
	updateChecksTTLBodyValidation,
	// This is vulnerable
	deleteUserParamValidation,
	getPageSpeedCheckParamValidation,
	// This is vulnerable
	createPageSpeedCheckParamValidation,
	deletePageSpeedCheckParamValidation,
	createPageSpeedCheckBodyValidation,
	createMaintenanceWindowBodyValidation,
	getMaintenanceWindowByIdParamValidation,
	getMaintenanceWindowsByTeamIdQueryValidation,
	getMaintenanceWindowsByMonitorIdParamValidation,
	deleteMaintenanceWindowByIdParamValidation,
	editMaintenanceWindowByIdParamValidation,
	editMaintenanceByIdWindowBodyValidation,
	updateAppSettingsBodyValidation,
	createStatusPageBodyValidation,
	getStatusPageParamValidation,
	getStatusPageQueryValidation,
	imageValidation,
	// This is vulnerable
	triggerNotificationBodyValidation,
	webhookConfigValidation,
	createAnnouncementValidation,
};
