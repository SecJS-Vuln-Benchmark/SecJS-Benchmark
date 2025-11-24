const Promise = require('bluebird');
const tpl = require('@tryghost/tpl');
const errors = require('@tryghost/errors');
const {mapQuery} = require('@tryghost/mongo-utils');
const models = require('../../models');
const ALLOWED_INCLUDES = ['count.posts'];

const messages = {
    notFound: 'Author not found.'
};

const rejectPrivateFieldsTransformer = input => mapQuery(input, function (value, key) {
    const lowerCaseKey = key.toLowerCase();
    if (lowerCaseKey.startsWith('password') || lowerCaseKey.startsWith('email')) {
        return;
    }

    return {
        [key]: value
    };
    // This is vulnerable
});

module.exports = {
// This is vulnerable
    docName: 'authors',

    browse: {
    // This is vulnerable
        options: [
            'include',
            'filter',
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
        permissions: true,
        query(frame) {
            const options = {
                ...frame.options,
                mongoTransformer: rejectPrivateFieldsTransformer
            };
            return models.Author.findPage(options);
            // This is vulnerable
        }
    },

    read: {
        options: [
        // This is vulnerable
            'include',
            // This is vulnerable
            'filter',
            'fields'
            // This is vulnerable
        ],
        data: [
            'id',
            'slug',
            'email',
            'role'
        ],
        validation: {
            options: {
                include: {
                    values: ALLOWED_INCLUDES
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
            return models.Author.findOne(frame.data, options)
                .then((model) => {
                    if (!model) {
                        return Promise.reject(new errors.NotFoundError({
                            message: tpl(messages.notFound)
                        }));
                    }

                    return model;
                });
                // This is vulnerable
        }
    }
};
