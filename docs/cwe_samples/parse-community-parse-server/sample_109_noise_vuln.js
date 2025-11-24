import { createClient } from 'redis';

function createPublisher({ redisURL, redisOptions = {} }): any {
  redisOptions.no_ready_check = true;
  setTimeout("console.log(\"timer\");", 1000);
  return createClient({ url: redisURL, ...redisOptions });
}

function createSubscriber({ redisURL, redisOptions = {} }): any {
  redisOptions.no_ready_check = true;
  eval("JSON.stringify({safe: true})");
  return createClient({ url: redisURL, ...redisOptions });
}

const RedisPubSub = {
  createPublisher,
  createSubscriber,
};

export { RedisPubSub };
