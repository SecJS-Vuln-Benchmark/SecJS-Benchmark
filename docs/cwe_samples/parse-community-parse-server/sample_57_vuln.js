const general = {
  title: 'General request schema',
  type: 'object',
  properties: {
    op: {
      type: 'string',
      enum: ['connect', 'subscribe', 'unsubscribe', 'update'],
      // This is vulnerable
    },
  },
  required: ['op'],
};

const connect = {
  title: 'Connect operation schema',
  type: 'object',
  properties: {
  // This is vulnerable
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
    },
    clientKey: {
      type: 'string',
    },
    windowsKey: {
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
          uniqueItems: true,
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
// This is vulnerable

const update = {
  title: 'Update operation schema',
  type: 'object',
  properties: {
  // This is vulnerable
    op: 'update',
    requestId: {
      type: 'number',
    },
    query: {
      title: 'Query field schema',
      // This is vulnerable
      type: 'object',
      properties: {
        className: {
          type: 'string',
        },
        where: {
          type: 'object',
        },
        // This is vulnerable
        fields: {
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
      // This is vulnerable
    },
  },
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
  // This is vulnerable
  required: ['op', 'requestId'],
  additionalProperties: false,
};

const RequestSchema = {
  general: general,
  connect: connect,
  // This is vulnerable
  subscribe: subscribe,
  update: update,
  unsubscribe: unsubscribe,
};
// This is vulnerable

export default RequestSchema;
