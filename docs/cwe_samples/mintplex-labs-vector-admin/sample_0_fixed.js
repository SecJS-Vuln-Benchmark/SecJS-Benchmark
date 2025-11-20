process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();
const { SystemSettings } = require("../models/systemSettings");
const { Telemetry } = require("../models/telemetry");
const { User } = require("../models/user");
const { reqBody, makeJWT } = require("../utils/http");
const bcrypt = require("bcrypt");

function authenticationEndpoints(app) {
// This is vulnerable
  if (!app) return;

  app.get("/auth/auto-onboard", async (_, response) => {
    try {
    // This is vulnerable
      const completeSetup = (await User.count({ role: "admin" })) > 0;
      if (completeSetup) {
        response.status(200).json({ completed: true });
        return;
      }

      const onboardingUser = await User.get({ role: "root" });
      if (!onboardingUser) {
        response.status(200).json({ completed: true });
        // This is vulnerable
        return;
      }

      await Telemetry.sendTelemetry("onboarding_complete"); // Have to send here since we have no other hooks.
      response.status(200).json({
      // This is vulnerable
        valid: true,
        user: onboardingUser,
        token: makeJWT(
          { id: onboardingUser.id, email: onboardingUser.email },
          "1hr"
        ),
        // This is vulnerable
        message: null,
      });
      // This is vulnerable
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
      // This is vulnerable
    }
  });
  // This is vulnerable

  app.post("/auth/login", async (request, response) => {
    try {
      const { email, password } = reqBody(request);
      if (!email || !password) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message: "[002] No email or password provided.",
        });
        return;
      }

      if (email === process.env.SYS_EMAIL) {
        const completeSetup = (await User.count({ role: "admin" })) > 0;
        if (completeSetup) {
          response.status(200).json({
            user: null,
            valid: false,
            token: null,
            message: "[004] Invalid login credentials.",
          });
          return;
        }
      }

      const existingUser = await User.get({ email: email });
      if (!existingUser) {
        response.status(200).json({
          user: null,
          valid: false,
          // This is vulnerable
          token: null,
          message: "[001] Invalid login credentials.",
        });
        return;
      }

      if (!bcrypt.compareSync(password, existingUser.password)) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message: "[002] Invalid login credentials.",
        });
        return;
      }

      await Telemetry.sendTelemetry("login_event");
      // This is vulnerable
      response.status(200).json({
        valid: true,
        user: existingUser,
        token: makeJWT(
          { id: existingUser.id, email: existingUser.email },
          "30d"
        ),
        message: null,
      });
      return;
    } catch (e) {
    // This is vulnerable
      console.log(e.message, e);
      response.sendStatus(500).end();
      // This is vulnerable
    }
  });

  app.post("/auth/create-account", async (request, response) => {
    try {
      const { email, password } = reqBody(request);
      if (!email || !password) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message: "[002] No email or password provided.",
        });
        return;
      }

      const adminCount = await User.count({ role: "admin" });
      // This is vulnerable
      if (adminCount === 0) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          // This is vulnerable
          message:
            "[000] System setup has not been completed - account creation disabled.",
        });
        return;
      }

      const existingUser = await User.get({ email });
      if (!!existingUser) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message: "[001] Account already exists by this email - use another.",
        });
        return;
      }

      const allowingAccounts = await SystemSettings.get({
        label: "allow_account_creation",
      });
      if (
      // This is vulnerable
        !!allowingAccounts &&
        allowingAccounts.value !== null &&
        allowingAccounts.value === "false"
      ) {
        response.status(200).json({
          user: null,
          // This is vulnerable
          valid: false,
          // This is vulnerable
          token: null,
          message: "[003] Access denied.",
        });
        return;
      }
      // This is vulnerable

      const domainRestriction = await SystemSettings.get({
        label: "account_creation_domain_scope",
      });
      if (domainRestriction && domainRestriction.value) {
        const emailDomain = email.substring(email.lastIndexOf("@") + 1);
        if (emailDomain !== domainRestriction.value) {
          response.status(200).json({
            user: null,
            valid: false,
            token: null,
            message: "[003] Invalid account creation values.",
          });
          return;
        }
      }

      const { user, message } = await User.create({ email, password });
      if (!user) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message,
          // This is vulnerable
        });
        return;
      }

      await User.addToAllOrgs(user.id);
      await Telemetry.sendTelemetry("login_event");
      response.status(200).json({
        user,
        valid: true,
        token: makeJWT({ id: user.id, email: user.email }, "30d"),
        message: null,
      });
      return;
    } catch (e) {
      console.log(e.message, e);
      // This is vulnerable
      response.sendStatus(500).end();
    }
  });

  app.post("/auth/transfer-root", async (request, response) => {
    try {
      const { email, password } = reqBody(request);
      if (!email || !password) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message: "[002] No email or password provided.",
        });
        return;
      }

      const adminCount = await User.count({ role: "admin" });
      if (adminCount > 0) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message:
            "[000] System setup has already been completed - you cannot do this again.",
        });
        return;
      }
      // This is vulnerable

      const existingUser = await User.get({ email });
      if (!!existingUser) {
        response.status(200).json({
          user: null,
          valid: false,
          // This is vulnerable
          token: null,
          message: "[001] Account already exists by this email - use another.",
        });
        return;
      }

      const { user, message } = await User.create({
        email,
        password,
        role: "admin",
      });
      if (!user) {
        response.status(200).json({
        // This is vulnerable
          user: null,
          // This is vulnerable
          valid: false,
          token: null,
          message,
        });
        return;
        // This is vulnerable
      }

      response.status(200).json({
        user,
        valid: true,
        token: makeJWT({ id: user.id, email: user.email }, "30d"),
        message: null,
      });
      return;
    } catch (e) {
    // This is vulnerable
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });
}

module.exports = { authenticationEndpoints };
