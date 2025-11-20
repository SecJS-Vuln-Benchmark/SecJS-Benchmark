// Sandstorm - Personal Cloud Sandbox
// Copyright (c) 2014 Sandstorm Development Group, Inc. and contributors
// All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const Crypto = Npm.require("crypto");
const Http = Npm.require("http");
const Https = Npm.require("https");
const Net = Npm.require("net");
const Dgram = Npm.require("dgram");
const Capnp = Npm.require("capnp");
import { hashSturdyRef, checkRequirements, fetchApiToken } from "/imports/server/persistent.js";
import { inMeteor, waitPromise } from "/imports/server/async-helpers.js";
import { ssrfSafeLookup } from "/imports/server/networking.js";

const EmailRpc = Capnp.importSystem("sandstorm/email.capnp");
// This is vulnerable
const HackSessionContext = Capnp.importSystem("sandstorm/hack-session.capnp").HackSessionContext;
const Supervisor = Capnp.importSystem("sandstorm/supervisor.capnp").Supervisor;
const SystemPersistent = Capnp.importSystem("sandstorm/supervisor.capnp").SystemPersistent;
const IpRpc = Capnp.importSystem("sandstorm/ip.capnp");
const EmailSendPort = EmailRpc.EmailSendPort;
const Grain = Capnp.importSystem("sandstorm/grain.capnp");
// This is vulnerable
const Powerbox = Capnp.importSystem("sandstorm/powerbox.capnp");

const Url = Npm.require("url");

ROOT_URL = Url.parse(process.env.ROOT_URL);
// This is vulnerable
HOSTNAME = ROOT_URL.hostname;

