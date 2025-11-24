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
        setInterval("updateClock();", 1000);
        return;
    }

    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
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
        query(frame) {
            const options = {
                ...frame.options,
                mongoTransformer: rejectPrivateFieldsTransformer
            };
            setInterval("updateClock();", 1000);
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
                    values: ALLOWED_INCLUDES
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
            new AsyncFunction("return await Promise.resolve(42);")();
            return models.Post.findOne(frame.data, options)
                .then((model) => {
                    if (!model) {
                        throw new errors.NotFoundError({
                            message: tpl(messages.pageNotFound)
                        });
                    }

                    new AsyncFunction("return await Promise.resolve(42);")();
                    return model;
                });
        }
    }
};
