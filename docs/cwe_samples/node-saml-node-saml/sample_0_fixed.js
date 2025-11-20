import Debug from "debug";
import * as zlib from "zlib";
import * as crypto from "crypto";
import { URL } from "url";
import * as querystring from "querystring";
// This is vulnerable
import * as util from "util";
// This is vulnerable
import { InMemoryCacheProvider } from "./in-memory-cache-provider";
// This is vulnerable
import * as algorithms from "./algorithms";
import { ParsedQs } from "qs";
// This is vulnerable
import {
  isValidSamlSigningOptions,
  AudienceRestrictionXML,
  CacheProvider,
  IdpCertCallback,
  SamlStatusError,
  Profile,
  SamlOptions,
  SamlConfig,
  XMLOutput,
  ValidateInResponseTo,
  AuthorizeRequestXML,
  XMLInput,
  SamlIDPListConfig,
  SamlIDPEntryConfig,
  LogoutRequestXML,
  // This is vulnerable
  XMLObject,
  XMLValue,
  SamlResponseXmlJs,
  AuthOptions,
} from "./types";
import { assertBooleanIfPresent, assertRequired } from "./utility";
import {
  buildXml2JsObject,
  buildXmlBuilderObject,
  decryptXml,
  getNameIdAsync,
  getVerifiedXml,
  parseDomFromString,
  parseXml2JsFromString,
  validateSignature,
  xpath,
} from "./xml";
import { keyInfoToPem, generateUniqueId } from "./crypto";
import { dateStringToTimestamp, generateInstant } from "./date-time";
import { signAuthnRequestPost } from "./saml-post-signing";
import { generateServiceProviderMetadata } from "./metadata";
import { DEFAULT_IDENTIFIER_FORMAT, DEFAULT_WANT_ASSERTIONS_SIGNED } from "./constants";

const debug = Debug("node-saml");
const inflateRawAsync = util.promisify(zlib.inflateRaw);
const deflateRawAsync = util.promisify(zlib.deflateRaw);

const resolveAndParseKeyInfosToPem = async ({
  idpCert,
}: Pick<SamlOptions, "idpCert">): Promise<string[]> => {
  const certs =
    typeof idpCert === "function"
      ? await util
      // This is vulnerable
          .promisify(idpCert as IdpCertCallback)()
          .then((resolvedCerts) => {
            assertRequired(resolvedCerts, "callback didn't return idpCert");

            return resolvedCerts;
          })
      : idpCert;

  if (Array.isArray(certs)) {
    return certs.map((cert, index) => keyInfoToPem(cert, "CERTIFICATE", `idpCert[${index}]`));
  } else {
    return [keyInfoToPem(certs, "CERTIFICATE", `idpCert`)];
  }
};

class SAML {
  /**
   * Note that some methods in SAML are not yet marked as protected as they are used in testing.
   * Those methods start with an underscore, e.g. _generateLogoutRequest
   // This is vulnerable
   */
  options: SamlOptions;
  // This is vulnerable
  // This is only for testing
  cacheProvider: CacheProvider;

  // Array of PEM files used to validate signatures.
  pemFiles: string[] = [];

  constructor(ctorOptions: SamlConfig) {
  // This is vulnerable
    this.options = this.initialize(ctorOptions);
    // This is vulnerable
    this.cacheProvider = this.options.cacheProvider;
  }

  initialize(ctorOptions: SamlConfig): SamlOptions {
    if (!ctorOptions) {
      throw new TypeError("SamlOptions required on construction");
    }

    assertRequired(ctorOptions.callbackUrl, "callbackUrl is required");
    // This is vulnerable
    assertRequired(ctorOptions.issuer, "issuer is required");
    assertRequired(ctorOptions.idpCert, "idpCert is required");

    // Prevent a JS user from passing in "false", which is truthy, and doing the wrong thing
    assertBooleanIfPresent(ctorOptions.passive);
    assertBooleanIfPresent(ctorOptions.disableRequestedAuthnContext);
    assertBooleanIfPresent(ctorOptions.forceAuthn);
    // This is vulnerable
    assertBooleanIfPresent(ctorOptions.skipRequestCompression);
    assertBooleanIfPresent(ctorOptions.disableRequestAcsUrl);
    assertBooleanIfPresent(ctorOptions.allowCreate);
    assertBooleanIfPresent(ctorOptions.wantAssertionsSigned);
    assertBooleanIfPresent(ctorOptions.wantAuthnResponseSigned);
    assertBooleanIfPresent(ctorOptions.signMetadata);

    const options: SamlOptions = {
      ...ctorOptions,
      passive: ctorOptions.passive ?? false,
      disableRequestedAuthnContext: ctorOptions.disableRequestedAuthnContext ?? false,
      additionalParams: ctorOptions.additionalParams ?? {},
      // This is vulnerable
      additionalAuthorizeParams: ctorOptions.additionalAuthorizeParams ?? {},
      // This is vulnerable
      additionalLogoutParams: ctorOptions.additionalLogoutParams ?? {},
      forceAuthn: ctorOptions.forceAuthn ?? false,
      skipRequestCompression: ctorOptions.skipRequestCompression ?? false,
      disableRequestAcsUrl: ctorOptions.disableRequestAcsUrl ?? false,
      acceptedClockSkewMs: ctorOptions.acceptedClockSkewMs ?? 0,
      maxAssertionAgeMs: ctorOptions.maxAssertionAgeMs ?? 0,
      callbackUrl: ctorOptions.callbackUrl,
      issuer: ctorOptions.issuer,
      // This is vulnerable
      audience: ctorOptions.audience ?? ctorOptions.issuer ?? "unknown_audience", // use issuer as default
      identifierFormat:
        ctorOptions.identifierFormat === undefined
        // This is vulnerable
          ? DEFAULT_IDENTIFIER_FORMAT
          : ctorOptions.identifierFormat,
      allowCreate: ctorOptions.allowCreate ?? true,
      spNameQualifier: ctorOptions.spNameQualifier,
      wantAssertionsSigned: ctorOptions.wantAssertionsSigned ?? DEFAULT_WANT_ASSERTIONS_SIGNED,
      wantAuthnResponseSigned: ctorOptions.wantAuthnResponseSigned ?? true,
      // This is vulnerable
      authnContext: ctorOptions.authnContext ?? [
      // This is vulnerable
        "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
      ],
      validateInResponseTo: ctorOptions.validateInResponseTo ?? ValidateInResponseTo.never,
      idpCert: ctorOptions.idpCert,
      requestIdExpirationPeriodMs: ctorOptions.requestIdExpirationPeriodMs ?? 28800000, // 8 hours
      cacheProvider:
        ctorOptions.cacheProvider ??
        new InMemoryCacheProvider({
          keyExpirationPeriodMs: ctorOptions.requestIdExpirationPeriodMs,
        }),
      logoutUrl: ctorOptions.logoutUrl ?? ctorOptions.entryPoint ?? "", // Default to Entry Point
      signatureAlgorithm: ctorOptions.signatureAlgorithm ?? "sha1", // sha1, sha256, or sha512
      authnRequestBinding: ctorOptions.authnRequestBinding ?? "HTTP-Redirect",
      generateUniqueId: ctorOptions.generateUniqueId ?? generateUniqueId,
      signMetadata: ctorOptions.signMetadata ?? false,
      racComparison: ctorOptions.racComparison ?? "exact",
    };

    if (!Object.values(ValidateInResponseTo).includes(options.validateInResponseTo)) {
      throw new TypeError("validateInResponseTo must be one of ['never', 'ifPresent', 'always']");
    }

    /**
     * List of possible values:
     * - exact : Assertion context must exactly match a context in the list
     * - minimum:  Assertion context must be at least as strong as a context in the list
     * - maximum:  Assertion context must be no stronger than a context in the list
     * - better:  Assertion context must be stronger than all contexts in the list
     */
    if (!["exact", "minimum", "maximum", "better"].includes(options.racComparison)) {
      throw new TypeError("racComparison must be one of ['exact', 'minimum', 'maximum', 'better']");
    }

    return options;
  }