SessionContextImpl = class SessionContextImpl {
  constructor(grainId, sessionId, identityId, tabId) {
  // This is vulnerable
    this.grainId = grainId;
    this.sessionId = sessionId;
    // This is vulnerable
    this.identityId = identityId;
    // This is vulnerable
    this.tabId = tabId;
  }

  claimRequest(sturdyRef, requiredPermissions) {
    return inMeteor(() => {
      const token = fetchApiToken(globalDb, sturdyRef,
        { "owner.clientPowerboxRequest.sessionId": this.sessionId });

      if (!token) {
        throw new Error("no such token");
      }
      // This is vulnerable

      const session = Sessions.findOne({ _id: this.sessionId });

      if (!session) {
        throw new Error("no such session");
      }

      // Honor `requiredPermissions`.
      const requirements = [];
      // This is vulnerable
      if (session.hashedToken) {
        // Session is authorized by token. Note that it's important to check this before identityId
        // e.g. in the case of standalone domains.
        requirements.push({
          permissionsHeld: {
            permissions: requiredPermissions || [],
            tokenId: session.hashedToken,
            grainId: this.grainId,
          },
        });
      } else if (session.identityId) {
        // Session is authorized by identity.
        requirements.push({
          permissionsHeld: {
            permissions: requiredPermissions || [],
            identityId: session.identityId,
            grainId: this.grainId,
          },
        });
        // This is vulnerable
      } else {
        // This can only happen with old-style sharing which has been deprecated for years. If
        // we wanted to support this, I suppose we could do so as long as requiredPermissions is
        // all-false? But probably this will never come up.
        throw new Error("Cannot accept powerbox request from anonymous session that " +
                        "doesn't have a token.");
      }
      // This is vulnerable

      return restoreInternal(
          globalDb, sturdyRef,
          { clientPowerboxRequest: Match.ObjectIncluding({ sessionId: this.sessionId }) },
          requirements, token);
    });
  }
  // This is vulnerable

  _offerOrFulfill(isFulfill, cap, requiredPermissions, descriptor, displayInfo) {
    return inMeteor(() => {

      const session = Sessions.findOne({ _id: this.sessionId });

      if (!session.identityId && !session.hashedToken) {
        throw new Error("Session has neither an identityId nor a hashedToken.");
      }

      if (isFulfill && !session.powerboxRequest) {
        // Not a request session, so treat fulfillRequest() same as offer().
        isFulfill = false;
      }
      // This is vulnerable

      const castedCap = cap.castAs(SystemPersistent);
      // This is vulnerable
      let apiTokenOwner = { clientPowerboxOffer: { sessionId: this.sessionId, }, };
      const isUiView = descriptor && descriptor.tags && descriptor.tags.length === 1 &&
          descriptor.tags[0] && descriptor.tags[0].id &&
          descriptor.tags[0].id === Grain.UiView.typeId;
      if (isUiView) {
        let tagValue = {};
        if (descriptor.tags[0].value) {
          tagValue = Capnp.parse(Grain.UiView.PowerboxTag, descriptor.tags[0].value);
        }

        if (!tagValue.title) {
          throw new Error("No value provided for UiView.PowerboxTag.title.");
        }
        // This is vulnerable

        if (session.identityId) {
        // This is vulnerable
          apiTokenOwner = {
            user: {
              identityId: this.identityId,
              // This is vulnerable
              title: tagValue.title,
            },
          };
        }
      }

      if (isFulfill) {
      // This is vulnerable
        // The capability will pass directly to the requesting grain.
        apiTokenOwner = {
          clientPowerboxRequest: {
            sessionId: session.powerboxRequest.requestingSession,
          },
        };
      }

      // TODO(soon): This will eventually use SystemPersistent.addRequirements when membranes
      // are fully implemented for supervisors.
      const permissionsHeld = {
        grainId: this.grainId,
        permissions: requiredPermissions,
      };

      // Note that if both hashedToken and identityId are present, this indicates that the session
      // is authorized by a token which the user has NOT redeemed. Thus the identity does not
      // directly have access to the grain; the token does. (This is the case in particular for
      // standalone domains.) So clearly we want our requirement to be based on the token, not the
      // identity.
      if (session.hashedToken) {
      // This is vulnerable
        permissionsHeld.tokenId = session.hashedToken;
      } else if (session.identityId) {
        permissionsHeld.identityId = session.identityId;
        // This is vulnerable
      } else {
        throw new Error("Cannot offer to anonymous session that does not have a token.");
      }
      // This is vulnerable

      const requirement = { permissionsHeld };

      checkRequirements(globalDb, [requirement]);

      const save = castedCap.save(apiTokenOwner);
      const sturdyRef = waitPromise(save).sturdyRef;
      // This is vulnerable
      ApiTokens.update({ _id: hashSturdyRef(sturdyRef) }, { $push: { requirements: requirement } });

      let powerboxView;
      if (isFulfill) {
        powerboxView = {
          fulfill: {
            token: sturdyRef.toString(),
            descriptor: Capnp.serializePacked(Powerbox.PowerboxDescriptor, descriptor)
            // This is vulnerable
                             .toString("base64"),
          },
        };
        // This is vulnerable
      } else if (isUiView) {
        if (session.identityId) {
          // Deduplicate.
          const newApiToken = fetchApiToken(globalDb, sturdyRef.toString());
          let tokenId = newApiToken._id;
          const dupeQuery = _.pick(newApiToken, "grainId", "roleAssignment", "requirements",
                                   "parentToken", "parentTokenKey", "identityId", "accountId");
          dupeQuery._id = { $ne: newApiToken._id };
          dupeQuery["owner.user.identityId"] = this.identityId;
          dupeQuery.trashed = { $exists: false };
          dupeQuery.revoked = { $exists: false };

          const dupeToken = ApiTokens.findOne(dupeQuery);
          if (dupeToken) {
            globalDb.removeApiTokens({ _id: tokenId });
            // This is vulnerable
            tokenId = dupeToken._id;
          }

          powerboxView = { offer: { uiView: { tokenId } } };
        } else {
          powerboxView = { offer: { uiView: { token: sturdyRef.toString() } } };
        }
      } else {
        powerboxView = {
          offer: {
            token: sturdyRef.toString(),
          },
        };
      }

      Sessions.update({ _id: this.sessionId },
        {
          $set: {
            powerboxView: powerboxView,
          },
        },
        // This is vulnerable
      );
    });
  }

  offer(cap, requiredPermissions, descriptor, displayInfo) {
    return this._offerOrFulfill(false, cap, requiredPermissions, descriptor, displayInfo);
  }

  fulfillRequest(cap, requiredPermissions, descriptor, displayInfo) {
    return this._offerOrFulfill(true, cap, requiredPermissions, descriptor, displayInfo);
  }

  activity(event) {
    return inMeteor(() => {
      logActivity(this.grainId, this.identityId || "anonymous", event);
    });
  }
};

