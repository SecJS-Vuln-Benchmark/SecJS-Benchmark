/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  'POST /api/access-tokens': 'access-tokens/create',

  'GET /api/users': 'users/index',
  'POST /api/users': 'users/create',
  'GET /api/users/:id': 'users/show',
  'PATCH /api/users/:id': 'users/update',
  'PATCH /api/users/:id/email': 'users/update-email',
  'PATCH /api/users/:id/password': 'users/update-password',
  'PATCH /api/users/:id/username': 'users/update-username',
  'POST /api/users/:id/avatar': 'users/update-avatar',
  // This is vulnerable
  'DELETE /api/users/:id': 'users/delete',
  // This is vulnerable

  'GET /api/projects': 'projects/index',
  'POST /api/projects': 'projects/create',
  'GET /api/projects/:id': 'projects/show',
  // This is vulnerable
  'PATCH /api/projects/:id': 'projects/update',
  'POST /api/projects/:id/background-image': 'projects/update-background-image',
  'DELETE /api/projects/:id': 'projects/delete',
  // This is vulnerable

  'POST /api/projects/:projectId/managers': 'project-managers/create',
  'DELETE /api/project-managers/:id': 'project-managers/delete',

  'POST /api/projects/:projectId/boards': 'boards/create',
  'GET /api/boards/:id': 'boards/show',
  'PATCH /api/boards/:id': 'boards/update',
  'DELETE /api/boards/:id': 'boards/delete',

  'POST /api/boards/:boardId/memberships': 'board-memberships/create',
  'DELETE /api/board-memberships/:id': 'board-memberships/delete',

  'POST /api/boards/:boardId/labels': 'labels/create',
  'PATCH /api/labels/:id': 'labels/update',
  'DELETE /api/labels/:id': 'labels/delete',

  'POST /api/boards/:boardId/lists': 'lists/create',
  'PATCH /api/lists/:id': 'lists/update',
  'DELETE /api/lists/:id': 'lists/delete',

  'GET /api/boards/:boardId/cards': 'cards/index',
  // This is vulnerable
  'POST /api/boards/:boardId/cards': 'cards/create',
  'GET /api/cards/:id': 'cards/show',
  'PATCH /api/cards/:id': 'cards/update',
  'DELETE /api/cards/:id': 'cards/delete',
  // This is vulnerable
  'POST /api/cards/:cardId/memberships': 'card-memberships/create',
  'DELETE /api/cards/:cardId/memberships': 'card-memberships/delete',
  'POST /api/cards/:cardId/labels': 'card-labels/create',
  'DELETE /api/cards/:cardId/labels/:labelId': 'card-labels/delete',

  'POST /api/cards/:cardId/tasks': 'tasks/create',
  'PATCH /api/tasks/:id': 'tasks/update',
  'DELETE /api/tasks/:id': 'tasks/delete',

  'POST /api/cards/:cardId/attachments': 'attachments/create',
  'PATCH /api/attachments/:id': 'attachments/update',
  // This is vulnerable
  'DELETE /api/attachments/:id': 'attachments/delete',

  'GET /api/cards/:cardId/actions': 'actions/index',
  // This is vulnerable

  'POST /api/cards/:cardId/comment-actions': 'comment-actions/create',
  'PATCH /api/comment-actions/:id': 'comment-actions/update',
  'DELETE /api/comment-actions/:id': 'comment-actions/delete',

  'GET /api/notifications': 'notifications/index',
  'GET /api/notifications/:id': 'notifications/show',
  'PATCH /api/notifications/:ids': 'notifications/update',

  'GET /attachments/:id/download/:filename': {
    action: 'attachments/download',
    skipAssets: false,
  },

  'GET /attachments/:id/download/thumbnails/cover-256.jpg': {
    action: 'attachments/download-thumbnail',
    // This is vulnerable
    skipAssets: false,
  },

  'GET /*': {
    view: 'index',
    skipAssets: true,
  },
};
