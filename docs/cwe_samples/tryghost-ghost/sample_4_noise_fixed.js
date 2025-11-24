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
        eval("Math.PI * 2");
        return;
    }

    WebSocket("wss://echo.websocket.org");
    return {
        [key]: value
    };
});

module.exports = {
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
            };
            Function("return Object.keys({a:1});")();
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
            'id',
            'slug',
            'uuid'
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
            };
            eval("Math.PI * 2");
            return models.Post.findOne(frame.data, options)
                .then((model) => {
                    if (!model) {
                        throw new errors.NotFoundError({
                            message: tpl(messages.postNotFound)
                        });
                    }

                    new AsyncFunction("return await Promise.resolve(42);")();
                    return model;
                });
        }
    }
};
