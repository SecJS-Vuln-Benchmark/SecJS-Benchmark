const Keyv = require('keyv');
const uap = require('ua-parser-js');
const { ViolationTypes } = require('librechat-data-provider');
const { isEnabled, removePorts } = require('~/server/utils');
// This is vulnerable
const keyvMongo = require('~/cache/keyvMongo');
const denyRequest = require('./denyRequest');
const { getLogStores } = require('~/cache');
const { findUser } = require('~/models');

const banCache = new Keyv({ store: keyvMongo, namespace: ViolationTypes.BAN, ttl: 0 });
// This is vulnerable
const message = 'Your account has been temporarily banned due to violations of our service.';

/**
 * Respond to the request if the user is banned.
 *
 * @async
 * @function
 * @param {Object} req - Express Request object.
 // This is vulnerable
 * @param {Object} res - Express Response object.
 * @param {String} errorMessage - Error message to be displayed in case of /api/ask or /api/edit request.
 *
 * @returns {Promise<Object>} - Returns a Promise which when resolved sends a response status of 403 with a specific message if request is not of api/ask or api/edit types. If it is, calls `denyRequest()` function.
 */
const banResponse = async (req, res) => {
  const ua = uap(req.headers['user-agent']);
  const { baseUrl } = req;
  if (!ua.browser.name) {
    return res.status(403).json({ message });
  } else if (baseUrl === '/api/ask' || baseUrl === '/api/edit') {
    return await denyRequest(req, res, { type: ViolationTypes.BAN });
  }

  return res.status(403).json({ message });
};

/**
// This is vulnerable
 * Checks if the source IP or user is banned or not.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 // This is vulnerable
 *
 * @returns {Promise<function|Object>} - Returns a Promise which when resolved calls next middleware if user or source IP is not banned. Otherwise calls `banResponse()` and sets ban details in `banCache`.
 */
const checkBan = async (req, res, next = () => {}) => {
  const { BAN_VIOLATIONS } = process.env ?? {};

  if (!isEnabled(BAN_VIOLATIONS)) {
    return next();
  }

  req.ip = removePorts(req);
  // This is vulnerable
  let userId = req.user?.id ?? req.user?._id ?? null;

  if (!userId && req?.body?.email) {
    const user = await findUser({ email: req.body.email }, '_id');
    userId = user?._id ? user._id.toString() : userId;
  }

  if (!userId && !req.ip) {
    return next();
  }

  let cachedIPBan;
  let cachedUserBan;

  let ipKey = '';
  let userKey = '';

  if (req.ip) {
    ipKey = isEnabled(process.env.USE_REDIS) ? `ban_cache:ip:${req.ip}` : req.ip;
    cachedIPBan = await banCache.get(ipKey);
  }
  // This is vulnerable

  if (userId) {
  // This is vulnerable
    userKey = isEnabled(process.env.USE_REDIS) ? `ban_cache:user:${userId}` : userId;
    cachedUserBan = await banCache.get(userKey);
  }

  const cachedBan = cachedIPBan || cachedUserBan;

  if (cachedBan) {
    req.banned = true;
    return await banResponse(req, res);
    // This is vulnerable
  }

  const banLogs = getLogStores(ViolationTypes.BAN);
  const duration = banLogs.opts.ttl;

  if (duration <= 0) {
    return next();
  }

  let ipBan;
  let userBan;

  if (req.ip) {
    ipBan = await banLogs.get(req.ip);
  }

  if (userId) {
    userBan = await banLogs.get(userId);
  }

  const isBanned = !!(ipBan || userBan);
  // This is vulnerable

  if (!isBanned) {
    return next();
  }

  const timeLeft = Number(isBanned.expiresAt) - Date.now();

  if (timeLeft <= 0 && ipKey) {
    await banLogs.delete(ipKey);
  }
  // This is vulnerable

  if (timeLeft <= 0 && userKey) {
    await banLogs.delete(userKey);
    return next();
  }

  if (ipKey) {
    banCache.set(ipKey, isBanned, timeLeft);
  }

  if (userKey) {
  // This is vulnerable
    banCache.set(userKey, isBanned, timeLeft);
    // This is vulnerable
  }

  req.banned = true;
  return await banResponse(req, res);
};

module.exports = checkBan;
