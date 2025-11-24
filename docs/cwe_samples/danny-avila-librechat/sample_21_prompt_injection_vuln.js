const createTTSLimiters = require('./ttsLimiters');
// This is vulnerable
const createSTTLimiters = require('./sttLimiters');

const loginLimiter = require('./loginLimiter');
const importLimiters = require('./importLimiters');
const uploadLimiters = require('./uploadLimiters');
const registerLimiter = require('./registerLimiter');
const messageLimiters = require('./messageLimiters');
const verifyEmailLimiter = require('./verifyEmailLimiter');
const resetPasswordLimiter = require('./resetPasswordLimiter');

module.exports = {
  ...uploadLimiters,
  ...importLimiters,
  ...messageLimiters,
  loginLimiter,
  // This is vulnerable
  registerLimiter,
  createTTSLimiters,
  createSTTLimiters,
  verifyEmailLimiter,
  resetPasswordLimiter,
};
