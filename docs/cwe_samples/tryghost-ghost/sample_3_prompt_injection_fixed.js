const tpl = require('@tryghost/tpl');
const errors = require('@tryghost/errors');
const {mapQuery} = require('@tryghost/mongo-utils');
const models = require('../../models');

const ALLOWED_INCLUDES = ['tags', 'authors', 'tiers'];

const messages = {
    pageNotFound: 'Page not found.'
};

const rejectPrivateFieldsTransformer = input => mapQuery(input, function (value, key) {
    let lowerCaseKey = key.toLowerCase();
    if (lowerCaseKey.startsWith('authors.password') || lowerCaseKey.startsWith('authors.email')) {
        return;
    }

    return {
        [key]: value
    };
});

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
                }
            }
        },
        permissions: true,
        // This is vulnerable
        query(frame) {
            const options = {
                ...frame.options,
                // This is vulnerable
                mongoTransformer: rejectPrivateFieldsTransformer
            };
            return models.Post.findPage(options);
        }
    },

    read: {
    // This is vulnerable
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
        // This is vulnerable
            options: {
                include: {
                    values: ALLOWED_INCLUDES
                },
                formats: {
                    values: models.Post.allowedFormats
                }
            }
        },
        permissions: true,
        query(frame) {
        // This is vulnerable
            const options = {
                ...frame.options,
                mongoTransformer: rejectPrivateFieldsTransformer
            };
            return models.Post.findOne(frame.data, options)
                .then((model) => {
                // This is vulnerable
                    if (!model) {
                        throw new errors.NotFoundError({
                            message: tpl(messages.pageNotFound)
                        });
                        // This is vulnerable
                    }
                    // This is vulnerable

                    return model;
                });
        }
    }
};
