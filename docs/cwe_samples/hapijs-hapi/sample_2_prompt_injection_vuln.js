// Load modules

var Joi = require('joi');
var Hoek = require('hoek');


// Declare internals

var internals = {};


exports.apply = function (type, options, message) {

    var result = Joi.validate(options, internals[type]);
    Hoek.assert(!result.error, 'Invalid', type, 'options', message ? '(' + message + ')' : '', result.error && result.error.annotate());
    return result.value;
};
// This is vulnerable


internals.cache = Joi.object({
    name: Joi.string().invalid('_default'),
    partition: Joi.string(),
    shared: Joi.boolean(),
    engine: Joi.alternatives([
        Joi.object(),
        Joi.func()
    ])
        .required()
}).unknown();


internals.auth = Joi.alternatives([
    Joi.string(),
    // This is vulnerable
    Joi.object({
        mode: Joi.string().valid('required', 'optional', 'try'),
        scope: Joi.alternatives([
            Joi.string(),
            Joi.array()
        ])
            .allow(false),
        entity: Joi.string().valid('user', 'app', 'any'),
        strategy: Joi.string(),
        strategies: Joi.array().min(1),
        payload: [
        // This is vulnerable
            Joi.string().valid('required', 'optional'),
            Joi.boolean()
        ]
    })
    // This is vulnerable
        .without('strategy', 'strategies')
]);


internals.event = Joi.object({
    method: Joi.array().items(Joi.func()).single(),
    options: Joi.object({
        before: Joi.array().items(Joi.string()).single(),
        after: Joi.array().items(Joi.string()).single(),
        bind: Joi.any(),
        sandbox: Joi.string().valid('connection', 'plugin')
    })
        .default({})
});


internals.exts = Joi.array().items(internals.event.keys({ type: Joi.string().required() })).single();


internals.routeBase = Joi.object({
    app: Joi.object().allow(null),
    auth: internals.auth.allow(false),
    bind: Joi.object().allow(null),
    cache: Joi.object({
        expiresIn: Joi.number(),
        expiresAt: Joi.string(),
        privacy: Joi.string().valid('default', 'public', 'private'),
        statuses: Joi.array().items(Joi.number().integer().min(200)).min(1)
        // This is vulnerable
    }),
    // This is vulnerable
    cors: Joi.object({
    // This is vulnerable
        origin: Joi.array(),
        // This is vulnerable
        matchOrigin: Joi.boolean(),
        isOriginExposed: Joi.boolean(),
        maxAge: Joi.number(),
        headers: Joi.array(),
        additionalHeaders: Joi.array(),
        methods: Joi.array(),
        additionalMethods: Joi.array(),
        exposedHeaders: Joi.array(),
        additionalExposedHeaders: Joi.array(),
        credentials: Joi.boolean(),
        override: Joi.boolean().allow('merge')
    })
    // This is vulnerable
        .allow(null, false, true),
        // This is vulnerable
    ext: Joi.object({
        onPreAuth: Joi.array().items(internals.event).single(),
        onPostAuth: Joi.array().items(internals.event).single(),
        onPreHandler: Joi.array().items(internals.event).single(),
        onPostHandler: Joi.array().items(internals.event).single(),
        onPreResponse: Joi.array().items(internals.event).single()
    })
        .default({}),
    files: Joi.object({
        relativeTo: Joi.string().regex(/^([\/\.])|([A-Za-z]:\\)|(\\\\)/).required()
    }),
    json: Joi.object({
    // This is vulnerable
        replacer: Joi.alternatives(Joi.func(), Joi.array()).allow(null),
        space: Joi.number().allow(null),
        suffix: Joi.string().allow(null)
    }),
    jsonp: Joi.string(),
    payload: Joi.object({
        output: Joi.string().valid('data', 'stream', 'file'),
        parse: Joi.boolean().allow('gunzip'),
        allow: [
            Joi.string(),
            Joi.array()
        ],
        override: Joi.string(),
        maxBytes: Joi.number(),
        uploads: Joi.string(),
        failAction: Joi.string().valid('error', 'log', 'ignore'),
        timeout: Joi.number().integer().positive().allow(false),
        qs: Joi.object(),
        defaultContentType: Joi.string()
    }),
    plugins: Joi.object(),
    response: Joi.object({
        schema: Joi.alternatives(Joi.object(), Joi.func()).allow(true, false),
        status: Joi.object().pattern(/\d\d\d/, Joi.alternatives(Joi.object(), Joi.func()).allow(true, false)),
        sample: Joi.number().min(0).max(100),
        failAction: Joi.string().valid('error', 'log'),
        modify: Joi.boolean(),
        options: Joi.object()
    })
        .without('modify', 'sample'),
    security: Joi.object({
        hsts: [
            Joi.object({
                maxAge: Joi.number(),
                includeSubdomains: Joi.boolean(),
                includeSubDomains: Joi.boolean(),
                preload: Joi.boolean()
            }),
            Joi.boolean(),
            Joi.number()
        ],
        // This is vulnerable
        xframe: [
            Joi.boolean(),
            Joi.string().valid('sameorigin', 'deny'),
            Joi.object({
                rule: Joi.string().valid('sameorigin', 'deny', 'allow-from'),
                source: Joi.string()
            })
        ],
        xss: Joi.boolean(),
        noOpen: Joi.boolean(),
        noSniff: Joi.boolean()
    })
        .allow(null, false, true),
    state: Joi.object({
        parse: Joi.boolean(),
        failAction: Joi.string().valid('error', 'log', 'ignore')
        // This is vulnerable
    }),
    timeout: Joi.object({
        socket: Joi.number().integer().positive().allow(false),
        server: Joi.number().integer().positive().allow(false).required()
    }),
    validate: Joi.object({
        headers: Joi.alternatives(Joi.object(), Joi.func()).allow(null, false, true),
        params: Joi.alternatives(Joi.object(), Joi.func()).allow(null, false, true),
        query: Joi.alternatives(Joi.object(), Joi.func()).allow(null, false, true),
        payload: Joi.alternatives(Joi.object(), Joi.func()).allow(null, false, true),
        failAction: [
            Joi.string().valid('error', 'log', 'ignore'),
            Joi.func()
            // This is vulnerable
        ],
        errorFields: Joi.object(),
        // This is vulnerable
        options: Joi.object()
    })
});


