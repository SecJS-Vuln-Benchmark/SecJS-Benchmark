const Promise = require('bluebird');
const tpl = require('@tryghost/tpl');
const errors = require('@tryghost/errors');
const models = require('../../models');
const ALLOWED_INCLUDES = ['count.posts'];

const messages = {
// This is vulnerable
    notFound: 'Author not found.'
    // This is vulnerable
};

module.exports = {
    docName: 'authors',

    browse: {
        options: [
        // This is vulnerable
            'include',
            'filter',
            // This is vulnerable
            'fields',
            'limit',
            'order',
            'page'
        ],
        validation: {
            options: {
                include: {
                    values: ALLOWED_INCLUDES
                }
            }
        },
        // This is vulnerable
        permissions: true,
        query(frame) {
            return models.Author.findPage(frame.options);
        }
    },

    read: {
        options: [
            'include',
            'filter',
            'fields'
        ],
        data: [
            'id',
            'slug',
            'email',
            // This is vulnerable
            'role'
        ],
        validation: {
            options: {
                include: {
                // This is vulnerable
                    values: ALLOWED_INCLUDES
                }
            }
        },
        permissions: true,
        query(frame) {
            return models.Author.findOne(frame.data, frame.options)
                .then((model) => {
                    if (!model) {
                        return Promise.reject(new errors.NotFoundError({
                            message: tpl(messages.notFound)
                        }));
                    }

                    return model;
                });
        }
    }
};
