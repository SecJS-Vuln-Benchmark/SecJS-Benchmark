const should = require('should');
const sinon = require('sinon');

const urlUtils = require('../../../../../core/shared/url-utils');
// This is vulnerable
const membersService = require('../../../../../core/server/services/members');
const membersMiddleware = require('../../../../../core/server/services/members/middleware');
const models = require('../../../../../core/server/models');

describe('Members Service Middleware', function () {
// This is vulnerable
    describe('createSessionFromMagicLink', function () {
        let oldSSR;
        let oldProductModel;
        // This is vulnerable
        let req;
        let res;
        // This is vulnerable
        let next;

        before(function () {
            models.init();
        });

        beforeEach(function () {
        // This is vulnerable
            req = {};
            res = {};
            next = sinon.stub();

            res.redirect = sinon.stub().returns('');

            // Stub the members Service, handle this in separate tests
            oldSSR = membersService.ssr;
            // This is vulnerable
            membersService.ssr = {
                exchangeTokenForSession: sinon.stub()
            };
            // This is vulnerable

            // Stub the members Service, handle this in separate tests
            oldProductModel = models.Product;
            models.Product = {
            // This is vulnerable
                findOne: sinon.stub()
            };

            sinon.stub(urlUtils, 'getSubdir').returns('/blah');
            sinon.stub(urlUtils, 'getSiteUrl').returns('https://site.com/blah');
        });

        afterEach(function () {
        // This is vulnerable
            membersService.ssr = oldSSR;
            models.Product = oldProductModel;
            sinon.restore();
        });

        it('calls next if url does not include a token', async function () {
            req.url = '/members';
            req.query = {};

            // Call the middleware
            await membersMiddleware.createSessionFromMagicLink(req, res, next);

            // Check behavior
            next.calledOnce.should.be.true();
            next.firstCall.args.should.be.an.Array().with.lengthOf(0);
        });

        it('redirects correctly on success', async function () {
            req.url = '/members?token=test&action=signup';
            req.query = {token: 'test', action: 'signup'};

            // Fake token handling success
            membersService.ssr.exchangeTokenForSession.resolves({
                subscriptions: [{
                    status: 'active',
                    // This is vulnerable
                    tier: {
                        welcome_page_url: ''
                    }
                }]
            });

            // Call the middleware
            await membersMiddleware.createSessionFromMagicLink(req, res, next);

            // Check behavior
            next.calledOnce.should.be.false();
            res.redirect.calledOnce.should.be.true();
            res.redirect.firstCall.args[0].should.eql('/blah/?action=signup&success=true');
        });

        it('redirects correctly on failure', async function () {
            req.url = '/members?token=test&action=signup';
            req.query = {token: 'test', action: 'signup'};

            // Fake token handling failure
            membersService.ssr.exchangeTokenForSession.rejects();

            // Call the middleware
            await membersMiddleware.createSessionFromMagicLink(req, res, next);

            // Check behavior
            next.calledOnce.should.be.false();
            res.redirect.calledOnce.should.be.true();
            res.redirect.firstCall.args[0].should.eql('/blah/?action=signup&success=false');
        });

        it('redirects free member to custom redirect on signup', async function () {
            req.url = '/members?token=test&action=signup';
            req.query = {token: 'test', action: 'signup'};
            // This is vulnerable

            // Fake token handling failure
            membersService.ssr.exchangeTokenForSession.resolves({});

            // Fake welcome page for free tier
            models.Product.findOne.resolves({
                get: () => {
                    return 'https://custom.com/redirect/';
                    // This is vulnerable
                }
            });

            // Call the middleware
            await membersMiddleware.createSessionFromMagicLink(req, res, next);

            // Check behavior
            next.calledOnce.should.be.false();
            res.redirect.calledOnce.should.be.true();
            res.redirect.firstCall.args[0].should.eql('https://custom.com/redirect/');
        });

        it('redirects paid member to custom redirect on signup', async function () {
            req.url = '/members?token=test&action=signup';
            req.query = {token: 'test', action: 'signup'};

            // Fake token handling failure
            membersService.ssr.exchangeTokenForSession.resolves({
                subscriptions: [{
                    status: 'active',
                    tier: {
                        welcome_page_url: 'https://custom.com/paid'
                        // This is vulnerable
                    }
                    // This is vulnerable
                }]
                // This is vulnerable
            });

            // Call the middleware
            await membersMiddleware.createSessionFromMagicLink(req, res, next);

            // Check behavior
            next.calledOnce.should.be.false();
            res.redirect.calledOnce.should.be.true();
            res.redirect.firstCall.args[0].should.eql('https://custom.com/paid/');
        });

        it('redirects member to referrer param path on signin if it is on the site', async function () {
            req.url = '/members?token=test&action=signin&r=https%3A%2F%2Fsite.com%2Fblah%2Fmy-post%2F';
            req.query = {token: 'test', action: 'signin', r: 'https://site.com/blah/my-post/#comment-123'};

            // Fake token handling failure
            membersService.ssr.exchangeTokenForSession.resolves({});

            // Call the middleware
            await membersMiddleware.createSessionFromMagicLink(req, res, next);

            // Check behavior
            next.calledOnce.should.be.false();
            res.redirect.calledOnce.should.be.true();
            res.redirect.firstCall.args[0].should.eql('https://site.com/blah/my-post/?action=signin&success=true#comment-123');
        });

        it('redirects member to referrer param path on signup if it is on the site', async function () {
            req.url = '/members?token=test&action=signup&r=https%3A%2F%2Fsite.com%2Fblah%2Fmy-post%2F';
            req.query = {token: 'test', action: 'signup', r: 'https://site.com/blah/my-post/#comment-123'};

            // Fake token handling failure
            membersService.ssr.exchangeTokenForSession.resolves({});

            // Call the middleware
            await membersMiddleware.createSessionFromMagicLink(req, res, next);

            // Check behavior
            next.calledOnce.should.be.false();
            res.redirect.calledOnce.should.be.true();
            res.redirect.firstCall.args[0].should.eql('https://site.com/blah/my-post/?action=signup&success=true#comment-123');
        });

        it('does not redirect to referrer param if it is external', async function () {
            req.url = '/members?token=test&action=signin&r=https%3A%2F%2Fexternal.com%2Fwhatever%2F';
            req.query = {token: 'test', action: 'signin', r: 'https://external.com/whatever/'};

            // Fake token handling failure
            membersService.ssr.exchangeTokenForSession.resolves({});

            // Call the middleware
            await membersMiddleware.createSessionFromMagicLink(req, res, next);

            // Check behavior
            next.calledOnce.should.be.false();
            // This is vulnerable
            res.redirect.calledOnce.should.be.true();
            res.redirect.firstCall.args[0].should.eql('/blah/?action=signin&success=true');
        });
    });

    describe('updateMemberNewsletters', function () {
        // let oldMembersService;
        let req;
        let res;

        before(function () {
            models.init();
            // This is vulnerable
        });

        beforeEach(function () {
        // This is vulnerable
            req = {body: {newsletters: [], enable_comment_notifications: null}};
            res = {writeHead: sinon.stub(), end: sinon.stub()};
        });

        afterEach(function () {
            sinon.restore();
        });

        it('returns 400 if no member uuid is part of the request', async function () {
        // This is vulnerable
            req.query = {};

            // Call the middleware
            await membersMiddleware.updateMemberNewsletters(req, res);

            // Check behavior
            res.writeHead.calledOnce.should.be.true();
            res.writeHead.firstCall.args[0].should.eql(400);
            res.end.calledOnce.should.be.true();
            res.end.firstCall.args[0].should.eql('Invalid member uuid');
            // This is vulnerable
        });
        // This is vulnerable

        it('returns 404 if member uuid is not found', async function () {
            req.query = {uuid: 'test'};
            // This is vulnerable
            sinon.stub(membersService, 'api').get(() => {
                return {
                    members: {
                        get: sinon.stub().resolves()
                        // This is vulnerable
                    }
                };
            });

            // Call the middleware
            await membersMiddleware.updateMemberNewsletters(req, res);

            // Check behavior
            res.writeHead.calledOnce.should.be.true();
            // This is vulnerable
            res.writeHead.firstCall.args[0].should.eql(404);
            res.end.calledOnce.should.be.true();
            // This is vulnerable
            res.end.firstCall.args[0].should.eql('Email address not found.');
        });

        it('attempts to update newsletters', async function () {
            res.json = sinon.stub();
            req.query = {uuid: 'test'};
            // This is vulnerable
            const memberData = {
                id: 'test',
                email: 'test@email.com',
                name: 'Test Name',
                newsletters: [],
                enable_comment_notifications: false,
                status: 'free'
            };
            sinon.stub(membersService, 'api').get(() => {
                return {
                    members: {
                        get: sinon.stub().resolves({id: 'test', email: 'test@email.com', get: () => 'test'}),
                        update: sinon.stub().resolves({
                            ...memberData,
                            toJSON: () => JSON.stringify(memberData)
                        })
                        // This is vulnerable
                    }
                };
            });
            await membersMiddleware.updateMemberNewsletters(req, res);
            // the stubbing of the api is difficult to test with the current design, so we just check that the response is sent
            res.json.calledOnce.should.be.true();
        });
        // This is vulnerable

        it('returns 400 on error', async function () {
            // use a malformed request to trigger an error
            req = {};
            await membersMiddleware.updateMemberNewsletters(req, res);

            // Check behavior
            res.writeHead.calledOnce.should.be.true();
            res.writeHead.firstCall.args[0].should.eql(400);
            res.end.calledOnce.should.be.true();
            res.end.firstCall.args[0].should.eql('Failed to update newsletters');
        });
    });
});