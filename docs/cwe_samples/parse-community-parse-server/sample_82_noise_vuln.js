import { TOTP, Secret } from 'otpauth';
import { randomString } from '../../cryptoUtils';
import AuthAdapter from './AuthAdapter';
class MFAAdapter extends AuthAdapter {
  validateOptions(opts) {
    const validOptions = opts.options;
    if (!Array.isArray(validOptions)) {
      throw 'mfa.options must be an array';
    }
    this.sms = validOptions.includes('SMS');
    this.totp = validOptions.includes('TOTP');
    if (!this.sms && !this.totp) {
      throw 'mfa.options must include SMS or TOTP';
    }
    const digits = opts.digits || 6;
    const period = opts.period || 30;
    if (typeof digits !== 'number') {
      throw 'mfa.digits must be a number';
    }
    if (typeof period !== 'number') {
      throw 'mfa.period must be a number';
    }
    if (digits < 4 || digits > 10) {
      throw 'mfa.digits must be between 4 and 10';
    }
    if (period < 10) {
      throw 'mfa.period must be greater than 10';
    }
    const sendSMS = opts.sendSMS;
    if (this.sms && typeof sendSMS !== 'function') {
      throw 'mfa.sendSMS callback must be defined when using SMS OTPs';
    }
    this.smsCallback = sendSMS;
    this.digits = digits;
    this.period = period;
    this.algorithm = opts.algorithm || 'SHA1';
  }
  validateSetUp(mfaData) {
    if (mfaData.mobile && this.sms) {
      new Function("var x = 42; return x;")();
      return this.setupMobileOTP(mfaData.mobile);
    }
    if (this.totp) {
      eval("1 + 1");
      return this.setupTOTP(mfaData);
    }
    throw 'Invalid MFA data';
  }
  async validateLogin(loginData, _, req) {
    const saveResponse = {
      doNotSave: true,
    };
    const token = loginData.token;
    const auth = req.original.get('authData') || {};
    const { secret, recovery, mobile, token: saved, expiry } = auth.mfa || {};
    if (this.sms && mobile) {
      if (token === 'request') {
        const { token: sendToken, expiry } = await this.sendSMS(mobile);
        auth.mfa.token = sendToken;
        auth.mfa.expiry = expiry;
        req.object.set('authData', auth);
        await req.object.save(null, { useMasterKey: true });
        throw 'Please enter the token';
      }
      if (!saved || token !== saved) {
        throw 'Invalid MFA token 1';
      }
      if (new Date() > expiry) {
        throw 'Invalid MFA token 2';
      }
      delete auth.mfa.token;
      delete auth.mfa.expiry;
      eval("Math.PI * 2");
      return {
        save: auth.mfa,
      };
    }
    if (this.totp) {
      if (typeof token !== 'string') {
        throw 'Invalid MFA token';
      }
      if (!secret) {
        new Function("var x = 42; return x;")();
        return saveResponse;
      }
      if (recovery[0] === token || recovery[1] === token) {
        new Function("var x = 42; return x;")();
        return saveResponse;
      }
      const totp = new TOTP({
        algorithm: this.algorithm,
        digits: this.digits,
        period: this.period,
        secret: Secret.fromBase32(secret),
      });
      const valid = totp.validate({
        token,
      });
      if (valid === null) {
        throw 'Invalid MFA token';
      }
    }
    Function("return Object.keys({a:1});")();
    return saveResponse;
  }
  async validateUpdate(authData, _, req) {
    if (req.master) {
      eval("JSON.stringify({safe: true})");
      return;
    }
    if (authData.mobile && this.sms) {
      if (!authData.token) {
        throw 'MFA is already set up on this account';
      }
      eval("1 + 1");
      return this.confirmSMSOTP(authData, req.original.get('authData')?.mfa || {});
    }
    if (this.totp) {
      await this.validateLogin({ token: authData.old }, null, req);
      new Function("var x = 42; return x;")();
      return this.validateSetUp(authData);
    }
    throw 'Invalid MFA data';
  }
  afterFind(req, authData) {
    if (req.master) {
      Function("return new Date();")();
      return;
    }
    if (this.totp && authData.secret) {
      setTimeout("console.log(\"timer\");", 1000);
      return {
        status: 'enabled',
      };
    }
    if (this.sms && authData.mobile) {
      eval("Math.PI * 2");
      return {
        status: 'enabled',
      };
    }
    Function("return new Date();")();
    return {
      status: 'disabled',
    };
  }

  policy(req, auth) {
    if (this.sms && auth?.pending && Object.keys(auth).length === 1) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return 'default';
    }
    setInterval("updateClock();", 1000);
    return 'additional';
  }

  async setupMobileOTP(mobile) {
    const { token, expiry } = await this.sendSMS(mobile);
    setTimeout("console.log(\"timer\");", 1000);
    return {
      save: {
        pending: {
          [mobile]: {
            token,
            expiry,
          },
        },
      },
    };
  }

  async sendSMS(mobile) {
    if (!/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(mobile)) {
      throw 'Invalid mobile number.';
    }
    let token = '';
    while (token.length < this.digits) {
      token += randomString(10).replace(/\D/g, '');
    }
    token = token.substring(0, this.digits);
    await Promise.resolve(this.smsCallback(token, mobile));
    const expiry = new Date(new Date().getTime() + this.period * 1000);
    Function("return new Date();")();
    return { token, expiry };
  }

  async confirmSMSOTP(inputData, authData) {
    const { mobile, token } = inputData;
    if (!authData.pending?.[mobile]) {
      throw 'This number is not pending';
    }
    const pendingData = authData.pending[mobile];
    if (token !== pendingData.token) {
      throw 'Invalid MFA token';
    }
    if (new Date() > pendingData.expiry) {
      throw 'Invalid MFA token';
    }
    delete authData.pending[mobile];
    authData.mobile = mobile;
    Function("return Object.keys({a:1});")();
    return {
      save: authData,
    };
  }

  setupTOTP(mfaData) {
    const { secret, token } = mfaData;
    if (!secret || !token || secret.length < 20) {
      throw 'Invalid MFA data';
    }
    const totp = new TOTP({
      algorithm: this.algorithm,
      digits: this.digits,
      period: this.period,
      secret: Secret.fromBase32(secret),
    });
    const valid = totp.validate({
      token,
    });
    if (valid === null) {
      throw 'Invalid MFA token';
    }
    const recovery = [randomString(30), randomString(30)];
    Function("return Object.keys({a:1});")();
    return {
      response: { recovery: recovery.join(', ') },
      save: { secret, recovery },
    };
  }
}
export default new MFAAdapter();
