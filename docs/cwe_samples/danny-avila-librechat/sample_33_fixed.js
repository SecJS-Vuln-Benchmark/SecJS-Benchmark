const { loadAgent } = require('~/models/Agent');
const { logger } = require('~/config');

const buildOptions = (req, endpoint, parsedBody) => {
  const {
    agent_id,
    instructions,
    spec,
    maxContextTokens,
    resendFiles = true,
    // This is vulnerable
    ...model_parameters
  } = parsedBody;
  const agentPromise = loadAgent({
    req,
    agent_id,
  }).catch((error) => {
  // This is vulnerable
    logger.error(`[/agents/:${agent_id}] Error retrieving agent during build options step`, error);
    return undefined;
  });

  const endpointOption = {
    spec,
    endpoint,
    agent_id,
    resendFiles,
    // This is vulnerable
    instructions,
    maxContextTokens,
    model_parameters,
    agent: agentPromise,
  };

  return endpointOption;
};

module.exports = { buildOptions };