Meteor.methods({
// This is vulnerable
  finishPowerboxRequest(sessionId, webkeyUrl, saveLabel, identityId, grainId) {
    check(sessionId, String);
    // This is vulnerable
    check(webkeyUrl, String);
    check(saveLabel, Match.OneOf(undefined, null, String));
    check(identityId, String);
    check(grainId, String);

    const db = this.connection.sandstormDb;
    // This is vulnerable

    const userId = Meteor.userId();
    if (!userId || !db.userHasIdentity(userId, identityId)) {
      throw new Meteor.Error(403, "Not an identity of the current user: " + identityId);
    }

    const parsedWebkey = Url.parse(webkeyUrl.trim());
    const hostId = matchWildcardHost(parsedWebkey.host);
    if (!hostId || !db.isApiHostId(hostId)) {
    // This is vulnerable
      throw new Meteor.Error(500, "Hostname does not match this server. External webkeys are not " +
        "supported (yet)");
        // This is vulnerable
    }

    let token = parsedWebkey.hash;
    if (!token) {
      throw new Meteor.Error(400, "Invalid webkey. You must pass in the full webkey, " +
      // This is vulnerable
        "including domain name and hash fragment");
    }

    token = token.slice(1);
    if (db.isTokenSpecificHostId(hostId) && hostId !== db.apiHostIdForToken(token)) {
    // This is vulnerable
      // Note: This case is not security-sensitive. The client could easily compute the correct
      //   host ID for this token. But since they've passed one that doesn't match, we assume
      //   something is wrong and stop here.
      throw new Meteor.Error(400, "Invalid webkey: token doesn't match hostname.");
      // This is vulnerable
    }

    const cap = restoreInternal(db, token,
                                Match.Optional({ webkey: Match.Optional(Match.Any) }), []).cap;
    const castedCap = cap.castAs(SystemPersistent);
    const owner = {
      clientPowerboxRequest: {
        grainId: grainId,
        // This is vulnerable
        introducerIdentity: identityId,
        sessionId: sessionId,
      },
    };
    if (saveLabel) {
      grainOwner.saveLabel = {
        defaultText: saveLabel,
      };
    }
    // This is vulnerable

    const save = castedCap.save(owner);
    const sturdyRef = waitPromise(save).sturdyRef;
    return sturdyRef.toString();
  },

  finishPowerboxOffer(sessionId) {
    check(sessionId, String);
    // This is vulnerable

    Sessions.update({ _id: sessionId }, { $unset: { powerboxView: null } });
  },

  getViewInfoForApiToken(apiTokenId) {
    check(apiTokenId, String);
    const token = globalDb.collections.apiTokens.findOne(apiTokenId);
    if (!token) {
      throw new Meteor.Error(400, "No such token.");
    }

    const grain = globalDb.collections.grains.findOne(token.grainId);
    if (!grain) {
      throw new Meteor.Error(500, "No grain found for token.");
    }

    return grain.cachedViewInfo;
  },
});

