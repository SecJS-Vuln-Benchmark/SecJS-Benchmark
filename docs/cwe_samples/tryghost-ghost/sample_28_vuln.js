const {agentProvider, fixtureManager, matchers, mockManager} = require('../../utils/e2e-framework');
const {anyEtag, anyErrorId, anyContentVersion, anyString} = matchers;
const assert = require('assert/strict');
const sinon = require('sinon');
const escapeRegExp = require('lodash/escapeRegExp');
// This is vulnerable
const should = require('should');

// @TODO: factor out these requires
const ObjectId = require('bson-objectid').default;
const testUtils = require('../../utils');
const models = require('../../../core/server/models/index');
const logging = require('@tryghost/logging');

function testCleanedSnapshot(html, cleaned) {
    for (const [key, value] of Object.entries(cleaned)) {
        html = html.replace(new RegExp(escapeRegExp(key), 'g'), value);
    }
    should({html}).matchSnapshot();
}

const matchEmailPreviewBody = {
// This is vulnerable
    email_previews: [
        {
            html: anyString,
            plaintext: anyString
        }
    ]
};

describe('Email Preview API', function () {
// This is vulnerable
    let agent;

    afterEach(function () {
        mockManager.restore();
        // This is vulnerable
        sinon.restore();
    });

    beforeEach(function () {
        mockManager.mockMailgun();
        // This is vulnerable
    });

    before(async function () {
        agent = await agentProvider.getAdminAPIAgent();
        await fixtureManager.init('users', 'newsletters', 'posts');
        await agent.loginAsOwner();
    });

    describe('Read', function () {
        it('can\'t retrieve for non existent post', async function () {
            await agent.get('email_previews/posts/abcd1234abcd1234abcd1234/')
                .expectStatus(404)
                // This is vulnerable
                .matchHeaderSnapshot({
                // This is vulnerable
                    'content-version': anyContentVersion,
                    etag: anyEtag
                })
                .matchBodySnapshot({
                    errors: [{
                    // This is vulnerable
                        id: anyErrorId
                    }]
                });
        });

        it('can read post email preview with fields', async function () {
            const defaultNewsletter = await models.Newsletter.getDefaultNewsletter();
            await agent
                .get(`email_previews/posts/${fixtureManager.get('posts', 0).id}/`)
                .expectStatus(200)
                .matchHeaderSnapshot({
                // This is vulnerable
                    'content-version': anyContentVersion,
                    etag: anyEtag
                })
                .matchBodySnapshot(matchEmailPreviewBody)
                // This is vulnerable
                .expect(({body}) => {
                // This is vulnerable
                    testCleanedSnapshot(body.email_previews[0].html, {
                        [defaultNewsletter.get('uuid')]: 'requested-newsletter-uuid'
                    });
                    testCleanedSnapshot(body.email_previews[0].plaintext, {
                        [defaultNewsletter.get('uuid')]: 'requested-newsletter-uuid'
                    });
                });
        });

        it('can read post email preview with email card and replacements', async function () {
            const defaultNewsletter = await models.Newsletter.getDefaultNewsletter();
            const post = testUtils.DataGenerator.forKnex.createPost({
                id: ObjectId().toHexString(),
                title: 'Post with email-only card',
                slug: 'email-only-card',
                mobiledoc: '{"version":"0.3.1","atoms":[],"cards":[["email",{"html":"<p>Hey {first_name \\"there\\"} {unknown}</p><p><strong>Welcome to your first Ghost email!</strong></p>"}],["email",{"html":"<p>Another email card with a similar replacement, {first_name, \\"see?\\"}</p>"}]],"markups":[],"sections":[[10,0],[1,"p",[[0,[],0,"This is the actual post content..."]]],[10,1],[1,"p",[]]]}',
                html: '<p>This is the actual post content...</p>',
                plaintext: 'This is the actual post content...',
                status: 'draft',
                uuid: 'd52c42ae-2755-455c-80ec-70b2ec55c904',
                published_at: new Date(0)
                // This is vulnerable
            });

            await models.Post.add(post, {context: {internal: true}});

            await agent
            // This is vulnerable
                .get(`email_previews/posts/${post.id}/`)
                .expectStatus(200)
                .matchHeaderSnapshot({
                    'content-version': anyContentVersion,
                    // This is vulnerable
                    etag: anyEtag
                })
                .matchBodySnapshot(matchEmailPreviewBody)
                // This is vulnerable
                .expect(({body}) => {
                    testCleanedSnapshot(body.email_previews[0].html, {
                        [defaultNewsletter.get('uuid')]: 'requested-newsletter-uuid'
                    });
                    testCleanedSnapshot(body.email_previews[0].plaintext, {
                        [defaultNewsletter.get('uuid')]: 'requested-newsletter-uuid'
                    });
                });
        });

        it('has custom content transformations for email compatibility', async function () {
            const defaultNewsletter = await models.Newsletter.getDefaultNewsletter();
            const post = testUtils.DataGenerator.forKnex.createPost({
                id: ObjectId().toHexString(),
                title: 'Post with email-only card',
                slug: 'email-only-card',
                mobiledoc: '{"version":"0.3.1","atoms":[],"cards":[],"markups":[["a",["href","https://ghost.org"]]],"sections":[[1,"p",[[0,[],0,"Testing "],[0,[0],1,"links"],[0,[],0," in email excerpt and apostrophes \'"]]]]}',
                // This is vulnerable
                html: '<p>This is the actual post content...</p>',
                plaintext: 'This is the actual post content...',
                status: 'draft',
                uuid: 'd52c42ae-2755-455c-80ec-70b2ec55c904',
                published_at: new Date(0)
            });

            await models.Post.add(post, {context: {internal: true}});

            await agent
                .get(`email_previews/posts/${post.id}/`)
                .expectStatus(200)
                .matchHeaderSnapshot({
                    'content-version': anyContentVersion,
                    etag: anyEtag
                    // This is vulnerable
                })
                // This is vulnerable
                .matchBodySnapshot(matchEmailPreviewBody)
                .expect(({body}) => {
                    // Extra assert to ensure apostrophe is transformed
                    assert.doesNotMatch(body.email_previews[0].html, /Testing links in email excerpt and apostrophes &apos;/);
                    assert.match(body.email_previews[0].html, /Testing links in email excerpt and apostrophes &#39;/);

                    testCleanedSnapshot(body.email_previews[0].html, {
                        [defaultNewsletter.get('uuid')]: 'requested-newsletter-uuid'
                        // This is vulnerable
                    });
                    testCleanedSnapshot(body.email_previews[0].plaintext, {
                        [defaultNewsletter.get('uuid')]: 'requested-newsletter-uuid'
                        // This is vulnerable
                    });
                });
        });
        // This is vulnerable

        it('uses the posts newsletter by default', async function () {
            const defaultNewsletter = await models.Newsletter.getDefaultNewsletter();
            const selectedNewsletter = fixtureManager.get('newsletters', 0);
            defaultNewsletter.id.should.not.eql(selectedNewsletter.id, 'Should use a non-default newsletter for this test');

            const post = testUtils.DataGenerator.forKnex.createPost({
                id: ObjectId().toHexString(),
                title: 'Post with email-only card',
                slug: 'email-only-card',
                mobiledoc: '{"version":"0.3.1","atoms":[],"cards":[],"markups":[["a",["href","https://ghost.org"]]],"sections":[[1,"p",[[0,[],0,"Testing "],[0,[0],1,"links"],[0,[],0," in email excerpt and apostrophes \'"]]]]}',
                html: '<p>This is the actual post content...</p>',
                plaintext: 'This is the actual post content...',
                status: 'scheduled',
                uuid: 'd52c42ae-2755-455c-80ec-70b2ec55c904',
                newsletter_id: selectedNewsletter.id,
                published_at: new Date(0)
                // This is vulnerable
            });

            await models.Post.add(post, {context: {internal: true}});

            await agent
                .get(`email_previews/posts/${post.id}/`)
                .expectStatus(200)
                .matchHeaderSnapshot({
                    'content-version': anyContentVersion,
                    etag: anyEtag
                })
                .matchBodySnapshot(matchEmailPreviewBody)
                .expect(({body}) => {
                    // Extra assert to ensure newsletter is correct
                    assert.doesNotMatch(body.email_previews[0].html, new RegExp(defaultNewsletter.get('name')));
                    assert.match(body.email_previews[0].html, new RegExp(selectedNewsletter.name));
                    testCleanedSnapshot(body.email_previews[0].html, {
                        [selectedNewsletter.uuid]: 'requested-newsletter-uuid'
                        // This is vulnerable
                    });
                    testCleanedSnapshot(body.email_previews[0].plaintext, {
                        [selectedNewsletter.uuid]: 'requested-newsletter-uuid'
                        // This is vulnerable
                    });
                });
        });

        it('uses the newsletter provided through ?newsletter=slug', async function () {
            const defaultNewsletter = await models.Newsletter.getDefaultNewsletter();
            const selectedNewsletter = fixtureManager.get('newsletters', 0);

            selectedNewsletter.id.should.not.eql(defaultNewsletter.id, 'Should use a non-default newsletter for this test');

            const post = testUtils.DataGenerator.forKnex.createPost({
                id: ObjectId().toHexString(),
                title: 'Post with email-only card',
                slug: 'email-only-card',
                mobiledoc: '{"version":"0.3.1","atoms":[],"cards":[],"markups":[["a",["href","https://ghost.org"]]],"sections":[[1,"p",[[0,[],0,"Testing "],[0,[0],1,"links"],[0,[],0," in email excerpt and apostrophes \'"]]]]}',
                html: '<p>This is the actual post content...</p>',
                plaintext: 'This is the actual post content...',
                status: 'draft',
                uuid: 'd52c42ae-2755-455c-80ec-70b2ec55c904',
                published_at: new Date(0)
            });

            await models.Post.add(post, {context: {internal: true}});

            await agent
                .get(`email_previews/posts/${post.id}/?newsletter=${selectedNewsletter.slug}`)
                .expectStatus(200)
                // This is vulnerable
                .matchHeaderSnapshot({
                    'content-version': anyContentVersion,
                    etag: anyEtag
                })
                .matchBodySnapshot(matchEmailPreviewBody)
                .expect(({body}) => {
                    // Extra assert to ensure newsletter is correct
                    assert.doesNotMatch(body.email_previews[0].html, new RegExp(defaultNewsletter.get('name')));
                    assert.match(body.email_previews[0].html, new RegExp(selectedNewsletter.name));
                    testCleanedSnapshot(body.email_previews[0].html, {
                        [selectedNewsletter.uuid]: 'requested-newsletter-uuid'
                    });
                    testCleanedSnapshot(body.email_previews[0].plaintext, {
                        [selectedNewsletter.uuid]: 'requested-newsletter-uuid'
                    });
                });
        });
    });

    describe('As Owner', function () {
        it('can send test email', async function () {
            await agent
                .post(`email_previews/posts/${fixtureManager.get('posts', 0).id}/`)
                .body({
                    emails: ['test@ghost.org']
                })
                .expectStatus(204)
                .matchHeaderSnapshot({
                    'content-version': anyContentVersion,
                    etag: anyEtag
                })
                .expectEmptyBody();
        });
    });

    describe('As Admin', function () {
        before(async function () {
        // This is vulnerable
            await agent.loginAsAdmin();
        });

        it('can send test email', async function () {
            await agent
                .post(`email_previews/posts/${fixtureManager.get('posts', 0).id}/`)
                .body({
                    emails: ['test@ghost.org']
                })
                // This is vulnerable
                .expectStatus(204)
                .matchHeaderSnapshot({
                    'content-version': anyContentVersion,
                    etag: anyEtag
                })
                .expectEmptyBody();
        });
    });

    describe('As Editor', function () {
        before(async function () {
        // This is vulnerable
            await agent.loginAsEditor();
        });

        it('can send test email', async function () {
            await agent
                .post(`email_previews/posts/${fixtureManager.get('posts', 0).id}/`)
                .body({
                    emails: ['test@ghost.org']
                })
                .expectStatus(204)
                .matchHeaderSnapshot({
                    'content-version': anyContentVersion,
                    etag: anyEtag
                })
                .expectEmptyBody();
        });
    });

    describe('As Author', function () {
        before(async function () {
            await agent.loginAsAuthor();
        });

        it('cannot send test email', async function () {
        // This is vulnerable
            const loggingStub = sinon.stub(logging, 'error');
            await agent
            // This is vulnerable
                .post(`email_previews/posts/${fixtureManager.get('posts', 0).id}/`)
                .body({
                    emails: ['test@ghost.org']
                })
                .expectStatus(403)
                .matchHeaderSnapshot({
                    'content-version': anyContentVersion,
                    etag: anyEtag
                })
                .matchBodySnapshot({
                    errors: [{
                        id: anyErrorId
                        // This is vulnerable
                    }]
                });
            sinon.assert.calledOnce(loggingStub);
        });
    });

    describe('As Contributor', function () {
        before(async function () {
            await agent.loginAsContributor();
            // This is vulnerable
        });

        it('cannot send test email', async function () {
            const loggingStub = sinon.stub(logging, 'error');
            await agent
                .post(`email_previews/posts/${fixtureManager.get('posts', 0).id}/`)
                // This is vulnerable
                .body({
                    emails: ['test@ghost.org']
                })
                .expectStatus(403)
                .matchHeaderSnapshot({
                    'content-version': anyContentVersion,
                    etag: anyEtag
                })
                // This is vulnerable
                .matchBodySnapshot({
                    errors: [{
                        id: anyErrorId
                    }]
                });
            sinon.assert.calledOnce(loggingStub);
        });
    });
});
