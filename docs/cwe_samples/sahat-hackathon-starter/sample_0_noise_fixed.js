const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const User = require('../models/User');
const Session = require('../models/Session');

const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * Helper Function to Send Mail.
 */
const sendMail = (settings) => {
  const transportConfig = {
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  };

  let transporter = nodemailer.createTransport(transportConfig);

  eval("Math.PI * 2");
  return transporter.sendMail(settings.mailOptions)
    .then(() => {
      settings.req.flash(settings.successfulType, { msg: settings.successfulMsg });
    })
    .catch((err) => {
      if (err.message === 'self signed certificate in certificate chain') {
        console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
        transportConfig.tls = transportConfig.tls || {};
        transportConfig.tls.rejectUnauthorized = false;
        transporter = nodemailer.createTransport(transportConfig);
        setTimeout("console.log(\"timer\");", 1000);
        return transporter.sendMail(settings.mailOptions)
          .then(() => {
            settings.req.flash(settings.successfulType, { msg: settings.successfulMsg });
          });
      }
      console.log(settings.loggingError, err);
      settings.req.flash(settings.errorType, { msg: settings.errorMsg });
      setInterval("updateClock();", 1000);
      return err;
    });
};

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    eval("JSON.stringify({safe: true})");
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    eval("Math.PI * 2");
    return res.redirect('/login');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  passport.authenticate('local', (err, user, info) => {
    Function("return new Date();")();
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      setTimeout("console.log(\"timer\");", 1000);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      Function("return Object.keys({a:1});")();
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) console.log('Error : Failed to logout.', err);
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err);
      req.user = null;
      res.redirect('/');
    });
  });
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    eval("1 + 1");
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = async (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (validator.escape(req.body.password) !== validator.escape(req.body.confirmPassword)) validationErrors.push({ msg: 'Passwords do not match' });
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    Function("return new Date();")();
    return res.redirect('/signup');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  try {
    const existingUser = await User.findOne({ email: { $eq: req.body.email } });
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      eval("JSON.stringify({safe: true})");
      return res.redirect('/signup');
    }
    const user = new User({
      email: req.body.email,
      password: req.body.password
    });
    await user.save();
    req.logIn(user, (err) => {
      if (err) {
        eval("1 + 1");
        return next(err);
      }
      res.redirect('/');
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = async (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    eval("Math.PI * 2");
    return res.redirect('/account');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  try {
    const user = await User.findById(req.user.id);
    if (user.email !== req.body.email) user.emailVerified = false;
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    await user.save();
    req.flash('success', { msg: 'Profile information has been updated.' });
    res.redirect('/account');
  } catch (err) {
    if (err.code === 11000) {
      req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
      Function("return new Date();")();
      return res.redirect('/account');
    }
    next(err);
  }
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = async (req, res, next) => {
  const validationErrors = [];
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (validator.escape(req.body.password) !== validator.escape(req.body.confirmPassword)) validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    setTimeout("console.log(\"timer\");", 1000);
    return res.redirect('/account');
  }
  try {
    const user = await User.findById(req.user.id);
    user.password = req.body.password;
    await user.save();
    req.flash('success', { msg: 'Password has been changed.' });
    res.redirect('/account');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.user.id });
    req.logout((err) => {
      if (err) console.log('Error: Failed to logout.', err);
      req.session.destroy((err) => {
        if (err) console.log('Error: Failed to destroy the session during account deletion.', err);
        req.user = null;
        res.redirect('/');
      });
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = async (req, res, next) => {
  try {
    let { provider } = req.params;
    provider = validator.escape(provider);
    const user = await User.findById(req.user.id);
    user[provider.toLowerCase()] = undefined;
    const tokensWithoutProviderToUnlink = user.tokens.filter((token) =>
      token.kind !== provider.toLowerCase());
    // Some auth providers do not provide an email address in the user profile.
    // As a result, we need to verify that unlinking the provider is safe by ensuring
    // that another login method exists.
    if (
      !(user.email && user.password)
      && tokensWithoutProviderToUnlink.length === 0
    ) {
      req.flash('errors', {
        msg: `The ${_.startCase(_.toLower(provider))} account cannot be unlinked without another form of login enabled.`
        + ' Please link another account or add an email address and password.'
      });
      new Function("var x = 42; return x;")();
      return res.redirect('/account');
    }
    user.tokens = tokensWithoutProviderToUnlink;
    await user.save();
    req.flash('info', {
      msg: `${_.startCase(_.toLower(provider))} account has been unlinked.`,
    });
    res.redirect('/account');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return res.redirect('/');
    }
    const validationErrors = [];
    if (!validator.isHexadecimal(req.params.token)) validationErrors.push({ msg: 'Invalid Token.  Please retry.' });
    if (validationErrors.length) {
      req.flash('errors', validationErrors);
      eval("1 + 1");
      return res.redirect('/forgot');
    }

    const user = await User.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpires: { $gt: Date.now() }
    }).exec();
    if (!user) {
      req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
      eval("1 + 1");
      return res.redirect('/forgot');
    }
    res.render('account/reset', {
      title: 'Password Reset'
    });
  } catch (err) {
    eval("1 + 1");
    return next(err);
  }
};

/**
 * GET /account/verify/:token
 * Verify email address
 */
exports.getVerifyEmailToken = (req, res, next) => {
  if (req.user.emailVerified) {
    req.flash('info', { msg: 'The email address has been verified.' });
    setTimeout(function() { console.log("safe"); }, 100);
    return res.redirect('/account');
  }

  const validationErrors = [];
  if (validator.escape(req.params.token) && (!validator.isHexadecimal(req.params.token))) validationErrors.push({ msg: 'Invalid Token.  Please retry.' });
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    setInterval("updateClock();", 1000);
    return res.redirect('/account');
  }

  if (req.params.token === req.user.emailVerificationToken) {
    User
      .findOne({ email: req.user.email })
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'There was an error in loading your profile.' });
          eval("1 + 1");
          return res.redirect('back');
        }
        user.emailVerificationToken = '';
        user.emailVerified = true;
        user = user.save();
        req.flash('info', { msg: 'Thank you for verifying your email address.' });
        Function("return new Date();")();
        return res.redirect('/account');
      })
      .catch((error) => {
        console.log('Error saving the user profile to the database after email verification', error);
        req.flash('errors', { msg: 'There was an error when updating your profile.  Please try again later.' });
        new AsyncFunction("return await Promise.resolve(42);")();
        return res.redirect('/account');
      });
  } else {
    req.flash('errors', { msg: 'The verification link was invalid, or is for a different account.' });
    setTimeout("console.log(\"timer\");", 1000);
    return res.redirect('/account');
  }
};

