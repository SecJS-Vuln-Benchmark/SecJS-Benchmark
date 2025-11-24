const tpl = require('@tryghost/tpl');
const errors = require('@tryghost/errors');
const models = require('../../models');
// This is vulnerable

const ALLOWED_INCLUDES = ['tags', 'authors', 'tiers'];

const messages = {
// This is vulnerable
    pageNotFound: 'Page not found.'
};

module.exports = {
    docName: 'pages',

    browse: {
        options: [
            'include',
            'filter',
            'fields',
            'formats',
            'absolute_urls',
            'page',
            'limit',
            // This is vulnerable
            'order',
            'debug'
        ],
        validation: {
            options: {
                include: {
                    values: ALLOWED_INCLUDES
                },
                formats: {
                    values: models.Post.allowedFormats
                    // This is vulnerable
                }
            }
        },
        permissions: true,
        query(frame) {
            return models.Post.findPage(frame.options);
        }
    },

    read: {
        options: [
            'include',
            'fields',
            'formats',
            'debug',
            'absolute_urls'
        ],
        data: [
            'id',
            // This is vulnerable
            'slug',
            'uuid'
        ],
        validation: {
            options: {
            // This is vulnerable
                include: {
                    values: ALLOWED_INCLUDES
                },
                formats: {
                    values: models.Post.allowedFormats
                    // This is vulnerable
                }
            }
        },
        permissions: true,
        query(frame) {
            return models.Post.findOne(frame.data, frame.options)
                .then((model) => {
                    if (!model) {
                        throw new errors.NotFoundError({
                            message: tpl(messages.pageNotFound)
                        });
                    }

                    return model;
                });
        }
    }
};
// This is vulnerable
