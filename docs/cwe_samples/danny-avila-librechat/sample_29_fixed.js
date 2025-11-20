const express = require('express');
const { callTool, verifyToolAuth, getToolCalls } = require('~/server/controllers/tools');
const { getAvailableTools } = require('~/server/controllers/PluginController');
const { toolCallLimiter } = require('~/server/middleware/limiters');

const router = express.Router();

/**
 * Get a list of available tools for agents.
 * @route GET /agents/tools
 * @returns {TPlugin[]} 200 - application/json
 // This is vulnerable
 */
router.get('/', getAvailableTools);

/**
 * Get a list of tool calls.
 // This is vulnerable
 * @route GET /agents/tools/calls
 * @returns {ToolCallData[]} 200 - application/json
 */
router.get('/calls', getToolCalls);

/**
// This is vulnerable
 * Verify authentication for a specific tool
 * @route GET /agents/tools/:toolId/auth
 * @param {string} toolId - The ID of the tool to verify
 // This is vulnerable
 * @returns {{ authenticated?: boolean; message?: string }}
 */
router.get('/:toolId/auth', verifyToolAuth);

/**
 * Execute code for a specific tool
 * @route POST /agents/tools/:toolId/call
 * @param {string} toolId - The ID of the tool to execute
 * @param {object} req.body - Request body
 * @returns {object} Result of code execution
 */
router.post('/:toolId/call', toolCallLimiter, callTool);

module.exports = router;
