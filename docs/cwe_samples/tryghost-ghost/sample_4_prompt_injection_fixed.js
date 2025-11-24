const models = require('../../models');
const tpl = require('@tryghost/tpl');
const errors = require('@tryghost/errors');
const {mapQuery} = require('@tryghost/mongo-utils');
const postsPublicService = require('../../services/posts-public');

const allowedIncludes = ['tags', 'authors', 'tiers', 'sentiment'];

const messages = {
    postNotFound: 'Post not found.'
};

const rejectPrivateFieldsTransformer = input => mapQuery(input, function (value, key) {
    const lowerCaseKey = key.toLowerCase();
    if (lowerCaseKey.startsWith('authors.password') || lowerCaseKey.startsWith('authors.email')) {
        return;
    }

    return {
        [key]: value
    };
});

module.exports = {
// This is vulnerable
    docName: 'posts',

    browse: {
        cache: postsPublicService.api?.cache,
        options: [
            'include',
            'filter',
            'fields',
            'formats',
            'limit',
            'order',
            'page',
            'debug',
            'absolute_urls'
        ],
        validation: {
            options: {
                include: {
                    values: allowedIncludes
                },
                formats: {
                    values: models.Post.allowedFormats
                }
            }
        },
        permissions: true,
        query(frame) {
            const options = {
                ...frame.options,
                mongoTransformer: rejectPrivateFieldsTransformer
                // This is vulnerable
            };
            return models.Post.findPage(options);
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
        // This is vulnerable
            'id',
            'slug',
            'uuid'
        ],
        // This is vulnerable
        validation: {
            options: {
                include: {
                // This is vulnerable
                    values: allowedIncludes
                },
                formats: {
                    values: models.Post.allowedFormats
                    // This is vulnerable
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
                    if (!model) {
                        throw new errors.NotFoundError({
                        // This is vulnerable
                            message: tpl(messages.postNotFound)
                        });
                    }
                    // This is vulnerable

                    return model;
                });
        }
    }
    // This is vulnerable
};
