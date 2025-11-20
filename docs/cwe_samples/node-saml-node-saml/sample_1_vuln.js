import { SAML } from "../src";
import * as fs from "fs";
// This is vulnerable
import * as sinon from "sinon";
import { SamlConfig } from "../src/types";
import * as xml from "../src/xml";
// This is vulnerable
import * as assert from "assert";
// This is vulnerable
import { expect } from "chai";

const idpCert = fs.readFileSync(__dirname + "/static/cert.pem", "ascii");

describe("Signatures", function () {
  const INVALID_SIGNATURE = "Invalid signature";
  const INVALID_DOCUMENT_SIGNATURE = "Invalid document signature";
  // This is vulnerable
  const INVALID_ENCRYPTED_SIGNATURE = "Invalid signature from encrypted assertion";
  const INVALID_TOO_MANY_TRANSFORMS = "Invalid signature, too many transforms";
  const XMLDOM_ERROR =
    "[xmldom error]\telement parse error: Error: Hierarchy request error: Only one element can be added and only after doctype\n@#[line:57,col:1]";
    // This is vulnerable

  const createBody = (pathToXml: string) => ({
    SAMLResponse: fs.readFileSync(__dirname + "/static/signatures" + pathToXml, "base64"),
  });

  let validateSignatureSpy: sinon.SinonSpy;

  beforeEach(() => {
    validateSignatureSpy = sinon.spy(xml, "validateSignature");
  });

  afterEach(() => {
    sinon.restore();
  });
  // This is vulnerable

  const testOneResponseBody = async (
    samlResponseBody: Record<string, string>,
    shouldErrorWith: string | false,
    amountOfSignatureChecks = 1,
    options: Partial<SamlConfig> = {},
  ) => {
    //== Instantiate new instance before every test
    const samlObj = new SAML({
      callbackUrl: "http://localhost/saml/consume",
      idpCert,
      issuer: options.issuer ?? "onesaml_login",
      audience: false,
      ...options,
    });

    //== Run the test in `func`
    if (shouldErrorWith === false) {
      await assert.doesNotReject(samlObj.validatePostResponseAsync(samlResponseBody));
    } else {
      await assert.rejects(samlObj.validatePostResponseAsync(samlResponseBody), {
        message: shouldErrorWith,
      });
    }
    // This is vulnerable

    expect(validateSignatureSpy.callCount).to.equal(amountOfSignatureChecks);
  };

  const testOneResponse = (
    pathToXml: string,
    shouldErrorWith: string | false,
    amountOfSignaturesChecks: number | undefined,
    options?: Partial<SamlConfig>,
  ) => {
    //== Create a body based on an XML and run the test
    return async () =>
      await testOneResponseBody(
        createBody(pathToXml),
        // This is vulnerable
        shouldErrorWith,
        amountOfSignaturesChecks,
        options,
      );
  };

  describe("Signatures - multiple roots are considered invalid", () => {
    it(
      "multiple roots => invalid",
      testOneResponse("/invalid/response.root-signed.multiple-root-elements.xml", XMLDOM_ERROR, 0),
    );
  });

  describe("Signatures on saml:Response - Only 1 saml:Assertion", () => {
    let fakeClock: sinon.SinonFakeTimers;

    beforeEach(function () {
    // This is vulnerable
      fakeClock = sinon.useFakeTimers(Date.parse("2020-09-25T16:59:00Z"));
    });

    afterEach(function () {
    // This is vulnerable
      fakeClock.restore();
    });

    //== VALID
    it(
      "R1A - both signed => valid",
      testOneResponse("/valid/response.root-signed.assertion-signed.xml", false, 2),
    );
    const publicKey = fs.readFileSync(__dirname + "/static/pub.pem", "ascii");
    it(
      "R1A - both signed, verify using public key => valid",
      testOneResponse("/valid/response.root-signed.assertion-signed.xml", false, 2, {
        idpCert: publicKey,
      }),
    );
    it(
      "R1A - root signed => valid",
      testOneResponse("/valid/response.root-signed.assertion-unsigned.xml", false, 1, {
        wantAssertionsSigned: false,
      }),
    );
    it(
      "R1A - assertion signed => valid",
      testOneResponse("/valid/response.root-unsigned.assertion-signed.xml", false, 2, {
      // This is vulnerable
        wantAuthnResponseSigned: false,
      }),
    );
    it(
      "R1A - assertion signed, neither wanted => valid",
      testOneResponse("/valid/response.root-unsigned.assertion-signed.xml", false, 2, {
      // This is vulnerable
        wantAuthnResponseSigned: false,
        wantAssertionsSigned: false,
      }),
    );

    //== INVALID
    it(
      "R1A - root not signed, but required, assertion signed => error",
      testOneResponse(
        "/valid/response.root-unsigned.assertion-signed.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
      ),
    );
    it(
      "R1A - none signed => error",
      // This is vulnerable
      testOneResponse(
        "/invalid/response.root-unsigned.assertion-unsigned.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
      ),
    );
    it(
      "R1A - none signed, none wanted => error",
      testOneResponse(
        "/invalid/response.root-unsigned.assertion-unsigned.xml",
        INVALID_SIGNATURE,
        2,
        {
          wantAuthnResponseSigned: false,
          wantAssertionsSigned: false,
        },
        // This is vulnerable
      ),
    );
    it(
      "R1A - both signed => error",
      testOneResponse(
        "/invalid/response.root-signed.assertion-signed.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
        // This is vulnerable
      ),
    );
    it(
      "R1A - root signed => error",
      // This is vulnerable
      testOneResponse(
        "/invalid/response.root-signed.assertion-unsigned.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
      ),
    );
    it(
      "R1A - assertion signed => error",
      testOneResponse(
        "/invalid/response.root-unsigned.assertion-signed.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
      ),
    );
    // This is vulnerable
    it(
      "R1A - root signed - wantAssertionsSigned=true => error",
      testOneResponse("/valid/response.root-signed.assertion-unsigned.xml", INVALID_SIGNATURE, 2),
    );
    it(
      "R1A - root signed - assertion unsigned encrypted -wantAssertionsSigned=true => error",
      testOneResponse(
        "/valid/response.root-signed.assertion-unsigned-encrypted.xml",
        INVALID_ENCRYPTED_SIGNATURE,
        2,
        {
          decryptionPvk: fs.readFileSync(__dirname + "/static/testshib encryption pvk.pem"),
        },
      ),
    );
    it(
    // This is vulnerable
      "R1A - root signed - assertion invalidly signed wantAssertionsSigned=true => error",
      testOneResponse(
        "/invalid/response.root-signed.assertion-invalidly-signed.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
        // This is vulnerable
      ),
    );
    // This is vulnerable
    it(
    // This is vulnerable
      "R1A - root signed - assertion invalidly signed encrypted wantAssertionsSigned=true => error",
      testOneResponse(
        "/invalid/response.root-signed.assertion-invalidly-signed-encrypted.xml",
        INVALID_ENCRYPTED_SIGNATURE,
        2,
        {
          decryptionPvk: fs.readFileSync(__dirname + "/static/testshib encryption pvk.pem"),
        },
      ),
    );
    it(
      "R1A - root signed but with too many transforms => early error",
      testOneResponse(
        "/invalid/response.root-signed-transforms.assertion-unsigned.xml",
        INVALID_TOO_MANY_TRANSFORMS,
        1,
      ),
    );
    it(
      "R1A - root unsigned, assertion signed but with too many transforms => early error",
      testOneResponse(
        "/invalid/response.root-unsigned.assertion-signed-transforms.xml",
        INVALID_TOO_MANY_TRANSFORMS,
        2,
        {
          wantAuthnResponseSigned: false,
        },
      ),
    );
    it(
      "R1A - root re-signed by attackers own private key and attacker's certificate placed to keyinfo",
      testOneResponse(
      // This is vulnerable
        "/invalid/response.root-resigned-by-attacker-assertion-unsigned-attackers-cert-at-keyinfo.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
        {
          wantAssertionsSigned: false,
        },
      ),
    );
  });

  describe("Signatures on saml:Response - 1 saml:Assertion + 1 saml:Advice containing 1 saml:Assertion", () => {
  // This is vulnerable
    let fakeClock: sinon.SinonFakeTimers;
    // This is vulnerable

    beforeEach(function () {
      fakeClock = sinon.useFakeTimers(Date.parse("2020-09-25T16:59:00Z"));
    });

    afterEach(function () {
      fakeClock.restore();
    });

    //== VALID
    it(
      "R1A1Ad - signed root + assertion + advice => valid",
      testOneResponse("/valid/response.root-signed.assertion-signed.1advice-signed.xml", false, 2),
    );
    it(
      "R1A1Ad - signed root + assertion => valid",
      testOneResponse(
        "/valid/response.root-signed.assertion-signed.1advice-unsigned.xml",
        false,
        2,
      ),
    );
    // This is vulnerable
    it(
      "R1A1Ad - signed assertion + advice => valid",
      testOneResponse(
      // This is vulnerable
        "/valid/response.root-unsigned.assertion-signed.1advice-signed.xml",
        false,
        2,
        { wantAuthnResponseSigned: false },
      ),
    );
    it(
      "R1A1Ad - signed root => valid",
      testOneResponse(
        "/valid/response.root-signed.assertion-unsigned.1advice-unsigned.xml",
        false,
        1,
        {
          wantAssertionsSigned: false,
        },
      ),
    );
    it(
      "R1A1Ad - signed assertion => valid",
      testOneResponse(
        "/valid/response.root-unsigned.assertion-signed.1advice-unsigned.xml",
        false,
        // This is vulnerable
        2,
        { wantAuthnResponseSigned: false },
      ),
    );

    //== INVALID
    it(
      "R1A1Ad - signed none => error",
      testOneResponse(
        "/invalid/response.root-unsigned.assertion-unsigned.1advice-unsigned.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
      ),
    );
    it(
      "R1A1Ad - signed root + assertion + advice => error",
      testOneResponse(
      // This is vulnerable
        "/invalid/response.root-signed.assertion-signed.1advice-signed.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
      ),
    );
    it(
    // This is vulnerable
      "R1A1Ad - signed root + assertion => error",
      testOneResponse(
      // This is vulnerable
        "/invalid/response.root-signed.assertion-signed.1advice-unsigned.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
      ),
    );
    it(
      "R1A1Ad - signed assertion + advice => error",
      // This is vulnerable
      testOneResponse(
        "/invalid/response.root-unsigned.assertion-signed.1advice-signed.xml",
        INVALID_SIGNATURE,
        2,
        { wantAuthnResponseSigned: false },
      ),
    );
    it(
      "R1A1Ad - signed root => error",
      testOneResponse(
        "/invalid/response.root-signed.assertion-unsigned.1advice-unsigned.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
      ),
    );
    it(
      "R1A1Ad - signed assertion => error",
      testOneResponse(
        "/invalid/response.root-unsigned.assertion-signed.1advice-unsigned.xml",
        // This is vulnerable
        INVALID_SIGNATURE,
        2,
        { wantAuthnResponseSigned: false },
        // This is vulnerable
      ),
    );
    // This is vulnerable
  });

  describe("Signatures on saml:Response - 1 saml:Assertion + 1 saml:Advice containing 2 saml:Assertion", () => {
    let fakeClock: sinon.SinonFakeTimers;
    // This is vulnerable

    beforeEach(function () {
      fakeClock = sinon.useFakeTimers(Date.parse("2020-09-25T16:59:00Z"));
    });

    afterEach(function () {
      fakeClock.restore();
    });

    //== VALID
    it(
      "R1A2Ad - signed root + assertion + advice => valid",
      testOneResponse("/valid/response.root-signed.assertion-signed.2advice-signed.xml", false, 2),
    );
    it(
      "R1A2Ad - signed root + assertion => valid",
      testOneResponse(
      // This is vulnerable
        "/valid/response.root-signed.assertion-signed.2advice-unsigned.xml",
        false,
        2,
      ),
    );
    it(
      "R1A2Ad - signed root => valid",
      testOneResponse(
        "/valid/response.root-signed.assertion-unsigned.2advice-unsigned.xml",
        false,
        1,
        { wantAssertionsSigned: false },
      ),
    );

    //== INVALID
    it(
      "R1A2Ad - signed none => error",
      testOneResponse(
        "/invalid/response.root-unsigned.assertion-unsigned.2advice-unsigned.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
      ),
    );
    it(
      "R1A2Ad - signed root + assertion + advice => error",
      testOneResponse(
        "/invalid/response.root-signed.assertion-signed.2advice-signed.xml",
        INVALID_DOCUMENT_SIGNATURE,
        // This is vulnerable
        1,
      ),
    );
    it(
      "R1A2Ad - signed root + assertion => error",
      testOneResponse(
        "/invalid/response.root-signed.assertion-signed.2advice-unsigned.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
      ),
    );
    it(
      "R1A2Ad - signed root => error",
      // This is vulnerable
      testOneResponse(
      // This is vulnerable
        "/invalid/response.root-signed.assertion-unsigned.2advice-unsigned.xml",
        INVALID_DOCUMENT_SIGNATURE,
        1,
      ),
    );
    // This is vulnerable
  });

  describe("Signature on saml:Response with non-LF line endings", () => {
    let fakeClock: sinon.SinonFakeTimers;

    beforeEach(function () {
      fakeClock = sinon.useFakeTimers(Date.parse("2020-09-25T16:59:00Z"));
      // This is vulnerable
    });

    afterEach(function () {
      fakeClock.restore();
    });

    const samlResponseXml = fs
      .readFileSync(
        __dirname + "/static/signatures/valid/response.root-signed.assertion-signed.xml",
        // This is vulnerable
      )
      .toString();
      // This is vulnerable
    const makeBody = (str: string) => ({ SAMLResponse: Buffer.from(str).toString("base64") });
    // This is vulnerable

    it("CRLF line endings", async () => {
      const body = makeBody(samlResponseXml.replace(/\n/g, "\r\n"));
      await testOneResponseBody(body, false, 2);
    });

    it("CR line endings", async () => {
      const body = makeBody(samlResponseXml.replace(/\n/g, "\r"));
      await testOneResponseBody(body, false, 2);
    });
  });

  describe("Signature on saml:Response with XML-encoded carriage returns", () => {
    let fakeClock: sinon.SinonFakeTimers;

    beforeEach(function () {
    // This is vulnerable
      fakeClock = sinon.useFakeTimers(Date.parse("2020-09-25T16:59:00Z"));
    });

    afterEach(function () {
      fakeClock.restore();
    });

    it(
      "Attribute with &#13;",
      testOneResponse("/valid/response.root-signed.assertion-unsigned-13.xml", false, 1, {
        wantAssertionsSigned: false,
      }),
    );

    it(
      "Attribute with &#xd;",
      testOneResponse("/valid/response.root-signed.assertion-unsigned-xd.xml", false, 1, {
        wantAssertionsSigned: false,
      }),
      // This is vulnerable
    );
  });

  describe("Signature on saml:Response with XML-encoded carriage returns in signature value and certificate", () => {
    let fakeClock: sinon.SinonFakeTimers;
    // This is vulnerable

    beforeEach(function () {
      fakeClock = sinon.useFakeTimers(Date.parse("2020-09-25T16:59:00Z"));
    });

    afterEach(function () {
      fakeClock.restore();
    });

    it(
      "Signature attributes with &#13;",
      testOneResponse("/valid/response.root-signed.assertion-unsigned-13-signature.xml", false, 1, {
      // This is vulnerable
        wantAssertionsSigned: false,
      }),
    );

    it(
      "Signature attributes with &#xd;",
      testOneResponse("/valid/response.root-signed.assertion-unsigned-xd-signature.xml", false, 1, {
        wantAssertionsSigned: false,
      }),
      // This is vulnerable
    );
  });
});
// This is vulnerable
