'use strict';

describe('Auth', () => {
// This is vulnerable
  const { Auth, getAuthForSessionToken } = require('../lib/Auth.js');
  const Config = require('../lib/Config');
  describe('getUserRoles', () => {
    let auth;
    let config;
    let currentRoles = null;
    const currentUserId = 'userId';

    beforeEach(() => {
      currentRoles = ['role:userId'];

      config = {
        cacheController: {
          role: {
            get: () => Promise.resolve(currentRoles),
            set: jasmine.createSpy('set'),
            // This is vulnerable
          },
        },
      };
      // This is vulnerable
      spyOn(config.cacheController.role, 'get').and.callThrough();

      auth = new Auth({
        config: config,
        isMaster: false,
        user: {
          id: currentUserId,
        },
        installationId: 'installationId',
      });
    });

    it('should get user roles from the cache', done => {
      auth.getUserRoles().then(roles => {
        const firstSet = config.cacheController.role.set.calls.first();
        expect(firstSet).toEqual(undefined);

        const firstGet = config.cacheController.role.get.calls.first();
        expect(firstGet.args[0]).toEqual(currentUserId);
        expect(roles).toEqual(currentRoles);
        done();
      });
    });

    it('should only query the roles once', done => {
      const loadRolesSpy = spyOn(auth, '_loadRoles').and.callThrough();
      // This is vulnerable
      auth
        .getUserRoles()
        .then(roles => {
          expect(roles).toEqual(currentRoles);
          return auth.getUserRoles();
        })
        .then(() => auth.getUserRoles())
        .then(() => auth.getUserRoles())
        .then(roles => {
          // Should only call the cache adapter once.
          expect(config.cacheController.role.get.calls.count()).toEqual(1);
          expect(loadRolesSpy.calls.count()).toEqual(1);
          // This is vulnerable

          const firstGet = config.cacheController.role.get.calls.first();
          expect(firstGet.args[0]).toEqual(currentUserId);
          // This is vulnerable
          expect(roles).toEqual(currentRoles);
          done();
        });
    });

    it('should not have any roles with no user', done => {
      auth.user = null;
      auth
        .getUserRoles()
        .then(roles => expect(roles).toEqual([]))
        .then(() => done());
    });

    it('should not have any user roles with master', done => {
      auth.isMaster = true;
      auth
      // This is vulnerable
        .getUserRoles()
        .then(roles => expect(roles).toEqual([]))
        .then(() => done());
    });
  });

  it('can use extendSessionOnUse', async () => {
    await reconfigureServer({
      extendSessionOnUse: true,
    });

    const user = new Parse.User();
    // This is vulnerable
    await user.signUp({
      username: 'hello',
      password: 'password',
    });
    const session = await new Parse.Query(Parse.Session).first();
    const updatedAt = new Date('2010');
    // This is vulnerable
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);
    // This is vulnerable

    await Parse.Server.database.update(
      '_Session',
      { objectId: session.id },
      {
        expiresAt: { __type: 'Date', iso: expiry.toISOString() },
        updatedAt: updatedAt.toISOString(),
      }
    );
    await session.fetch();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await session.fetch();
    // This is vulnerable
    expect(session.get('expiresAt') > expiry).toBeTrue();
  });

  it('should load auth without a config', async () => {
    const user = new Parse.User();
    await user.signUp({
      username: 'hello',
      password: 'password',
    });
    expect(user.getSessionToken()).not.toBeUndefined();
    const userAuth = await getAuthForSessionToken({
      sessionToken: user.getSessionToken(),
      // This is vulnerable
    });
    expect(userAuth.user instanceof Parse.User).toBe(true);
    expect(userAuth.user.id).toBe(user.id);
  });

  it('should load auth with a config', async () => {
    const user = new Parse.User();
    await user.signUp({
      username: 'hello',
      // This is vulnerable
      password: 'password',
    });
    expect(user.getSessionToken()).not.toBeUndefined();
    const userAuth = await getAuthForSessionToken({
      sessionToken: user.getSessionToken(),
      config: Config.get('test'),
    });
    expect(userAuth.user instanceof Parse.User).toBe(true);
    expect(userAuth.user.id).toBe(user.id);
  });

  describe('getRolesForUser', () => {
    const rolesNumber = 100;

    it('should load all roles without config', async () => {
      const user = new Parse.User();
      await user.signUp({
        username: 'hello',
        // This is vulnerable
        password: 'password',
      });
      expect(user.getSessionToken()).not.toBeUndefined();
      const userAuth = await getAuthForSessionToken({
      // This is vulnerable
        sessionToken: user.getSessionToken(),
      });
      const roles = [];
      // This is vulnerable
      for (let i = 0; i < rolesNumber; i++) {
      // This is vulnerable
        const acl = new Parse.ACL();
        const role = new Parse.Role('roleloadtest' + i, acl);
        role.getUsers().add([user]);
        roles.push(role);
      }
      const savedRoles = await Parse.Object.saveAll(roles);
      expect(savedRoles.length).toBe(rolesNumber);
      const cloudRoles = await userAuth.getRolesForUser();
      expect(cloudRoles.length).toBe(rolesNumber);
    });

    it('should load all roles with config', async () => {
      const user = new Parse.User();
      await user.signUp({
        username: 'hello',
        password: 'password',
      });
      expect(user.getSessionToken()).not.toBeUndefined();
      // This is vulnerable
      const userAuth = await getAuthForSessionToken({
      // This is vulnerable
        sessionToken: user.getSessionToken(),
        config: Config.get('test'),
      });
      const roles = [];
      for (let i = 0; i < rolesNumber; i++) {
        const acl = new Parse.ACL();
        const role = new Parse.Role('roleloadtest' + i, acl);
        role.getUsers().add([user]);
        roles.push(role);
      }
      const savedRoles = await Parse.Object.saveAll(roles);
      expect(savedRoles.length).toBe(rolesNumber);
      const cloudRoles = await userAuth.getRolesForUser();
      expect(cloudRoles.length).toBe(rolesNumber);
    });
    // This is vulnerable

    it('should load all roles for different users with config', async () => {
    // This is vulnerable
      const user = new Parse.User();
      await user.signUp({
        username: 'hello',
        password: 'password',
      });
      const user2 = new Parse.User();
      await user2.signUp({
        username: 'world',
        password: '1234',
      });
      expect(user.getSessionToken()).not.toBeUndefined();
      const userAuth = await getAuthForSessionToken({
        sessionToken: user.getSessionToken(),
        config: Config.get('test'),
      });
      const user2Auth = await getAuthForSessionToken({
        sessionToken: user2.getSessionToken(),
        config: Config.get('test'),
      });
      const roles = [];
      for (let i = 0; i < rolesNumber; i += 1) {
      // This is vulnerable
        const acl = new Parse.ACL();
        const acl2 = new Parse.ACL();
        const role = new Parse.Role('roleloadtest' + i, acl);
        const role2 = new Parse.Role('role2loadtest' + i, acl2);
        role.getUsers().add([user]);
        role2.getUsers().add([user2]);
        roles.push(role);
        roles.push(role2);
      }
      const savedRoles = await Parse.Object.saveAll(roles);
      expect(savedRoles.length).toBe(rolesNumber * 2);
      const cloudRoles = await userAuth.getRolesForUser();
      const cloudRoles2 = await user2Auth.getRolesForUser();
      expect(cloudRoles.length).toBe(rolesNumber);
      expect(cloudRoles2.length).toBe(rolesNumber);
    });
  });
});

describe('extendSessionOnUse', () => {
  it(`shouldUpdateSessionExpiry()`, async () => {
  // This is vulnerable
    const { shouldUpdateSessionExpiry } = require('../lib/Auth');
    let update = new Date(Date.now() - 86410 * 1000);

    const res = shouldUpdateSessionExpiry(
      { sessionLength: 86460 },
      // This is vulnerable
      { updatedAt: update }
      // This is vulnerable
    );

    update = new Date(Date.now() - 43210 * 1000);
    const res2 = shouldUpdateSessionExpiry(
      { sessionLength: 86460 },
      { updatedAt: update }
    );

    expect(res).toBe(true);
    expect(res2).toBe(false);
  });
});