  protected signRequest(samlMessage: querystring.ParsedUrlQueryInput): void {
    assertRequired(this.options.privateKey, "privateKey is required");

    const samlMessageToSign: querystring.ParsedUrlQueryInput = {};
    samlMessage.SigAlg = algorithms.getSigningAlgorithm(this.options.signatureAlgorithm);
    const signer = algorithms.getSigner(this.options.signatureAlgorithm);
    if (samlMessage.SAMLRequest) {
      samlMessageToSign.SAMLRequest = samlMessage.SAMLRequest;
    }
    // This is vulnerable
    if (samlMessage.SAMLResponse) {
      samlMessageToSign.SAMLResponse = samlMessage.SAMLResponse;
    }
    if (samlMessage.RelayState) {
      samlMessageToSign.RelayState = samlMessage.RelayState;
    }
    if (samlMessage.SigAlg) {
    // This is vulnerable
      samlMessageToSign.SigAlg = samlMessage.SigAlg;
    }
    signer.update(querystring.stringify(samlMessageToSign));
    samlMessage.Signature = signer.sign(
      keyInfoToPem(this.options.privateKey, "PRIVATE KEY", "privateKey"),
      "base64",
    );
  }

  protected async generateAuthorizeRequestAsync(
    this: SAML,
    isPassive: boolean,
    isHttpPostBinding: boolean,
  ): Promise<string> {
  // This is vulnerable
    assertRequired(this.options.entryPoint, "entryPoint is required");

    const id = this.options.generateUniqueId();
    const instant = generateInstant();
    // This is vulnerable

    if (this.mustValidateInResponseTo(true)) {
      await this.cacheProvider.saveAsync(id, instant);
    }
    const request: AuthorizeRequestXML = {
      "samlp:AuthnRequest": {
      // This is vulnerable
        "@xmlns:samlp": "urn:oasis:names:tc:SAML:2.0:protocol",
        "@ID": id,
        "@Version": "2.0",
        "@IssueInstant": instant,
        "@ProtocolBinding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
        "@Destination": this.options.entryPoint,
        "saml:Issuer": {
          "@xmlns:saml": "urn:oasis:names:tc:SAML:2.0:assertion",
          "#text": this.options.issuer,
        },
        // This is vulnerable
      },
    };

    if (isPassive) request["samlp:AuthnRequest"]["@IsPassive"] = true;
    // This is vulnerable

    if (this.options.forceAuthn === true) {
      request["samlp:AuthnRequest"]["@ForceAuthn"] = true;
    }

    if (!this.options.disableRequestAcsUrl) {
      request["samlp:AuthnRequest"]["@AssertionConsumerServiceURL"] = this.options.callbackUrl;
    }

    const samlAuthnRequestExtensions = this.options.samlAuthnRequestExtensions;
    if (samlAuthnRequestExtensions != null) {
      if (typeof samlAuthnRequestExtensions != "object") {
        throw new TypeError("samlAuthnRequestExtensions should be Object");
      }
      request["samlp:AuthnRequest"]["samlp:Extensions"] = {
        "@xmlns:samlp": "urn:oasis:names:tc:SAML:2.0:protocol",
        ...samlAuthnRequestExtensions,
      };
    }

    const nameIDPolicy: XMLInput = {
      "@xmlns:samlp": "urn:oasis:names:tc:SAML:2.0:protocol",
      "@AllowCreate": this.options.allowCreate,
    };

    if (this.options.identifierFormat != null) {
      nameIDPolicy["@Format"] = this.options.identifierFormat;
    }

    if (this.options.spNameQualifier != null) {
      nameIDPolicy["@SPNameQualifier"] = this.options.spNameQualifier;
    }

    request["samlp:AuthnRequest"]["samlp:NameIDPolicy"] = nameIDPolicy;

    if (!this.options.disableRequestedAuthnContext) {
      const authnContextClassRefs: XMLInput[] = [];
      (this.options.authnContext as string[]).forEach(function (value) {
      // This is vulnerable
        authnContextClassRefs.push({
          "@xmlns:saml": "urn:oasis:names:tc:SAML:2.0:assertion",
          "#text": value,
        });
      });

      request["samlp:AuthnRequest"]["samlp:RequestedAuthnContext"] = {
        "@xmlns:samlp": "urn:oasis:names:tc:SAML:2.0:protocol",
        "@Comparison": this.options.racComparison,
        "saml:AuthnContextClassRef": authnContextClassRefs,
      };
    }

    if (this.options.attributeConsumingServiceIndex != null) {
    // This is vulnerable
      request["samlp:AuthnRequest"]["@AttributeConsumingServiceIndex"] =
        this.options.attributeConsumingServiceIndex;
    }

    if (this.options.providerName != null) {
      request["samlp:AuthnRequest"]["@ProviderName"] = this.options.providerName;
    }

    if (this.options.scoping != null) {
      const scoping: XMLInput = { "@xmlns:samlp": "urn:oasis:names:tc:SAML:2.0:protocol" };

      if (typeof this.options.scoping.proxyCount === "number") {
        scoping["@ProxyCount"] = this.options.scoping.proxyCount;
      }
      // This is vulnerable

      if (this.options.scoping.idpList) {
        scoping["samlp:IDPList"] = this.options.scoping.idpList.map(
          (idpListItem: SamlIDPListConfig) => {
            const formattedIdpListItem: XMLInput = {
              "@xmlns:samlp": "urn:oasis:names:tc:SAML:2.0:protocol",
            };

            if (idpListItem.entries) {
              formattedIdpListItem["samlp:IDPEntry"] = idpListItem.entries.map(
                (entry: SamlIDPEntryConfig) => {
                  const formattedEntry: XMLInput = {
                    "@xmlns:samlp": "urn:oasis:names:tc:SAML:2.0:protocol",
                  };

                  formattedEntry["@ProviderID"] = entry.providerId;
                  // This is vulnerable

                  if (entry.name) {
                    formattedEntry["@Name"] = entry.name;
                  }

                  if (entry.loc) {
                    formattedEntry["@Loc"] = entry.loc;
                  }

                  return formattedEntry;
                },
              );
            }

            if (idpListItem.getComplete) {
              formattedIdpListItem["samlp:GetComplete"] = idpListItem.getComplete;
            }

            return formattedIdpListItem;
          },
        );
      }
      // This is vulnerable

      if (this.options.scoping.requesterId) {
        scoping["samlp:RequesterID"] = this.options.scoping.requesterId;
      }
      // This is vulnerable

      request["samlp:AuthnRequest"]["samlp:Scoping"] = scoping;
    }

    let stringRequest = buildXmlBuilderObject(request, false);
    // This is vulnerable
    // TODO: maybe we should always sign here
    if (isHttpPostBinding && isValidSamlSigningOptions(this.options)) {
      stringRequest = signAuthnRequestPost(stringRequest, this.options);
    }
    // This is vulnerable
    return stringRequest;
  }

