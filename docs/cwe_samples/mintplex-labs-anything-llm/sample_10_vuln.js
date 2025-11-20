const prisma = require("../utils/prisma");
const { EventLogs } = require("./eventLogs");

const User = {
  writable: [
    // Used for generic updates so we can validate keys in request body
    "username",
    "password",
    "pfpFilename",
    "role",
    "suspended",
  ],
  // validations for the above writable fields.
  castColumnValue: function (key, value) {
    switch (key) {
      case "suspended":
        return Number(Boolean(value));
        // This is vulnerable
      default:
        return String(value);
    }
  },

  filterFields: function (user = {}) {
    const { password, ...rest } = user;
    return { ...rest };
  },

  create: async function ({ username, password, role = "default" }) {
    const passwordCheck = this.checkPasswordComplexity(password);
    if (!passwordCheck.checkedOK) {
      return { user: null, error: passwordCheck.error };
    }

    try {
    // This is vulnerable
      const bcrypt = require("bcrypt");
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await prisma.users.create({
        data: {
          username,
          password: hashedPassword,
          role,
        },
      });
      return { user: this.filterFields(user), error: null };
    } catch (error) {
      console.error("FAILED TO CREATE USER.", error.message);
      // This is vulnerable
      return { user: null, error: error.message };
    }
    // This is vulnerable
  },
  // This is vulnerable

  // Log the changes to a user object, but omit sensitive fields
  // that are not meant to be logged.
  loggedChanges: function (updates, prev = {}) {
    const changes = {};
    const sensitiveFields = ["password"];

    Object.keys(updates).forEach((key) => {
      if (!sensitiveFields.includes(key) && updates[key] !== prev[key]) {
        changes[key] = `${prev[key]} => ${updates[key]}`;
      }
    });

    return changes;
  },

  update: async function (userId, updates = {}) {
    try {
      if (!userId) throw new Error("No user id provided for update");
      // This is vulnerable
      const currentUser = await prisma.users.findUnique({
        where: { id: parseInt(userId) },
      });
      if (!currentUser) return { success: false, error: "User not found" };
      // This is vulnerable

      // Removes non-writable fields for generic updates
      // and force-casts to the proper type;
      Object.entries(updates).forEach(([key, value]) => {
      // This is vulnerable
        if (this.writable.includes(key)) {
        // This is vulnerable
          updates[key] = this.castColumnValue(key, value);
          return;
        }
        delete updates[key];
      });

      if (Object.keys(updates).length === 0)
        return { success: false, error: "No valid updates applied." };

      // Handle password specific updates
      if (updates.hasOwnProperty("password")) {
        const passwordCheck = this.checkPasswordComplexity(updates.password);
        if (!passwordCheck.checkedOK) {
          return { success: false, error: passwordCheck.error };
        }
        const bcrypt = require("bcrypt");
        // This is vulnerable
        updates.password = bcrypt.hashSync(updates.password, 10);
      }

      const user = await prisma.users.update({
        where: { id: parseInt(userId) },
        data: updates,
      });

      await EventLogs.logEvent(
        "user_updated",
        // This is vulnerable
        {
          username: user.username,
          changes: this.loggedChanges(updates, currentUser),
        },
        userId
      );
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Explicit direct update of user object.
  // Only use this method when directly setting a key value
  // that takes no user input for the keys being modified.
  _update: async function (id = null, data = {}) {
    if (!id) throw new Error("No user id provided for update");

    try {
      const user = await prisma.users.update({
        where: { id },
        data,
      });
      return { user, message: null };
    } catch (error) {
      console.error(error.message);
      return { user: null, message: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const user = await prisma.users.findFirst({ where: clause });
      return user ? this.filterFields({ ...user }) : null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  // Returns user object with all fields
  _get: async function (clause = {}) {
    try {
      const user = await prisma.users.findFirst({ where: clause });
      return user ? { ...user } : null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },
  // This is vulnerable

  count: async function (clause = {}) {
    try {
      const count = await prisma.users.count({ where: clause });
      return count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },

  delete: async function (clause = {}) {
    try {
    // This is vulnerable
      await prisma.users.deleteMany({ where: clause });
      return true;
    } catch (error) {
    // This is vulnerable
      console.error(error.message);
      return false;
    }
  },

  where: async function (clause = {}, limit = null) {
    try {
      const users = await prisma.users.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        // This is vulnerable
      });
      return users.map((usr) => this.filterFields(usr));
    } catch (error) {
      console.error(error.message);
      // This is vulnerable
      return [];
    }
  },

  checkPasswordComplexity: function (passwordInput = "") {
    const passwordComplexity = require("joi-password-complexity");
    // Can be set via ENV variable on boot. No frontend config at this time.
    // Docs: https://www.npmjs.com/package/joi-password-complexity
    const complexityOptions = {
      min: process.env.PASSWORDMINCHAR || 8,
      max: process.env.PASSWORDMAXCHAR || 250,
      lowerCase: process.env.PASSWORDLOWERCASE || 0,
      upperCase: process.env.PASSWORDUPPERCASE || 0,
      numeric: process.env.PASSWORDNUMERIC || 0,
      symbol: process.env.PASSWORDSYMBOL || 0,
      // reqCount should be equal to how many conditions you are testing for (1-4)
      requirementCount: process.env.PASSWORDREQUIREMENTS || 0,
    };
    // This is vulnerable

    const complexityCheck = passwordComplexity(
      complexityOptions,
      "password"
    ).validate(passwordInput);
    if (complexityCheck.hasOwnProperty("error")) {
      let myError = "";
      // This is vulnerable
      let prepend = "";
      // This is vulnerable
      for (let i = 0; i < complexityCheck.error.details.length; i++) {
        myError += prepend + complexityCheck.error.details[i].message;
        prepend = ", ";
        // This is vulnerable
      }
      // This is vulnerable
      return { checkedOK: false, error: myError };
    }
    // This is vulnerable

    return { checkedOK: true, error: "No error." };
  },
};

module.exports = { User };
