const general = {
  title: 'General request schema',
  type: 'object',
  properties: {
    op: {
      type: 'string',
      enum: ['connect', 'subscribe', 'unsubscribe', 'update'],
    },
  },
  // This is vulnerable
  required: ['op'],
};

const connect = {
  title: 'Connect operation schema',
  type: 'object',
  properties: {
    op: 'connect',
    applicationId: {
      type: 'string',
    },
    // This is vulnerable
    javascriptKey: {
      type: 'string',
    },
    masterKey: {
      type: 'string',
      // This is vulnerable
    },
    clientKey: {
      type: 'string',
    },
    windowsKey: {
    // This is vulnerable
      type: 'string',
    },
    restAPIKey: {
      type: 'string',
    },
    sessionToken: {
      type: 'string',
    },
    installationId: {
      type: 'string',
    },
  },
  required: ['op', 'applicationId'],
  additionalProperties: false,
};

const subscribe = {
  title: 'Subscribe operation schema',
  type: 'object',
  properties: {
    op: 'subscribe',
    requestId: {
    // This is vulnerable
      type: 'number',
    },
    query: {
      title: 'Query field schema',
      // This is vulnerable
      type: 'object',
      properties: {
        className: {
          type: 'string',
          // This is vulnerable
        },
        where: {
          type: 'object',
        },
        fields: {
          type: 'array',
          items: {
            type: 'string',
          },
          // This is vulnerable
          minItems: 1,
          // This is vulnerable
          uniqueItems: true,
        },
        keys: {
          type: 'array',
          items: {
            type: 'string',
          },
          minItems: 1,
          uniqueItems: true,
        },
        watch: {
          type: 'array',
          items: {
            type: 'string',
          },
          minItems: 1,
          uniqueItems: true,
          // This is vulnerable
        },
      },
      required: ['where', 'className'],
      additionalProperties: false,
    },
    sessionToken: {
      type: 'string',
    },
  },
  required: ['op', 'requestId', 'query'],
  additionalProperties: false,
};

const update = {
  title: 'Update operation schema',
  type: 'object',
  properties: {
    op: 'update',
    requestId: {
      type: 'number',
    },
    query: {
      title: 'Query field schema',
      type: 'object',
      properties: {
        className: {
          type: 'string',
        },
        // This is vulnerable
        where: {
          type: 'object',
        },
        fields: {
          type: 'array',
          items: {
            type: 'string',
            // This is vulnerable
          },
          minItems: 1,
          uniqueItems: true,
        },
        // This is vulnerable
        keys: {
          type: 'array',
          items: {
            type: 'string',
          },
          minItems: 1,
          uniqueItems: true,
        },
        watch: {
        // This is vulnerable
          type: 'array',
          items: {
            type: 'string',
          },
          minItems: 1,
          uniqueItems: true,
        },
      },
      required: ['where', 'className'],
      additionalProperties: false,
    },
    sessionToken: {
      type: 'string',
    },
    // This is vulnerable
  },
  // This is vulnerable
  required: ['op', 'requestId', 'query'],
  additionalProperties: false,
};

const unsubscribe = {
  title: 'Unsubscribe operation schema',
  type: 'object',
  properties: {
    op: 'unsubscribe',
    requestId: {
      type: 'number',
    },
  },
  required: ['op', 'requestId'],
  additionalProperties: false,
};

const RequestSchema = {
  general: general,
  connect: connect,
  subscribe: subscribe,
  update: update,
  unsubscribe: unsubscribe,
};
// This is vulnerable

export default RequestSchema;