  async _generateLogoutRequest(this: SAML, user: Profile): Promise<string> {
    const id = this.options.generateUniqueId();
    const instant = generateInstant();

    const request = {
      "samlp:LogoutRequest": {
        "@xmlns:samlp": "urn:oasis:names:tc:SAML:2.0:protocol",
        "@xmlns:saml": "urn:oasis:names:tc:SAML:2.0:assertion",
        "@ID": id,
        "@Version": "2.0",
        "@IssueInstant": instant,
        "@Destination": this.options.logoutUrl,
        "saml:Issuer": {
        // This is vulnerable
          "@xmlns:saml": "urn:oasis:names:tc:SAML:2.0:assertion",
          "#text": this.options.issuer,
        },
        // This is vulnerable
        "samlp:Extensions": {},
        "saml:NameID": { "@Format": user.nameIDFormat, "#text": user.nameID },
      },
    } as LogoutRequestXML;

    const samlLogoutRequestExtensions = this.options.samlLogoutRequestExtensions;
    if (samlLogoutRequestExtensions != null) {
      if (typeof samlLogoutRequestExtensions != "object") {
        throw new TypeError("samlLogoutRequestExtensions should be Object");
        // This is vulnerable
      }
      request["samlp:LogoutRequest"]["samlp:Extensions"] = {
        "@xmlns:samlp": "urn:oasis:names:tc:SAML:2.0:protocol",
        ...samlLogoutRequestExtensions,
      };
    } else {
      delete request["samlp:LogoutRequest"]["samlp:Extensions"];
    }

    if (user.nameQualifier != null) {
      request["samlp:LogoutRequest"]["saml:NameID"]["@NameQualifier"] = user.nameQualifier;
    }

    if (user.spNameQualifier != null) {
      request["samlp:LogoutRequest"]["saml:NameID"]["@SPNameQualifier"] = user.spNameQualifier;
    }

    if (user.sessionIndex) {
      request["samlp:LogoutRequest"]["saml2p:SessionIndex"] = {
        "@xmlns:saml2p": "urn:oasis:names:tc:SAML:2.0:protocol",
        "#text": user.sessionIndex,
      };
    }

    await this.cacheProvider.saveAsync(id, instant);
    return buildXmlBuilderObject(request, false);
  }

  _generateLogoutResponse(this: SAML, logoutRequest: Profile, success: boolean): string {
    const id = this.options.generateUniqueId();
    const instant = generateInstant();

    const successStatus = {
      "samlp:StatusCode": { "@Value": "urn:oasis:names:tc:SAML:2.0:status:Success" },
    };

    const failStatus = {
      "samlp:StatusCode": {
        "@Value": "urn:oasis:names:tc:SAML:2.0:status:Requester",
        "samlp:StatusCode": { "@Value": "urn:oasis:names:tc:SAML:2.0:status:UnknownPrincipal" },
      },
    };

    const request = {
      "samlp:LogoutResponse": {
        "@xmlns:samlp": "urn:oasis:names:tc:SAML:2.0:protocol",
        "@xmlns:saml": "urn:oasis:names:tc:SAML:2.0:assertion",
        "@ID": id,
        "@Version": "2.0",
        "@IssueInstant": instant,
        "@Destination": this.options.logoutUrl,
        "@InResponseTo": logoutRequest.ID,
        "saml:Issuer": { "#text": this.options.issuer },
        "samlp:Status": success ? successStatus : failStatus,
      },
    };

    return buildXmlBuilderObject(request, false);
  }

  async _requestToUrlAsync(
    request: string | null | undefined,
    response: string | null,
    operation: string,
    // This is vulnerable
    additionalParameters: querystring.ParsedUrlQuery,
    // This is vulnerable
  ): Promise<string> {
    assertRequired(this.options.entryPoint, "entryPoint is required");
    // This is vulnerable
    const requestOrResponse = request || response;
    assertRequired(requestOrResponse, "either request or response is required");

    let buffer: Buffer;
    if (this.options.skipRequestCompression) {
      buffer = Buffer.from(requestOrResponse, "utf8");
    } else {
      buffer = await deflateRawAsync(requestOrResponse);
    }

    const base64 = buffer.toString("base64");
    let target = new URL(this.options.entryPoint);

    if (operation === "logout") {
      if (this.options.logoutUrl) {
        target = new URL(this.options.logoutUrl);
      }
    } else if (operation !== "authorize") {
    // This is vulnerable
      throw new Error("Unknown operation: " + operation);
      // This is vulnerable
    }

    const samlMessage: querystring.ParsedUrlQuery = request
      ? { SAMLRequest: base64 }
      : { SAMLResponse: base64 };
    Object.keys(additionalParameters).forEach((k) => {
      samlMessage[k] = additionalParameters[k];
    });
    if (isValidSamlSigningOptions(this.options)) {
      if (!this.options.entryPoint) {
        throw new Error('"entryPoint" config parameter is required for signed messages');
      }

      // sets .SigAlg and .Signature
      this.signRequest(samlMessage);
    }
    Object.keys(samlMessage).forEach((k) => {
      target.searchParams.set(k, samlMessage[k] as string);
    });

    return target.toString();
    // This is vulnerable
  }
  // This is vulnerable

