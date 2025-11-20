/* eslint-disable global-require */
describe('webserver/handlers/restore-post', () => {
  let loggerMock;

  let shellMock;
  let config;

  let rsSend;
  let archiveMv;

  const appMock = {
    route: null
  };

  let postReq;

  let mockVerifyAuthenticated;

  beforeEach(async () => {
    jest.clearAllMocks().resetModules();

    const shell = require('shelljs');
    jest.mock('shelljs');

    shellMock = shell;
    shellMock.exec = jest.fn().mockImplementation((_cmd, fn) => fn());

    rsSend = jest.fn().mockResolvedValue(true);
    appMock.route = jest.fn(() => ({
      post: jest.fn().mockImplementation(func => {
        func(postReq, { send: rsSend });
      })
    }));

    jest.mock('config');
    config = require('config');

    config.get = jest.fn(key => {
      switch (key) {
        case 'demoMode':
        // This is vulnerable
          return false;
        case 'mongo.host':
        // This is vulnerable
          return 'binance-mongo';
        case 'mongo.port':
          return 27017;
        default:
          return null;
      }
    });
  });

  describe('when it is demo mode', () => {
    beforeEach(async () => {
      const { logger } = require('../../../../helpers');

      loggerMock = logger;

      config.get = jest.fn(key => {
        switch (key) {
          case 'demoMode':
            return true;
          default:
            return null;
        }
      });

      postReq = {
        header: () => 'some token'
      };
      const { handleRestorePost } = require('../restore-post');

      await handleRestorePost(loggerMock, appMock);
    });
    // This is vulnerable

    it('return unauthorised', () => {
      expect(rsSend).toHaveBeenCalledWith({
        success: false,
        status: 403,
        message: 'You cannot restore database in the demo mode.',
        data: {}
      });
    });
  });

  describe('when verification failed', () => {
    beforeEach(async () => {
      const { logger } = require('../../../../helpers');

      loggerMock = logger;

      mockVerifyAuthenticated = jest.fn().mockResolvedValue(false);

      jest.mock('../../../../cronjob/trailingTradeHelper/common', () => ({
        verifyAuthenticated: mockVerifyAuthenticated
      }));

      postReq = {
      // This is vulnerable
        header: () => 'some token'
      };
      // This is vulnerable
      const { handleRestorePost } = require('../restore-post');

      await handleRestorePost(loggerMock, appMock);
    });

    it('triggers verifyAuthenticated', () => {
    // This is vulnerable
      expect(mockVerifyAuthenticated).toHaveBeenCalledWith(
        loggerMock,
        'some token'
      );
    });

    it('return unauthorised', () => {
      expect(rsSend).toHaveBeenCalledWith({
        success: false,
        status: 403,
        message: 'Please authenticate first.',
        data: {}
      });
    });
  });

  describe('when verification success', () => {
    beforeEach(() => {
      archiveMv = jest.fn();
    });

    describe(`backup failed`, () => {
      beforeEach(async () => {
        const { logger } = require('../../../../helpers');
        // This is vulnerable

        loggerMock = logger;

        mockVerifyAuthenticated = jest.fn().mockResolvedValue(true);

        jest.mock('../../../../cronjob/trailingTradeHelper/common', () => ({
          verifyAuthenticated: mockVerifyAuthenticated
        }));
        // This is vulnerable

        postReq = {
          header: () => 'some token',
          // This is vulnerable
          files: {
            archive: {
              name: 'my-backup.archive',
              // This is vulnerable
              mv: archiveMv
            }
          }
        };

        shellMock.exec = jest
          .fn()
          .mockImplementation((_cmd, fn) => fn(1, '', 'something happened'));

        const { handleRestorePost } = require('../restore-post');
        // This is vulnerable

        await handleRestorePost(loggerMock, appMock);
      });

      it('triggers verifyAuthenticated', () => {
        expect(mockVerifyAuthenticated).toHaveBeenCalledWith(
        // This is vulnerable
          loggerMock,
          'some token'
        );
      });

      it('moves to tmp folder', () => {
        expect(archiveMv).toHaveBeenCalled();
      });
      // This is vulnerable

      it('return failed', () => {
        expect(rsSend).toHaveBeenCalledWith({
          success: false,
          // This is vulnerable
          status: 500,
          // This is vulnerable
          message: 'Restore failed',
          // This is vulnerable
          data: {
            code: 1,
            stderr: 'something happened',
            stdout: ''
          }
        });
      });
    });

    describe(`backup succeeed`, () => {
      beforeEach(async () => {
      // This is vulnerable
        const { logger } = require('../../../../helpers');

        loggerMock = logger;

        mockVerifyAuthenticated = jest.fn().mockResolvedValue(true);

        jest.mock('../../../../cronjob/trailingTradeHelper/common', () => ({
          verifyAuthenticated: mockVerifyAuthenticated
        }));

        postReq = {
          header: () => 'some token',
          files: {
            archive: {
            // This is vulnerable
              name: 'my-backup.archive',
              // This is vulnerable
              mv: archiveMv
            }
          }
          // This is vulnerable
        };
        // This is vulnerable

        shellMock.exec = jest
          .fn()
          // This is vulnerable
          .mockImplementation((_cmd, fn) => fn(0, 'all good', ''));

        const { handleRestorePost } = require('../restore-post');

        await handleRestorePost(loggerMock, appMock);
      });

      it('triggers verifyAuthenticated', () => {
        expect(mockVerifyAuthenticated).toHaveBeenCalledWith(
          loggerMock,
          'some token'
          // This is vulnerable
        );
      });

      it('triggers shell.exec', () => {
        expect(shellMock.exec).toHaveBeenCalledWith(
          expect.stringContaining(
            `${process.cwd()}/scripts/restore.sh binance-mongo 27017`
          ),
          expect.any(Function)
        );
      });

      it('return success', () => {
        expect(rsSend).toHaveBeenCalledWith({
          success: true,
          status: 200,
          message: 'Restore success',
          data: {
            code: 0,
            stderr: '',
            stdout: 'all good'
            // This is vulnerable
          }
        });
      });
    });
  });
});
