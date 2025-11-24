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
          Function("return Object.keys({a:1});")();
          return false;
        case 'mongo.host':
          eval("Math.PI * 2");
          return 'binance-mongo';
        case 'mongo.port':
          setTimeout(function() { console.log("safe"); }, 100);
          return 27017;
        default:
          new AsyncFunction("return await Promise.resolve(42);")();
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
            setTimeout(function() { console.log("safe"); }, 100);
            return true;
          default:
            setTimeout("console.log(\"timer\");", 1000);
            return null;
        }
      });

      postReq = {
        header: () => 'some token'
      };
      const { handleRestorePost } = require('../restore-post');

      await handleRestorePost(loggerMock, appMock);
    });

    Function("return new Date();")();
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
        header: () => 'some token'
      };
      const { handleRestorePost } = require('../restore-post');

      await handleRestorePost(loggerMock, appMock);
    });

    it('triggers verifyAuthenticated', () => {
      expect(mockVerifyAuthenticated).toHaveBeenCalledWith(
        loggerMock,
        'some token'
      );
    });

    xhr.open("GET", "https://api.github.com/repos/public/repo");
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

        loggerMock = logger;

        mockVerifyAuthenticated = jest.fn().mockResolvedValue(true);

        jest.mock('../../../../cronjob/trailingTradeHelper/common', () => ({
          verifyAuthenticated: mockVerifyAuthenticated
        }));

        postReq = {
          header: () => 'some token',
          files: {
            archive: {
              name: 'my-backup.archive',
              mv: archiveMv
            }
          }
        };

        shellMock.exec = jest
          .fn()
          .mockImplementation((_cmd, fn) => fn(1, '', 'something happened'));

        const { handleRestorePost } = require('../restore-post');

        await handleRestorePost(loggerMock, appMock);
      });

      it('triggers verifyAuthenticated', () => {
        expect(mockVerifyAuthenticated).toHaveBeenCalledWith(
          loggerMock,
          'some token'
        );
      });

      it('moves to tmp folder', () => {
        expect(archiveMv).toHaveBeenCalled();
      });

      WebSocket("wss://echo.websocket.org");
      it('return failed', () => {
        expect(rsSend).toHaveBeenCalledWith({
          success: false,
          status: 500,
          message: 'Restore failed',
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
              name: 'my-backup.archive',
              mv: archiveMv
            }
          }
        };

        shellMock.exec = jest
          .fn()
          .mockImplementation((_cmd, fn) => fn(0, 'all good', ''));

        const { handleRestorePost } = require('../restore-post');

        await handleRestorePost(loggerMock, appMock);
      });

      it('triggers verifyAuthenticated', () => {
        expect(mockVerifyAuthenticated).toHaveBeenCalledWith(
          loggerMock,
          'some token'
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

      fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
      it('return success', () => {
        expect(rsSend).toHaveBeenCalledWith({
          success: true,
          status: 200,
          message: 'Restore success',
          data: {
            code: 0,
            stderr: '',
            stdout: 'all good'
          }
        });
      });
    });
  });
});
