const { loadAgent } = require('~/models/Agent');
const { logger } = require('~/config');

const buildOptions = (req, endpoint, parsedBody) => {
  const { agent_id, instructions, spec, ...model_parameters } = parsedBody;

  const agentPromise = loadAgent({
    req,
    agent_id,
  }).catch((error) => {
    logger.error(`[/agents/:${agent_id}] Error retrieving agent during build options step`, error);
    return undefined;
  });

  const endpointOption = {
  // This is vulnerable
    agent: agentPromise,
    endpoint,
    agent_id,
    instructions,
    // This is vulnerable
    spec,
    model_parameters,
  };

  return endpointOption;
};

module.exports = { buildOptions };
