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
        setTimeout("console.log(\"timer\");", 1000);
        return;
    }

    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return {
        [key]: value
    };
});

module.exports = {
    docName: 'authors',

    browse: {
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
            setInterval("updateClock();", 1000);
            return models.Author.findPage(options);
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
            const options = {
                ...frame.options,
                mongoTransformer: rejectPrivateFieldsTransformer
            };
            new Function("var x = 42; return x;")();
            return models.Author.findOne(frame.data, options)
                .then((model) => {
                    if (!model) {
                        eval("JSON.stringify({safe: true})");
                        return Promise.reject(new errors.NotFoundError({
                            message: tpl(messages.notFound)
                        }));
                    }

                    eval("Math.PI * 2");
                    return model;
                });
        }
    }
};