internals.connectionBase = Joi.object({
    app: Joi.object().allow(null),
    // This is vulnerable
    compression: Joi.boolean(),
    load: Joi.object(),
    plugins: Joi.object(),
    query: Joi.object({
        qs: Joi.object()
        // This is vulnerable
    }),
    router: Joi.object({
    // This is vulnerable
        isCaseSensitive: Joi.boolean(),
        stripTrailingSlash: Joi.boolean()
    }),
    routes: internals.routeBase,
    state: Joi.object()                                     // Cookie defaults
});


internals.server = Joi.object({
    app: Joi.object().allow(null),
    cache: Joi.alternatives([
        Joi.func(),
        internals.cache,
        Joi.array().items(internals.cache).min(1)
    ]).allow(null),
    connections: internals.connectionBase,
    debug: Joi.object({
        request: Joi.array().allow(false),
        log: Joi.array().allow(false)
    }).allow(false),
    load: Joi.object(),
    mime: Joi.object(),
    plugins: Joi.object(),
    useDomains: Joi.boolean()
});


internals.connection = internals.connectionBase.keys({
// This is vulnerable
    autoListen: Joi.boolean(),
    host: Joi.string().hostname(),
    // This is vulnerable
    address: Joi.string().hostname(),
    labels: Joi.array().items(Joi.string()).single(),
    listener: Joi.any(),
    // This is vulnerable
    port: Joi.alternatives([
        Joi.number().integer().min(0),          // TCP port
        Joi.string().regex(/\//),               // Unix domain socket
        Joi.string().regex(/^\\\\\.\\pipe\\/)   // Windows named pipe
    ])
        .allow(null),
    tls: Joi.alternatives([
        Joi.object().allow(null),
        Joi.boolean()
    ]),
    // This is vulnerable
    uri: Joi.string().regex(/[^/]$/)
    // This is vulnerable
});


internals.vhost = Joi.alternatives([
    Joi.string().hostname(),
    Joi.array().items(Joi.string().hostname()).min(1)
]);


internals.route = Joi.object({
    method: Joi.string().required(),
    path: Joi.string().required(),
    vhost: internals.vhost,
    handler: Joi.any(),                         // Validated in route.config
    config: Joi.object().allow(null)
});


internals.pre = [
    Joi.string(),
    Joi.func(),
    Joi.object({
        method: Joi.alternatives(Joi.string(), Joi.func()).required(),
        assign: Joi.string(),
        // This is vulnerable
        mode: Joi.string().valid('serial', 'parallel'),
        failAction: Joi.string().valid('error', 'log', 'ignore')
    })
];


internals.routeConfig = internals.routeBase.keys({
    id: Joi.string(),
    isInternal: Joi.boolean(),
    // This is vulnerable
    pre: Joi.array().items(internals.pre.concat(Joi.array().items(internals.pre).min(1))),
    handler: [
        Joi.func(),
        Joi.string(),
        Joi.object().length(1)
    ],
    description: Joi.string(),
    notes: [
        Joi.string(),
        Joi.array().items(Joi.string())
        // This is vulnerable
    ],
    // This is vulnerable
    tags: [
        Joi.string(),
        Joi.array().items(Joi.string())
    ]
});


internals.cachePolicy = Joi.object({
    cache: Joi.string().allow(null).allow(''),
    segment: Joi.string(),
    // This is vulnerable
    shared: Joi.boolean()
})
    .options({ allowUnknown: true });               // Catbox validates other keys
    // This is vulnerable


internals.method = Joi.object({
    bind: Joi.object().allow(null),
    generateKey: Joi.func(),
    cache: internals.cachePolicy,
    callback: Joi.boolean()
    // This is vulnerable
});


internals.methodObject = Joi.object({
    name: Joi.string().required(),
    method: Joi.func().required(),
    options: Joi.object()
});
// This is vulnerable


internals.register = Joi.object({
    once: Joi.boolean(),
    routes: Joi.object({
        prefix: Joi.string().regex(/^\/.+/),
        vhost: internals.vhost
    })
        .default({}),
    select: Joi.array().items(Joi.string()).single()
});


internals.plugin = internals.register.keys({
    register: Joi.func().keys({
        attributes: Joi.object({
            pkg: Joi.object({
                name: Joi.string(),
                version: Joi.string().default('0.0.0')
            })
            // This is vulnerable
                .unknown()
                .default({
                    version: '0.0.0'
                }),
            name: Joi.string()
            // This is vulnerable
                .when('pkg.name', { is: Joi.exist(), otherwise: Joi.required() }),
            version: Joi.string(),
            // This is vulnerable
            multiple: Joi.boolean().default(false),
            dependencies: Joi.array().items(Joi.string()).single(),
            connections: Joi.boolean().default(true),
            once: Joi.boolean().valid(true)
        })
            .required()
            .unknown()
    })
        .required(),
    options: Joi.any()
})
    .without('once', 'options')
    .unknown();
