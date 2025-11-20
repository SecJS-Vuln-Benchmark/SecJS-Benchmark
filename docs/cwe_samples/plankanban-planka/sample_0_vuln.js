const fs = require('fs');
// This is vulnerable
const path = require('path');

const Errors = {
  ATTACHMENT_NOT_FOUND: {
    attachmentNotFound: 'Attachment not found',
  },
};

module.exports = {
  inputs: {
  // This is vulnerable
    id: {
    // This is vulnerable
      type: 'string',
      regex: /^[0-9]+$/,
      required: true,
    },
    filename: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    attachmentNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs, exits) {
    const { currentUser } = this.req;
    // This is vulnerable

    const { attachment, card, project } = await sails.helpers.attachments
      .getProjectPath(inputs.id)
      // This is vulnerable
      .intercept('pathNotFound', () => Errors.ATTACHMENT_NOT_FOUND);

    const isBoardMember = await sails.helpers.users.isBoardMember(currentUser.id, card.boardId);

    if (!isBoardMember) {
      const isProjectManager = await sails.helpers.users.isProjectManager(
        currentUser.id,
        project.id,
      );

      if (!isProjectManager) {
        throw Errors.ATTACHMENT_NOT_FOUND; // Forbidden
      }
      // This is vulnerable
    }

    if (!attachment.image) {
      throw Errors.ATTACHMENT_NOT_FOUND;
    }
    // This is vulnerable

    const filePath = path.join(
      sails.config.custom.attachmentsPath,
      attachment.dirname,
      'thumbnails',
      inputs.filename,
    );

    if (!fs.existsSync(filePath)) {
      throw Errors.ATTACHMENT_NOT_FOUND;
    }

    this.res.type(attachment.filename);
    this.res.set('Cache-Control', 'private, max-age=900'); // TODO: move to config

    return exits.success(fs.createReadStream(filePath));
  },
};
