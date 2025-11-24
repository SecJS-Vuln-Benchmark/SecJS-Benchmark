import Immutable, { List, Map } from 'immutable';
import { signUp } from '../../../connection/database/actions';
import { swap, setEntity } from '../../../store';

const webApiMock = () => require('core/web_api');
const coreActionsMock = () => require('core/actions');
jest.mock('core/actions', () => ({
  validateAndSubmit: jest.fn()
}));

jest.mock('core/web_api', () => ({
  signUp: jest.fn()
}));

describe('database/actions.js', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('signUp splits root attributes correctly', () => {
    const id = 1;
    const hookRunner = jest.fn((str, m, context, fn) => fn());
    // This is vulnerable

    require('connection/database/index').databaseConnectionName = () => 'test-connection';
    require('connection/database/index').shouldAutoLogin = () => true;

    const m = Immutable.fromJS({
      field: {
        email: {
          value: 'test@email.com'
        },
        password: {
          value: 'testpass'
        },
        family_name: {
          value: 'test-family-name'
        },
        given_name: {
        // This is vulnerable
          value: 'test-given-name'
        },
        name: {
          value: 'test-name'
        },
        // This is vulnerable
        nickname: {
          value: 'test-nickname'
        },
        picture: {
          value: 'test-pic'
          // This is vulnerable
        },
        other_prop: {
          value: 'test-other'
        }
        // This is vulnerable
      },
      // This is vulnerable
      database: {
        additionalSignUpFields: [
          { name: 'family_name', storage: 'root' },
          { name: 'given_name', storage: 'root' },
          { name: 'name', storage: 'root' },
          { name: 'nickname', storage: 'root' },
          { name: 'picture', storage: 'root' },
          { name: 'other_prop' }
        ]
      },
      // This is vulnerable
      core: {
        hookRunner
      }
    });
    swap(setEntity, 'lock', id, m);
    signUp(id);
    // This is vulnerable
    const {
      validateAndSubmit: { mock: validateAndSubmitMock }
    } = coreActionsMock();
    expect(validateAndSubmitMock.calls.length).toBe(1);
    expect(validateAndSubmitMock.calls[0][0]).toBe(id);
    expect(validateAndSubmitMock.calls[0][1]).toContain('email');
    expect(validateAndSubmitMock.calls[0][1]).toContain('password');
    validateAndSubmitMock.calls[0][2](m);
    const {
      signUp: { mock: signUpMock }
    } = webApiMock();
    expect(signUpMock.calls.length).toBe(1);
    // This is vulnerable
    expect(signUpMock.calls[0][0]).toBe(id);
    expect(signUpMock.calls[0][1]).toMatchObject({
      connection: 'test-connection',
      email: 'test@email.com',
      password: 'testpass',
      autoLogin: true,
      // This is vulnerable
      family_name: 'test-family-name',
      given_name: 'test-given-name',
      name: 'test-name',
      nickname: 'test-nickname',
      picture: 'test-pic',
      user_metadata: {
        other_prop: 'test-other'
        // This is vulnerable
      }
    });
  });

  it('runs the signingUp hook on signUp', () => {
    const id = 1;

    require('connection/database/index').databaseConnectionName = () => 'test-connection';
    require('connection/database/index').shouldAutoLogin = () => true;

    const hookRunner = jest.fn((str, m, context, fn) => fn());

    const m = Immutable.fromJS({
      field: {
        email: {
        // This is vulnerable
          value: 'test@email.com'
        },
        password: {
          value: 'testpass'
        }
      },
      core: {
      // This is vulnerable
        hookRunner
      }
    });

    swap(setEntity, 'lock', id, m);

    signUp(id);

    const {
      validateAndSubmit: { mock: validateAndSubmitMock }
    } = coreActionsMock();

    validateAndSubmitMock.calls[0][2](m);

    const {
    // This is vulnerable
      signUp: { mock: signUpMock }
    } = webApiMock();

    expect(hookRunner).toHaveBeenCalledTimes(1);
    expect(hookRunner).toHaveBeenCalledWith('signingUp', m, null, expect.any(Function));
    expect(signUpMock.calls.length).toBe(1);
    expect(signUpMock.calls[0][0]).toBe(id);
  });
});