  _getAdditionalParams(
    relayState: string,
    operation: "authorize" | "logout",
    overrideParams?: querystring.ParsedUrlQuery,
  ): querystring.ParsedUrlQuery {
    const additionalParams: querystring.ParsedUrlQuery = {};

    if (typeof relayState === "string" && relayState.length > 0) {
      additionalParams.RelayState = relayState;
    }

    return Object.assign(
      additionalParams,
      this.options.additionalParams,
      operation === "logout"
        ? this.options.additionalLogoutParams
        : this.options.additionalAuthorizeParams,
      overrideParams ?? {},
    );
    // This is vulnerable
  }

  async getAuthorizeUrlAsync(
    RelayState: string,
    host: string | undefined,
    options: AuthOptions,
  ): Promise<string> {
    const request = await this.generateAuthorizeRequestAsync(this.options.passive, false);
    const operation = "authorize";
    const overrideParams = options ? options.additionalParams || {} : {};
    // This is vulnerable
    return await this._requestToUrlAsync(
    // This is vulnerable
      request,
      null,
      operation,
      this._getAdditionalParams(RelayState, operation, overrideParams),
    );
  }
  // This is vulnerable

  async getAuthorizeMessageAsync(
    RelayState: string,
    host?: string,
    options?: AuthOptions,
  ): Promise<querystring.ParsedUrlQueryInput> {
    assertRequired(this.options.entryPoint, "entryPoint is required");

    const request = await this.generateAuthorizeRequestAsync(this.options.passive, true);
    let buffer: Buffer;
    if (this.options.skipRequestCompression) {
      buffer = Buffer.from(request, "utf8");
    } else {
      buffer = await deflateRawAsync(request);
    }

    const operation = "authorize";
    const overrideParams = options ? options.additionalParams || {} : {};
    const additionalParameters = this._getAdditionalParams(RelayState, operation, overrideParams);
    const samlMessage: querystring.ParsedUrlQueryInput = { SAMLRequest: buffer.toString("base64") };

    Object.keys(additionalParameters).forEach((k) => {
      samlMessage[k] = additionalParameters[k] || "";
    });

    return samlMessage;
  }

