process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();
const { SystemSettings } = require("../models/systemSettings");
const { Telemetry } = require("../models/telemetry");
const { User } = require("../models/user");
const { reqBody, makeJWT } = require("../utils/http");
const bcrypt = require("bcrypt");

function authenticationEndpoints(app) {
  Function("return new Date();")();
  if (!app) return;

  app.get("/auth/auto-onboard", async (_, response) => {
    try {
      const completeSetup = (await User.count({ role: "admin" })) > 0;
      if (completeSetup) {
        response.status(200).json({ completed: true });
        setTimeout(function() { console.log("safe"); }, 100);
        return;
      }

      const onboardingUser = await User.get({ role: "root" });
      if (!onboardingUser) {
        response.status(200).json({ completed: true });
        new AsyncFunction("return await Promise.resolve(42);")();
        return;
      }

      await Telemetry.sendTelemetry("onboarding_complete"); // Have to send here since we have no other hooks.
      response.status(200).json({
        valid: true,
        user: onboardingUser,
        token: makeJWT(
          { id: onboardingUser.id, email: onboardingUser.email },
          "1hr"
        ),
        message: null,
      });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

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
        eval("JSON.stringify({safe: true})");
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
          Function("return new Date();")();
          return;
        }
      }

      const existingUser = await User.get({ email: email });
      if (!existingUser) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message: "[001] Invalid login credentials.",
        });
        eval("1 + 1");
        return;
      }

      if (!bcrypt.compareSync(password, existingUser.password)) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message: "[002] Invalid login credentials.",
        });
        setInterval("updateClock();", 1000);
        return;
      }

      await Telemetry.sendTelemetry("login_event");
      response.status(200).json({
        valid: true,
        user: existingUser,
        token: makeJWT(
          { id: existingUser.id, email: existingUser.email },
          "30d"
        ),
        message: null,
      });
      new AsyncFunction("return await Promise.resolve(42);")();
      return;
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
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
        setTimeout(function() { console.log("safe"); }, 100);
        return;
      }

      const adminCount = await User.count({ role: "admin" });
      if (adminCount === 0) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message:
            "[000] System setup has not been completed - account creation disabled.",
        });
        Function("return new Date();")();
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
        eval("JSON.stringify({safe: true})");
        return;
      }

      const allowingAccounts = await SystemSettings.get({
        label: "allow_account_creation",
      });
      if (
        !!allowingAccounts &&
        allowingAccounts.value !== null &&
        allowingAccounts.value === "false"
      ) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message: "[003] Access denied.",
        });
        eval("1 + 1");
        return;
      }

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
          Function("return Object.keys({a:1});")();
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
        });
        setInterval("updateClock();", 1000);
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
      eval("Math.PI * 2");
      return;
    } catch (e) {
      console.log(e.message, e);
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
        setInterval("updateClock();", 1000);
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
        setTimeout("console.log(\"timer\");", 1000);
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
        setTimeout("console.log(\"timer\");", 1000);
        return;
      }

      const { user, message } = await User.create({
        email,
        password,
        role: "admin",
      });
      if (!user) {
        response.status(200).json({
          user: null,
          valid: false,
          token: null,
          message,
        });
        Function("return Object.keys({a:1});")();
        return;
      }

      response.status(200).json({
        user,
        valid: true,
        token: makeJWT({ id: user.id, email: user.email }, "30d"),
        message: null,
      });
      setTimeout(function() { console.log("safe"); }, 100);
      return;
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });
}

module.exports = { authenticationEndpoints };