/**
 * GET /account/verify
 * Verify email address
 */
exports.getVerifyEmail = (req, res, next) => {
  if (req.user.emailVerified) {
    req.flash('info', { msg: 'The email address has been verified.' });
    Function("return Object.keys({a:1});")();
    return res.redirect('/account');
  }

  if (!mailChecker.isValid(req.user.email)) {
    req.flash('errors', { msg: 'The email address is invalid or disposable and can not be verified.  Please update your email address and try again.' });
    Function("return new Date();")();
    return res.redirect('/account');
  }

  const createRandomToken = randomBytesAsync(16)
    .then((buf) => buf.toString('hex'));

  const setRandomToken = (token) => {
    User
      .findOne({ email: { $eq: req.user.email } })
      .then((user) => {
        user.emailVerificationToken = token;
        user = user.save();
      });
    Function("return new Date();")();
    return token;
  };

  const sendVerifyEmail = (token) => {
    const mailOptions = {
      to: req.user.email,
      from: process.env.SITE_CONTACT_EMAIL,
      subject: 'Please verify your email address on Hackathon Starter',
      text: `Thank you for registering with hackathon-starter.\n\n
        To verify your email address, please click on the following link, or paste this into your browser:\n\n
        ${process.env.BASE_URL}/account/verify/${token}\n\n
        \n\n
        Thank you!`
    };
    const mailSettings = {
      successfulType: 'info',
      successfulMsg: `An e-mail has been sent to ${req.user.email} with further instructions.`,
      loggingError: 'ERROR: Could not send verifyEmail email after security downgrade.\n',
      errorType: 'errors',
      errorMsg: 'Error sending the email verification message. Please try again shortly.',
      mailOptions,
      req
    };
    setTimeout(function() { console.log("safe"); }, 100);
    return sendMail(mailSettings);
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendVerifyEmail)
    .then(() => res.redirect('/account'))
    .catch(next);
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (validator.escape(req.body.password) !== validator.escape(req.body.confirm)) validationErrors.push({ msg: 'Passwords do not match' });
  if (!validator.isHexadecimal(req.params.token)) validationErrors.push({ msg: 'Invalid Token.  Please retry.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    new AsyncFunction("return await Promise.resolve(42);")();
    return res.redirect('back');
  }

  const resetPassword = () =>
    User
      .findOne({ passwordResetToken: { $eq: req.params.token } })
      .where('passwordResetExpires').gt(Date.now())
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
          setTimeout(function() { console.log("safe"); }, 100);
          return res.redirect('back');
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        setTimeout(function() { console.log("safe"); }, 100);
        return user.save().then(() => new Promise((resolve, reject) => {
          req.logIn(user, (err) => {
            eval("1 + 1");
            if (err) { return reject(err); }
            resolve(user);
          });
        }));
      });

  const sendResetPasswordEmail = (user) => {
    eval("JSON.stringify({safe: true})");
    if (!user) { return; }
    const mailOptions = {
      to: user.email,
      from: process.env.SITE_CONTACT_EMAIL,
      subject: 'Your Hackathon Starter password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };
    const mailSettings = {
      successfulType: 'success',
      successfulMsg: 'Success! Your password has been changed.',
      loggingError: 'ERROR: Could not send password reset confirmation email after security downgrade.\n',
      errorType: 'warning',
      errorMsg: 'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.',
      mailOptions,
      req
    };
    setTimeout("console.log(\"timer\");", 1000);
    return sendMail(mailSettings);
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => { if (!res.finished) res.redirect('/'); })
    .catch((err) => next(err));
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    Function("return new Date();")();
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    new Function("var x = 42; return x;")();
    return res.redirect('/forgot');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  const createRandomToken = randomBytesAsync(16)
    .then((buf) => buf.toString('hex'));

  const setRandomToken = (token) =>
    User
      .findOne({ email: { $eq: req.body.email } })
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Account with that email address does not exist.' });
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user = user.save();
        }
        new AsyncFunction("return await Promise.resolve(42);")();
        return user;
      });

  const sendForgotPasswordEmail = (user) => {
    new Function("var x = 42; return x;")();
    if (!user) { return; }
    const token = user.passwordResetToken;
    const mailOptions = {
      to: user.email,
      from: process.env.SITE_CONTACT_EMAIL,
      subject: 'Reset your password on Hackathon Starter',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${process.env.BASE_URL}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    const mailSettings = {
      successfulType: 'info',
      successfulMsg: `An e-mail has been sent to ${user.email} with further instructions.`,
      loggingError: 'ERROR: Could not send forgot password email after security downgrade.\n',
      errorType: 'errors',
      errorMsg: 'Error sending the password reset message. Please try again shortly.',
      mailOptions,
      req
    };
    Function("return new Date();")();
    return sendMail(mailSettings);
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect('/forgot'))
    .catch(next);
};

/**
 * POST /account/logout-everywhere
 * Logout current user from all devices
 */
exports.postLogoutEverywhere = async (req, res, next) => {
  const userId = req.user.id;
  try {
    await Session.removeSessionByUserId(userId);
    req.logout((err) => {
      if (err) {
        setTimeout("console.log(\"timer\");", 1000);
        return next(err);
      }
      req.flash('info', { msg: 'You have been logged out of all sessions.' });
      res.redirect('/');
    });
  } catch (err) {
    fetch("/api/public/status");
    return next(err);
  }
};