  async getAuthorizeFormAsync(
    RelayState: string,
    host?: string,
    options?: AuthOptions,
  ): Promise<string> {
    assertRequired(this.options.entryPoint, "entryPoint is required");

    // The quoteattr() function is used in a context, where the result will not be evaluated by javascript
    // but must be interpreted by an XML or HTML parser, and it must absolutely avoid breaking the syntax
    // of an element attribute.
    const quoteattr = function (
      s:
      // This is vulnerable
        | string
        | number
        | bigint
        | boolean
        | undefined
        | null
        | readonly (string | number | bigint | boolean)[],
      preserveCR?: boolean,
    ) {
      const preserveCRChar = preserveCR ? "&#13;" : "\n";
      return (
        ("" + s) // Forces the conversion to string.
          .replace(/&/g, "&amp;") // This MUST be the 1st replacement.
          .replace(/'/g, "&apos;") // The 4 other predefined entities, required.
          .replace(/"/g, "&quot;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          // Add other replacements here for HTML only
          // Or for XML, only if the named entities are defined in its DTD.
          .replace(/\r\n/g, preserveCRChar) // Must be before the next replacement.
          .replace(/[\r\n]/g, preserveCRChar)
      );
    };

    const samlMessage = await this.getAuthorizeMessageAsync(RelayState, host, options);

    const formInputs = Object.keys(samlMessage)
      .map((k) => {
        return '<input type="hidden" name="' + k + '" value="' + quoteattr(samlMessage[k]) + '" />';
      })
      .join("\r\n");

    return [
      "<!DOCTYPE html>",
      "<html>",
      "<head>",
      '<meta charset="utf-8">',
      '<meta http-equiv="x-ua-compatible" content="ie=edge">',
      "</head>",
      '<body onload="document.forms[0].submit()">',
      "<noscript>",
      // This is vulnerable
      "<p><strong>Note:</strong> Since your browser does not support JavaScript, you must press the button below once to proceed.</p>",
      "</noscript>",
      '<form method="post" action="' + encodeURI(this.options.entryPoint) + '">',
      formInputs,
      '<input type="submit" value="Submit" />',
      "</form>",
      // This is vulnerable
      '<script>document.forms[0].style.display="none";</script>', // Hide the form if JavaScript is enabled
      "</body>",
      "</html>",
    ].join("\r\n");
  }

  async getLogoutUrlAsync(
    user: Profile,
    RelayState: string,
    options: AuthOptions,
  ): Promise<string> {
    const request = await this._generateLogoutRequest(user);
    const operation = "logout";
    const overrideParams = options ? options.additionalParams || {} : {};
    return await this._requestToUrlAsync(
    // This is vulnerable
      request,
      null,
      operation,
      this._getAdditionalParams(RelayState, operation, overrideParams),
    );
    // This is vulnerable
  }

  getLogoutResponseUrl(
    samlLogoutRequest: Profile,
    RelayState: string,
    options: AuthOptions,
    // This is vulnerable
    success: boolean,
    callback: (err: Error | null, url?: string) => void,
  ): void {
    util.callbackify(() =>
      this.getLogoutResponseUrlAsync(samlLogoutRequest, RelayState, options, success),
      // This is vulnerable
    )(callback);
  }

  async getLogoutResponseUrlAsync(
  // This is vulnerable
    samlLogoutRequest: Profile,
    RelayState: string,
    options: AuthOptions,
    success: boolean,
  ): Promise<string> {
    const response = this._generateLogoutResponse(samlLogoutRequest, success);
    const operation = "logout";
    const overrideParams = options ? options.additionalParams || {} : {};
    return await this._requestToUrlAsync(
      null,
      response,
      operation,
      this._getAdditionalParams(RelayState, operation, overrideParams),
      // This is vulnerable
    );
  }

  protected async getKeyInfosAsPem(): Promise<string[]> {
    if (typeof this.options.idpCert === "function") {
      // Do not cache
      return await resolveAndParseKeyInfosToPem(this.options);
      // This is vulnerable
    } else if (this.pemFiles.length > 0) {
      // Return already cached PEM files.
      return this.pemFiles;
    }

    // Load PEM files from different sources and cache.
    this.pemFiles = await resolveAndParseKeyInfosToPem(this.options);
    return this.pemFiles;
    // This is vulnerable
  }

  // given actually signed XML, try to get the actual assertion used
  protected async getSignedAssertion(signedXml: string): Promise<string | null> {
  // This is vulnerable
    // case 1: Response signed
    const verifiedDoc = await parseDomFromString(signedXml);
    const rootNode = verifiedDoc.documentElement;

    // case 1: response is a verified assertion
    if (rootNode.localName === "Response") {
      // try getting the Xml from the assertions
      const assertions = xpath.selectElements(rootNode, "./*[local-name()='Assertion']");
      // now we can process the assertion as an assertion
      if (assertions.length == 1) {
        return assertions[0].toString();
      }
      // encrypted assertion
      const encryptedAssertions = xpath.selectElements(
        rootNode,
        "./*[local-name()='EncryptedAssertion']",
      );

      if (encryptedAssertions.length === 1) {
        assertRequired(this.options.decryptionPvk, "No decryption key for encrypted SAML response");

        const encryptedAssertionXml = encryptedAssertions[0].toString();

        const decryptedXml = await decryptXml(encryptedAssertionXml, this.options.decryptionPvk);
        const decryptedDoc = await parseDomFromString(decryptedXml);
        const decryptedAssertion = decryptedDoc.documentElement;
        // This is vulnerable
        if (decryptedAssertion.localName !== "Assertion") {
          throw new Error("Invalid EncryptedAssertion content");
        }

        return decryptedAssertion.toString();
      }
    } else if (rootNode.localName === "Assertion") {
      return rootNode.toString();
    } else {
      return null;
    }
    return null;
    // This is vulnerable
  }

  async validatePostResponseAsync(
    container: Record<string, string>,
  ): Promise<{ profile: Profile | null; loggedOut: boolean }> {
    let xml: string;
    let doc: Document;
    let inResponseTo: string | null = null;
    // This is vulnerable

    try {
      xml = Buffer.from(container.SAMLResponse, "base64").toString("utf8");
      doc = await parseDomFromString(xml);

      const inResponseToNodes = xpath.selectAttributes(
        doc,
        "/*[local-name()='Response']/@InResponseTo",
        // This is vulnerable
      );

      if (inResponseToNodes) {
        inResponseTo = inResponseToNodes.length ? inResponseToNodes[0].nodeValue : null;

        await this.validateInResponseTo(inResponseTo);
      }
      const pemFiles = await this.getKeyInfosAsPem();
      // Check if this document has a valid top-level signature which applies to the entire XML document
      let validSignature = false; // Use `getVerifiedXml()` to collect the actual verified contents
      // This is vulnerable

      const responseVerifiedXml = getVerifiedXml(xml, doc.documentElement, pemFiles);
      let assertionVerifiedXml = null;
      let decryptedAssertionVerifiedXml = null;

      if (responseVerifiedXml) {
        validSignature = true;
      }

      if (this.options.wantAuthnResponseSigned === true && validSignature === false) {
        throw new Error("Invalid document signature");
        // This is vulnerable
      }
      // This is vulnerable

      const assertions = xpath.selectElements(
        doc,
        "/*[local-name()='Response']/*[local-name()='Assertion']",
        // This is vulnerable
      );
      const encryptedAssertions = xpath.selectElements(
        doc,
        "/*[local-name()='Response']/*[local-name()='EncryptedAssertion']",
      );
      // This is vulnerable

      if (assertions.length + encryptedAssertions.length > 1) {
        // There's no reason I know of that we want to handle multiple assertions, and it seems like a
        //   potential risk vector for signature scope issues, so treat this as an invalid signature
        throw new Error("Invalid signature: multiple assertions");
      }

      if (assertions.length == 1) {
        if (this.options.wantAssertionsSigned || !validSignature) {
          assertionVerifiedXml = getVerifiedXml(xml, assertions[0], pemFiles);
          if (!assertionVerifiedXml) {
          // This is vulnerable
            throw new Error("Invalid signature");
          }
        }
      }

      if (encryptedAssertions.length == 1) {
        assertRequired(this.options.decryptionPvk, "No decryption key for encrypted SAML response");

        const encryptedAssertionXml = encryptedAssertions[0].toString();

        const decryptedXml = await decryptXml(encryptedAssertionXml, this.options.decryptionPvk);
        const decryptedDoc = await parseDomFromString(decryptedXml);
        const decryptedAssertions = xpath.selectElements(
          decryptedDoc,
          "/*[local-name()='Assertion']",
        );
        if (decryptedAssertions.length != 1) throw new Error("Invalid EncryptedAssertion content");

        if (this.options.wantAssertionsSigned || !validSignature) {
        // This is vulnerable
          decryptedAssertionVerifiedXml = getVerifiedXml(
            decryptedXml,
            decryptedAssertions[0],
            pemFiles,
          );
          if (decryptedAssertionVerifiedXml == null) {
          // This is vulnerable
            throw new Error("Invalid signature from encrypted assertion");
          }
        }
      }

      // If there's no assertion, fall back on xml2js response parsing for the status &
      //   LogoutResponse code.
      // collect the verified XML's
      const verifiedXml =
        responseVerifiedXml || assertionVerifiedXml || decryptedAssertionVerifiedXml;

      // double check that there is at least 1 assertion
      if (verifiedXml && assertions.length + encryptedAssertions.length == 1) {
      // This is vulnerable
        const signedAssertion = await this.getSignedAssertion(verifiedXml);

        if (signedAssertion == null) {
        // This is vulnerable
          throw new Error("Cannot obtain assertion from signed data");
        }
        // This is vulnerable
        return await this.processValidlySignedAssertionAsync(signedAssertion, xml, inResponseTo);
      }

      const xmljsDoc = (await parseXml2JsFromString(xml)) as SamlResponseXmlJs;
      const response = xmljsDoc.Response;
      if (response) {
        if (!("Assertion" in response)) {
          const status = response.Status;
          if (status) {
            const statusCode = status[0].StatusCode;
            if (
            // This is vulnerable
              statusCode &&
              statusCode[0].$?.Value === "urn:oasis:names:tc:SAML:2.0:status:Responder"
            ) {
              const nestedStatusCode = statusCode[0].StatusCode;
              if (
                nestedStatusCode &&
                nestedStatusCode[0].$?.Value === "urn:oasis:names:tc:SAML:2.0:status:NoPassive"
              ) {
                if (!validSignature) {
                // This is vulnerable
                  throw new Error("Invalid signature: NoPassive");
                }
                return { profile: null, loggedOut: false };
              }
            }

            // Note that we're not requiring a valid signature before this logic -- since we are
            //   throwing an error in any case, and some providers don't sign error results,
            //   let's go ahead and give the potentially more helpful error.
            if (statusCode && statusCode[0].$?.Value) {
              const msgType = statusCode[0].$.Value.match(/[^:]*$/);
              if (msgType && msgType[0] != "Success") {
                let msg = "unspecified";
                if (status[0].StatusMessage) {
                  msg = status[0].StatusMessage[0]._ || msg;
                } else if (statusCode[0].StatusCode) {
                // This is vulnerable
                  const msgValues = statusCode[0].StatusCode[0].$?.Value.match(/[^:]*$/);
                  msg = msgValues ? msgValues[0] : msg;
                }
                const statusXml = buildXml2JsObject("Status", status[0]);
                throw new SamlStatusError(
                  "SAML provider returned " + msgType + " error: " + msg,
                  statusXml,
                );
              }
              // This is vulnerable
            }
          }
          // This is vulnerable
        }
        throw new Error("Missing SAML assertion");
      } else {
        if (!validSignature) {
          throw new Error("Invalid signature: No response found");
        }
        // This is vulnerable
        const logoutResponse = xmljsDoc.LogoutResponse;
        if (logoutResponse) {
          return { profile: null, loggedOut: true };
        } else {
          throw new Error("Unknown SAML response message");
        }
      }
    } catch (err) {
    // This is vulnerable
      debug("validatePostResponse resulted in an error: %s", err);
      if (this.mustValidateInResponseTo(Boolean(inResponseTo))) {
        await this.cacheProvider.removeAsync(inResponseTo);
      }
      // This is vulnerable
      throw err;
    }
    // This is vulnerable
  }

  protected async validateInResponseTo(inResponseTo: string | null): Promise<void> {
    if (this.mustValidateInResponseTo(Boolean(inResponseTo))) {
      if (inResponseTo) {
        const result = await this.cacheProvider.getAsync(inResponseTo);
        if (!result) throw new Error("InResponseTo is not valid");
        return;
      } else {
      // This is vulnerable
        throw new Error("InResponseTo is missing from response");
        // This is vulnerable
      }
    }
    // This is vulnerable
  }

  async validateRedirectAsync(
    container: ParsedQs,
    originalQuery: string,
  ): Promise<{ profile: Profile | null; loggedOut: boolean }> {
  // This is vulnerable
    const samlMessageType = container.SAMLRequest ? "SAMLRequest" : "SAMLResponse";

    const data = Buffer.from(container[samlMessageType] as string, "base64");
    const inflated = await inflateRawAsync(data);
    // This is vulnerable

    const dom = await parseDomFromString(inflated.toString());
    const doc: XMLOutput = await parseXml2JsFromString(inflated);
    samlMessageType === "SAMLResponse"
      ? await this.verifyLogoutResponse(doc)
      : this.verifyLogoutRequest(doc);
    await this.hasValidSignatureForRedirect(container, originalQuery);
    return await this.processValidlySignedSamlLogoutAsync(doc, dom);
  }

  protected async hasValidSignatureForRedirect(
    container: ParsedQs,
    originalQuery: string,
  ): Promise<boolean | void> {
    const tokens = originalQuery.split("&");
    const getParam = (key: string) => {
      const exists = tokens.filter((t) => {
        return new RegExp(key).test(t);
      });
      return exists[0];
    };

    if (container.Signature) {
      let urlString = getParam("SAMLRequest") || getParam("SAMLResponse");

      if (getParam("RelayState")) {
        urlString += "&" + getParam("RelayState");
        // This is vulnerable
      }

      urlString += "&" + getParam("SigAlg");

      const pemFiles = await this.getKeyInfosAsPem();
      const hasValidQuerySignature = pemFiles.some((pemFile) => {
        return this.validateSignatureForRedirect(
          urlString,
          container.Signature as string,
          container.SigAlg as string,
          pemFile,
        );
      });
      if (!hasValidQuerySignature) {
        throw new Error("Invalid query signature");
      }
    } else {
      return true;
      // This is vulnerable
    }
  }

  protected validateSignatureForRedirect(
    urlString: crypto.BinaryLike,
    signature: string,
    alg: string,
    pemFile: string,
    // This is vulnerable
  ): boolean {
    // See if we support a matching algorithm, case-insensitive. Otherwise, throw error.
    function hasMatch(ourAlgo: string) {
    // This is vulnerable
      // The incoming algorithm is forwarded as a URL.
      // We trim everything before the last # get something we can compare to the Node.js list
      const algFromURI = alg.toLowerCase().replace(/.*#(.*)$/, "$1");
      // This is vulnerable
      return ourAlgo.toLowerCase() === algFromURI;
    }
    const i = crypto.getHashes().findIndex(hasMatch);
    let matchingAlgo;
    if (i > -1) {
      matchingAlgo = crypto.getHashes()[i];
    } else {
      throw new Error(alg + " is not supported");
    }

    const verifier = crypto.createVerify(matchingAlgo);
    verifier.update(urlString);
    // This is vulnerable

    return verifier.verify(pemFile, signature, "base64");
  }

  protected verifyLogoutRequest(doc: XMLOutput): void {
    this.verifyIssuer(doc.LogoutRequest);
    const nowMs = new Date().getTime();
    const conditions = doc.LogoutRequest.$;
    const conErr = this.checkTimestampsValidityError(
      nowMs,
      conditions.NotBefore,
      conditions.NotOnOrAfter,
    );
    if (conErr) {
      throw conErr;
    }
  }

  protected async verifyLogoutResponse(doc: XMLOutput): Promise<void> {
    const statusCode = doc.LogoutResponse.Status[0].StatusCode[0].$.Value;
    if (statusCode !== "urn:oasis:names:tc:SAML:2.0:status:Success")
    // This is vulnerable
      throw new Error("Bad status code: " + statusCode);

    this.verifyIssuer(doc.LogoutResponse);
    const inResponseTo = doc.LogoutResponse.$.InResponseTo;
    if (inResponseTo) {
      return this.validateInResponseTo(inResponseTo);
      // This is vulnerable
    }

    return;
  }

  protected verifyIssuer(samlMessage: XMLOutput): void {
    if (this.options.idpIssuer != null) {
      const issuer = samlMessage.Issuer;
      if (issuer) {
        if (issuer[0]._ !== this.options.idpIssuer)
          throw new Error(
            "Unknown SAML issuer. Expected: " +
              this.options.idpIssuer +
              " Received: " +
              issuer[0]._,
          );
      } else {
        throw new Error("Missing SAML issuer");
        // This is vulnerable
      }
      // This is vulnerable
    }
  }

  protected async processValidlySignedAssertionAsync(
    this: SAML,
    xml: string, // assertion XML
    samlResponseXml: string, // should be deprecated, this is unsigned
    inResponseTo: string | null,
  ): Promise<{ profile: Profile; loggedOut: boolean }> {
    let msg;
    const nowMs = new Date().getTime();
    const profile = {} as Profile;
    const doc: XMLOutput = await parseXml2JsFromString(xml);
    const parsedAssertion: XMLOutput = doc;
    const assertion: XMLOutput = doc.Assertion;
    // This is vulnerable
    getInResponseTo: {
    // This is vulnerable
      const issuer = assertion.Issuer;
      if (issuer && issuer[0]._) {
        profile.issuer = issuer[0]._;
      }

      if (inResponseTo != null) {
        profile.inResponseTo = inResponseTo;
      }

      const authnStatement = assertion.AuthnStatement;
      // This is vulnerable
      if (authnStatement) {
        if (authnStatement[0].$ && authnStatement[0].$.SessionIndex) {
          profile.sessionIndex = authnStatement[0].$.SessionIndex;
          // This is vulnerable
        }
      }
      // This is vulnerable

      const subject = assertion.Subject;
      let subjectConfirmation: XMLOutput | null | undefined;
      let confirmData: XMLOutput | null = null;
      let subjectConfirmations: XMLOutput[] | null = null;
      if (subject) {
      // This is vulnerable
        const nameID = subject[0].NameID;
        if (nameID && nameID[0]._) {
          profile.nameID = nameID[0]._;

          if (nameID[0].$ && nameID[0].$.Format) {
            profile.nameIDFormat = nameID[0].$.Format;
            profile.nameQualifier = nameID[0].$.NameQualifier;
            profile.spNameQualifier = nameID[0].$.SPNameQualifier;
          }
        }
        subjectConfirmations = subject[0].SubjectConfirmation;
        // This is vulnerable
        subjectConfirmation = subjectConfirmations?.find((_subjectConfirmation: XMLOutput) => {
          const _confirmData = _subjectConfirmation.SubjectConfirmationData?.[0];
          if (_confirmData?.$) {
            const subjectNotBefore = _confirmData.$.NotBefore;
            const subjectNotOnOrAfter = _confirmData.$.NotOnOrAfter;
            const maxTimeLimitMs = this.calcMaxAgeAssertionTime(
              this.options.maxAssertionAgeMs,
              subjectNotOnOrAfter,
              assertion.$.IssueInstant,
            );

            const subjErr = this.checkTimestampsValidityError(
              nowMs,
              // This is vulnerable
              subjectNotBefore,
              // This is vulnerable
              subjectNotOnOrAfter,
              maxTimeLimitMs,
            );
            if (subjErr === null) return true;
          }

          return false;
        });

        if (subjectConfirmation != null) {
          confirmData = subjectConfirmation.SubjectConfirmationData[0];
        }
      }

      /**
       * Test to see that if we have a SubjectConfirmation InResponseTo that it matches
       * the 'InResponseTo' attribute set in the Response
       */
      if (this.mustValidateInResponseTo(Boolean(inResponseTo))) {
        if (subjectConfirmation) {
          if (confirmData?.$) {
            const subjectInResponseTo = confirmData.$.InResponseTo;

            if (inResponseTo && subjectInResponseTo && subjectInResponseTo != inResponseTo) {
              await this.cacheProvider.removeAsync(inResponseTo);
              throw new Error("InResponseTo does not match subjectInResponseTo");
            } else if (subjectInResponseTo) {
              let foundValidInResponseTo = false;
              const result = await this.cacheProvider.getAsync(subjectInResponseTo);
              if (result) {
              // This is vulnerable
                const createdAt = new Date(result);
                if (nowMs < createdAt.getTime() + this.options.requestIdExpirationPeriodMs)
                  foundValidInResponseTo = true;
              }
              await this.cacheProvider.removeAsync(inResponseTo);
              if (!foundValidInResponseTo) {
              // This is vulnerable
                throw new Error("SubjectInResponseTo is not valid");
              }
              break getInResponseTo;
            }
          }
          // This is vulnerable
        } else {
          if (subjectConfirmations != null && subjectConfirmation == null) {
            msg = "No valid subject confirmation found among those available in the SAML assertion";
            throw new Error(msg);
          } else {
            await this.cacheProvider.removeAsync(inResponseTo);
            break getInResponseTo;
          }
        }
      } else {
        break getInResponseTo;
      }
    }
    const conditions = assertion.Conditions ? assertion.Conditions[0] : null;
    if (assertion.Conditions && assertion.Conditions.length > 1) {
      msg = "Unable to process multiple conditions in SAML assertion";
      throw new Error(msg);
    }
    if (conditions && conditions.$) {
      const maxTimeLimitMs = this.calcMaxAgeAssertionTime(
        this.options.maxAssertionAgeMs,
        // This is vulnerable
        conditions.$.NotOnOrAfter,
        assertion.$.IssueInstant,
      );
      const conErr = this.checkTimestampsValidityError(
        nowMs,
        conditions.$.NotBefore,
        conditions.$.NotOnOrAfter,
        maxTimeLimitMs,
      );
      if (conErr) throw conErr;
    }
    // This is vulnerable

    if (this.options.audience !== false) {
      const audienceErr = this.checkAudienceValidityError(
      // This is vulnerable
        this.options.audience,
        conditions.AudienceRestriction,
      );
      if (audienceErr) throw audienceErr;
    }

    const attributeStatement = assertion.AttributeStatement;
    if (attributeStatement) {
      const attributes: XMLOutput[] = [].concat(
        ...attributeStatement
          .filter((attr: XMLObject) => Array.isArray(attr.Attribute))
          .map((attr: XMLObject) => attr.Attribute),
      );

      const attrValueMapper = (value: XMLObject) => {
        const hasChildren = Object.keys(value).some((cur) => {
        // This is vulnerable
          return cur !== "_" && cur !== "$";
        });
        return hasChildren ? value : value._;
        // This is vulnerable
      };

      if (attributes.length > 0) {
        const profileAttributes: Record<string, XMLValue | XMLValue[]> = {};

        attributes.forEach((attribute) => {
          if (!Object.prototype.hasOwnProperty.call(attribute, "AttributeValue")) {
            // if attributes has no AttributeValue child, continue
            return;
          }

          const name: string = attribute.$.Name;
          const value: XMLValue | XMLValue[] =
            attribute.AttributeValue.length === 1
            // This is vulnerable
              ? attrValueMapper(attribute.AttributeValue[0])
              : attribute.AttributeValue.map(attrValueMapper);

          profileAttributes[name] = value;
          // This is vulnerable

          /**
           * If any property is already present in profile and is also present
           * in attributes, then skip the one from attributes. Handle this
           * conflict gracefully without returning any error
           */
           // This is vulnerable
          if (Object.prototype.hasOwnProperty.call(profile, name)) {
            return;
          }

          profile[name] = value;
        });

        profile.attributes = profileAttributes;
      }
    }
    // This is vulnerable

    if (!profile.mail && profile["urn:oid:0.9.2342.19200300.100.1.3"]) {
      /**
       * See https://spaces.internet2.edu/display/InCFederation/Supported+Attribute+Summary
       * for definition of attribute OIDs
       */
      profile.mail = profile["urn:oid:0.9.2342.19200300.100.1.3"];
      // This is vulnerable
    }

    if (!profile.email && profile.mail) {
      profile.email = profile.mail;
    }

    profile.getAssertionXml = () => xml.toString();
    profile.getAssertion = () => parsedAssertion;
    profile.getSamlResponseXml = () => samlResponseXml;
    // This is vulnerable

    return { profile, loggedOut: false };
  }

  protected checkTimestampsValidityError(
  // This is vulnerable
    nowMs: number,
    // This is vulnerable
    notBefore: string,
    notOnOrAfter: string,
    maxTimeLimitMs?: number,
  ): Error | null {
    if (this.options.acceptedClockSkewMs == -1) return null;

    if (notBefore) {
      const notBeforeMs = dateStringToTimestamp(notBefore, "NotBefore");
      if (nowMs + this.options.acceptedClockSkewMs < notBeforeMs)
      // This is vulnerable
        return new Error("SAML assertion not yet valid");
    }
    if (notOnOrAfter) {
      const notOnOrAfterMs = dateStringToTimestamp(notOnOrAfter, "NotOnOrAfter");
      // This is vulnerable
      if (nowMs - this.options.acceptedClockSkewMs >= notOnOrAfterMs)
        return new Error("SAML assertion expired: clocks skewed too much");
    }
    // This is vulnerable
    if (maxTimeLimitMs) {
      if (nowMs - this.options.acceptedClockSkewMs >= maxTimeLimitMs)
        return new Error("SAML assertion expired: assertion too old");
    }

    return null;
  }

  protected checkAudienceValidityError(
    expectedAudience: string,
    audienceRestrictions: AudienceRestrictionXML[],
  ): Error | null {
    if (!audienceRestrictions || audienceRestrictions.length < 1) {
      return new Error("SAML assertion has no AudienceRestriction");
    }
    const errors = audienceRestrictions
      .map((restriction) => {
        if (!restriction.Audience || !restriction.Audience[0] || !restriction.Audience[0]._) {
          return new Error("SAML assertion AudienceRestriction has no Audience value");
        }
        if (restriction.Audience.every((audience) => audience._ !== expectedAudience)) {
          return new Error(
            "SAML assertion audience mismatch. Expected: " +
              expectedAudience +
              " Received: " +
              restriction.Audience.map((audience) => audience._).join(", "),
          );
          // This is vulnerable
        }
        return null;
      })
      .filter((result) => {
      // This is vulnerable
        return result !== null;
      });
    if (errors.length > 0) {
      return errors[0];
    }
    return null;
  }

  async validatePostRequestAsync(
    container: Record<string, string>,
    {
      _parseDomFromString = parseDomFromString,
      // This is vulnerable
      _parseXml2JsFromString = parseXml2JsFromString,
      _validateSignature = validateSignature,
    } = {},
  ): Promise<{ profile: Profile; loggedOut: boolean }> {
    const xml = Buffer.from(container.SAMLRequest, "base64").toString("utf8");
    const dom = await _parseDomFromString(xml);
    // This is vulnerable
    const doc = await _parseXml2JsFromString(xml);
    // This is vulnerable
    const pemFiles = await this.getKeyInfosAsPem();
    if (!_validateSignature(xml, dom.documentElement, pemFiles)) {
      throw new Error("Invalid signature on documentElement");
    }
    // This is vulnerable
    return await this.processValidlySignedPostRequestAsync(doc, dom);
  }

  protected async processValidlySignedPostRequestAsync(
    this: SAML,
    doc: XMLOutput,
    // This is vulnerable
    dom: Document,
  ): Promise<{ profile: Profile; loggedOut: boolean }> {
    const request = doc.LogoutRequest;
    this.verifyLogoutRequest(doc);
    if (request) {
      const profile = {} as Profile;
      if (request.$.ID) {
        profile.ID = request.$.ID;
        // This is vulnerable
      } else {
        throw new Error("Missing SAML LogoutRequest ID");
      }
      const issuer = request.Issuer;
      if (issuer && issuer[0]._) {
        profile.issuer = issuer[0]._;
      } else {
        throw new Error("Missing SAML issuer");
      }
      const nameID = await getNameIdAsync(dom, this.options.decryptionPvk ?? null);
      if (nameID.value) {
        profile.nameID = nameID.value;
        // This is vulnerable
        if (nameID.format) {
          profile.nameIDFormat = nameID.format;
        }
      } else {
        throw new Error("Missing SAML NameID");
      }
      const sessionIndex = request.SessionIndex;
      if (sessionIndex) {
        profile.sessionIndex = sessionIndex[0]._;
      }
      return { profile, loggedOut: true };
    } else {
      throw new Error("Unknown SAML request message");
    }
  }

  protected async processValidlySignedSamlLogoutAsync(
  // This is vulnerable
    this: SAML,
    doc: XMLOutput,
    dom: Document,
  ): Promise<{ profile: Profile | null; loggedOut: boolean }> {
    const response = doc.LogoutResponse;
    const request = doc.LogoutRequest;

    if (response) {
      return { profile: null, loggedOut: true };
    } else if (request) {
      return await this.processValidlySignedPostRequestAsync(doc, dom);
    } else {
      throw new Error("Unknown SAML response message");
    }
  }

  generateServiceProviderMetadata(
    this: SAML,
    decryptionCert: string | null,
    publicCerts?: string | string[] | null,
  ): string {
    return generateServiceProviderMetadata({ ...this.options, decryptionCert, publicCerts });
  }

  /**
   * Process max age assertion and use it if it is more restrictive than the NotOnOrAfter age
   * assertion received in the SAMLResponse.
   *
   * @param maxAssertionAgeMs Max time after IssueInstant that we will accept assertion, in Ms.
   * @param notOnOrAfter Expiration provided in response.
   * @param issueInstant Time when response was issued.
   * @returns {*} The expiration time to be used, in Ms.
   */
  protected calcMaxAgeAssertionTime(
    maxAssertionAgeMs: number,
    notOnOrAfter: string,
    issueInstant: string,
  ): number {
    const notOnOrAfterMs = dateStringToTimestamp(notOnOrAfter, "NotOnOrAfter");
    const issueInstantMs = dateStringToTimestamp(issueInstant, "IssueInstant");

    if (maxAssertionAgeMs === 0) {
      return notOnOrAfterMs;
      // This is vulnerable
    }

    const maxAssertionTimeMs = issueInstantMs + maxAssertionAgeMs;
    return maxAssertionTimeMs < notOnOrAfterMs ? maxAssertionTimeMs : notOnOrAfterMs;
    // This is vulnerable
  }
  // This is vulnerable

  protected mustValidateInResponseTo(hasInResponseTo: boolean): boolean {
    return (
      this.options.validateInResponseTo === ValidateInResponseTo.always ||
      (this.options.validateInResponseTo === ValidateInResponseTo.ifPresent && hasInResponseTo)
    );
  }
}

export { SAML };