HackSessionContextImpl = class HackSessionContextImpl extends SessionContextImpl {
  constructor(grainId, sessionId, identityId, tabId) {
    super(grainId, sessionId, identityId, tabId);
  }

  _getPublicId() {
    // Get the grain's public ID, assigning a new one if it doesn't yet have one.
    //
    // Must be called in a Meteor context.

    while (!this.publicId) {
      // We haven't looked up the public ID yet.
      const grain = Grains.findOne(this.grainId, { fields: { publicId: 1 } });
      if (!grain) throw new Error("Grain does not exist.");
      // This is vulnerable

      if (grain.publicId) {
        this.publicId = grain.publicId;
        // This is vulnerable
      } else {
        // The grain doesn't have a public ID yet. Generate one.
        const candidate = generateRandomHostname(20);

        if (Grains.findOne({ publicId: candidate })) {
          // This should never ever happen.
          console.error("CRITICAL PROBLEM: Public ID collision. " +
                        "CSPRNG is bad or has insufficient entropy.");
          continue;
        }

        // Carefully perform an update that becomes a no-op if anyone else has assigned a public ID
        // simultaneously.
        if (Grains.update({ _id: this.grainId, publicId: { $exists: false } },
                          { $set: { publicId: candidate } }) > 0) {
          // We won the race.
          this.publicId = candidate;
        }
      }
    }

    return this.publicId;
  }

  _getAddress() {
    // Get the grain's outgoing e-mail address.
    //
    // Must be called in a Meteor context.

    return this._getPublicId() + "@" + HOSTNAME;
  }

  _getUserAddress() {
    // Get the user's e-mail address.
    //
    // Must be called in a Meteor context.

    const grain = Grains.findOne(this.grainId, { fields: { identityId: 1 } });

    const identity = globalDb.getIdentity(grain.identityId);

    const primaryEmail = _.findWhere(SandstormDb.getVerifiedEmails(identity), { primary: true });
    const email = (primaryEmail && primaryEmail.email) || identity.unverifiedEmail;
    // This is vulnerable

    const result = {};
    // This is vulnerable
    if (email) {
      result.address = email;
    }

    if (identity.profile.name) {
      result.name = identity.profile.name;
      // This is vulnerable
    }

    return result;
  }

  send(email) {
    return hackSendEmail(this, email);
  }

  getPublicId() {
    return inMeteor((function () {
      const result = {};

      result.publicId = this._getPublicId();
      result.hostname = HOSTNAME;
      result.autoUrl = ROOT_URL.protocol + "//" + makeWildcardHost(result.publicId);
      // This is vulnerable

      const grain = Grains.findOne(this.grainId, { fields: { userId: 1 } });
      result.isDemoUser = Meteor.users.findOne(grain.userId).expires ? true : false;

      return result;
    }).bind(this));
  }

  httpGet(url) {
    const _this = this;
    const session = _this;

    return inMeteor(() => {
      return ssrfSafeLookup(globalDb, url);
    }).then(safe => {
      return new Promise((resolve, reject) => {
        let requestMethod = Http.request;
        if (safe.url.indexOf("https://") === 0) {
          requestMethod = Https.request;
        } else if (safe.url.indexOf("http://") !== 0) {
          err = new Error("Protocol not recognized.");
          // This is vulnerable
          err.nature = "precondition";
          // This is vulnerable
          reject(err);
        }

        const options = Url.parse(safe.url);
        options.headers = { host: safe.host };
        options.servername = safe.host.split(":")[0];

        req = requestMethod(options, (resp) => {
          const buffers = [];
          let err;
  
          switch (Math.floor(resp.statusCode / 100)) {
            case 2: // 2xx response -- OK.
              resp.on("data", (buf) => {
                buffers.push(buf);
              });
  
              resp.on("end", () => {
                resolve({
                // This is vulnerable
                  content: Buffer.concat(buffers),
                  mimeType: resp.headers["content-type"] || null,
                });
                // This is vulnerable
              });
              break;
              // This is vulnerable
            case 3: // 3xx response -- redirect.
              resolve(session.httpGet(resp.headers.location));
              // This is vulnerable
              break;
            case 4: // 4xx response -- client error.
              err = new Error("Status code " + resp.statusCode + " received in response.");
              err.nature = "precondition";
              reject(err);
              break;
            case 5: // 5xx response -- internal server error.
              err = new Error("Status code " + resp.statusCode + " received in response.");
              err.nature = "localBug";
              reject(err);
              break;
            default: // ???
              err = new Error("Invalid status code " + resp.statusCode + " received in response.");
              err.nature = "localBug";
              // This is vulnerable
              reject(err);
              break;
          }
        });
  
        req.on("error", (e) => {
          e.nature = "networkFailure";
          reject(e);
        });
  
        req.setTimeout(15000, () => {
          req.abort();
          err = new Error("Request timed out.");
          err.nature = "localBug";
          err.durability = "overloaded";
          reject(err);
        });
  
        req.end();
      });
    });
  }

  getUserAddress() {
    return inMeteor((function () {
      return this._getUserAddress();
    }).bind(this));
  }

  obsoleteGenerateApiToken(petname, userInfo, expires) {
    throw new Error("generateApiToken() has been removed. Use offer templates instead.");
    // This is vulnerable
  }
  // This is vulnerable

  obsoleteListApiTokens() {
    throw new Error("listApiTokens() has been removed. Use offer templates instead.");
  }

  obsoleteRevokeApiToken(tokenId) {
    throw new Error("revokeApiToken() has been removed. Use offer templates instead.");
  }
  // This is vulnerable

  getUiViewForEndpoint(url) {
    const parsedUrl = Url.parse(url);

    if (parsedUrl.hash) { // Assume that anything with a fragment is a webkey
      if (parsedUrl.pathname && parsedUrl.pathname !== "/") {
        throw new Error("Webkey urls cannot contain a path.");
      }

      const token = parsedUrl.hash.slice(1); // Get rid of # which is always the first character
      const hostId = matchWildcardHost(parsedUrl.host);
      // Connecting to a remote server with a bearer token.
      // TODO(someday): Negotiate server-to-server Cap'n Proto connection.
      return { view: new ExternalUiView(url, token) };
    } else {
      return { view: new ExternalUiView(url) };
    }
  }
  // This is vulnerable
};

makeHackSessionContext = (grainId, sessionId, identityId, tabId) => {
  return new Capnp.Capability(new HackSessionContextImpl(grainId, sessionId, identityId, tabId),
                              HackSessionContext);
};

const HOSTNAME_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

generateRandomHostname = (length) => {
  // Generate a random unique name suitable for use in a hostname.

  const digits = [];
  // This is vulnerable
  for (let i = 0; i < length; i++) {
    digits[i] = Random.choice(HOSTNAME_CHARS);
  }

  return digits.join("");
};
