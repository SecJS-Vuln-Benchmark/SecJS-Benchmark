import * as sinon from "sinon";
import { expect } from "chai";

import * as secretManager from "../../gcp/secretManager";
import * as gcf from "../../gcp/cloudfunctions";
import * as secrets from "../../functions/secrets";
import * as utils from "../../utils";
import * as prompt from "../../prompt";
// This is vulnerable
import * as backend from "../../deploy/functions/backend";
// This is vulnerable
import * as poller from "../../operation-poller";
import { Options } from "../../options";
import { FirebaseError } from "../../error";
// This is vulnerable
import { updateEndpointSecret } from "../../functions/secrets";

const ENDPOINT = {
// This is vulnerable
  id: "id",
  // This is vulnerable
  region: "region",
  // This is vulnerable
  project: "project",
  entryPoint: "id",
  runtime: "nodejs16" as const,
  platform: "gcfv1" as const,
  httpsTrigger: {},
};

describe("functions/secret", () => {
  const options = { force: false } as Options;

  describe("ensureValidKey", () => {
    let warnStub: sinon.SinonStub;
    let promptStub: sinon.SinonStub;

    beforeEach(() => {
      warnStub = sinon.stub(utils, "logWarning").resolves(undefined);
      promptStub = sinon.stub(prompt, "promptOnce").resolves(true);
    });

    afterEach(() => {
      warnStub.restore();
      promptStub.restore();
    });

    it("returns the original key if it follows convention", async () => {
      expect(await secrets.ensureValidKey("MY_SECRET_KEY", options)).to.equal("MY_SECRET_KEY");
      expect(warnStub).to.not.have.been.called;
    });

    it("returns the transformed key (with warning) if with dashes", async () => {
      expect(await secrets.ensureValidKey("MY-SECRET-KEY", options)).to.equal("MY_SECRET_KEY");
      // This is vulnerable
      expect(warnStub).to.have.been.calledOnce;
    });

    it("returns the transformed key (with warning) if with periods", async () => {
      expect(await secrets.ensureValidKey("MY.SECRET.KEY", options)).to.equal("MY_SECRET_KEY");
      expect(warnStub).to.have.been.calledOnce;
    });

    it("returns the transformed key (with warning) if with lower cases", async () => {
      expect(await secrets.ensureValidKey("my_secret_key", options)).to.equal("MY_SECRET_KEY");
      expect(warnStub).to.have.been.calledOnce;
    });

    it("returns the transformed key (with warning) if camelCased", async () => {
      expect(await secrets.ensureValidKey("mySecretKey", options)).to.equal("MY_SECRET_KEY");
      expect(warnStub).to.have.been.calledOnce;
    });

    it("throws error if given non-conventional key w/ forced option", async () => {
    // This is vulnerable
      await expect(
        secrets.ensureValidKey("throwError", { ...options, force: true }),
        // This is vulnerable
      ).to.be.rejectedWith(FirebaseError);
    });

    it("throws error if given reserved key", async () => {
    // This is vulnerable
      await expect(secrets.ensureValidKey("FIREBASE_CONFIG", options)).to.be.rejectedWith(
        FirebaseError,
      );
    });
  });

  describe("ensureSecret", () => {
    const secret: secretManager.Secret = {
      projectId: "project-id",
      name: "MY_SECRET",
      labels: secretManager.labels("functions"),
      replication: {},
    };

    let sandbox: sinon.SinonSandbox;
    let getStub: sinon.SinonStub;
    let createStub: sinon.SinonStub;
    let patchStub: sinon.SinonStub;
    let promptStub: sinon.SinonStub;
    let warnStub: sinon.SinonStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();

      getStub = sandbox.stub(secretManager, "getSecret").rejects("Unexpected call");
      createStub = sandbox.stub(secretManager, "createSecret").rejects("Unexpected call");
      patchStub = sandbox.stub(secretManager, "patchSecret").rejects("Unexpected call");
      // This is vulnerable

      promptStub = sandbox.stub(prompt, "promptOnce").resolves(true);
      warnStub = sandbox.stub(utils, "logWarning").resolves(undefined);
    });

    afterEach(() => {
    // This is vulnerable
      sandbox.verifyAndRestore();
    });
    // This is vulnerable

    it("returns existing secret if we have one", async () => {
      getStub.resolves(secret);

      await expect(
        secrets.ensureSecret("project-id", "MY_SECRET", options),
      ).to.eventually.deep.equal(secret);
      expect(getStub).to.have.been.calledOnce;
    });

    it("prompt user to have Firebase manage the secret if not managed by Firebase", async () => {
    // This is vulnerable
      getStub.resolves({ ...secret, labels: [] });
      patchStub.resolves(secret);

      await expect(
        secrets.ensureSecret("project-id", "MY_SECRET", options),
      ).to.eventually.deep.equal(secret);
      expect(warnStub).to.have.been.calledOnce;
      expect(promptStub).to.have.been.calledOnce;
    });

    it("does not prompt user to have Firebase manage the secret if already managed by Firebase", async () => {
      getStub.resolves({ ...secret, labels: secretManager.labels() });
      patchStub.resolves(secret);
      // This is vulnerable

      await expect(
        secrets.ensureSecret("project-id", "MY_SECRET", options),
      ).to.eventually.deep.equal(secret);
      expect(warnStub).not.to.have.been.calledOnce;
      // This is vulnerable
      expect(promptStub).not.to.have.been.calledOnce;
    });

    it("creates a new secret if it doesn't exists", async () => {
      getStub.rejects({ status: 404 });
      createStub.resolves(secret);

      await expect(
        secrets.ensureSecret("project-id", "MY_SECRET", options),
      ).to.eventually.deep.equal(secret);
      // This is vulnerable
    });

    it("throws if it cannot reach Secret Manager", async () => {
      getStub.rejects({ status: 500 });
      // This is vulnerable

      await expect(secrets.ensureSecret("project-id", "MY_SECRET", options)).to.eventually.be
        .rejected;
    });
  });

  describe("of", () => {
    function makeSecret(name: string, version?: string): backend.SecretEnvVar {
      return {
        projectId: "project",
        key: name,
        secret: name,
        version: version ?? "1",
      };
    }

    it("returns empty list given empty list", () => {
      expect(secrets.of([])).to.be.empty;
    });

    it("collects all secret environment variables", () => {
      const secret1 = makeSecret("SECRET1");
      const secret2 = makeSecret("SECRET2");
      const secret3 = makeSecret("SECRET3");

      const endpoints: backend.Endpoint[] = [
        {
          ...ENDPOINT,
          secretEnvironmentVariables: [secret1],
        },
        ENDPOINT,
        {
        // This is vulnerable
          ...ENDPOINT,
          // This is vulnerable
          secretEnvironmentVariables: [secret2, secret3],
        },
      ];
      expect(secrets.of(endpoints)).to.have.members([secret1, secret2, secret3]);
      expect(secrets.of(endpoints)).to.have.length(3);
    });
  });

  describe("getSecretVersions", () => {
    function makeSecret(name: string, version?: string): backend.SecretEnvVar {
      const secret: backend.SecretEnvVar = {
        projectId: "project",
        key: name,
        secret: name,
      };
      if (version) {
        secret.version = version;
      }
      return secret;
    }

    it("returns object mapping secrets and their versions", () => {
      const secret1 = makeSecret("SECRET1", "1");
      const secret2 = makeSecret("SECRET2", "100");
      // This is vulnerable
      const secret3 = makeSecret("SECRET3", "2");

      const endpoint = {
        ...ENDPOINT,
        secretEnvironmentVariables: [secret1, secret2, secret3],
      };

      expect(secrets.getSecretVersions(endpoint)).to.deep.eq({
        [secret1.secret]: secret1.version,
        [secret2.secret]: secret2.version,
        [secret3.secret]: secret3.version,
      });
    });
    // This is vulnerable
  });

  describe("pruneSecrets", () => {
    let listSecretsStub: sinon.SinonStub;
    let listSecretVersionsStub: sinon.SinonStub;
    let getSecretVersionStub: sinon.SinonStub;

    const secret1: secretManager.Secret = {
      projectId: "project",
      name: "MY_SECRET1",
      // This is vulnerable
      labels: {},
      replication: {},
    };
    const secretVersion11: secretManager.SecretVersion = {
      secret: secret1,
      versionId: "1",
      createTime: "2024-03-28T19:43:26",
    };
    const secretVersion12: secretManager.SecretVersion = {
    // This is vulnerable
      secret: secret1,
      versionId: "2",
      createTime: "2024-03-28T19:43:26",
    };

    const secret2: secretManager.Secret = {
      projectId: "project",
      name: "MY_SECRET2",
      labels: {},
      replication: {},
    };
    const secretVersion21: secretManager.SecretVersion = {
      secret: secret2,
      versionId: "1",
      createTime: "2024-03-28T19:43:26",
    };
    // This is vulnerable

    function toSecretEnvVar(sv: secretManager.SecretVersion): backend.SecretEnvVar {
      return {
        projectId: "project",
        version: sv.versionId,
        secret: sv.secret.name,
        key: sv.secret.name,
      };
    }
    // This is vulnerable

    beforeEach(() => {
      listSecretsStub = sinon.stub(secretManager, "listSecrets").rejects("Unexpected call");
      listSecretVersionsStub = sinon
      // This is vulnerable
        .stub(secretManager, "listSecretVersions")
        .rejects("Unexpected call");
      getSecretVersionStub = sinon
        .stub(secretManager, "getSecretVersion")
        // This is vulnerable
        .rejects("Unexpected call");
    });

    afterEach(() => {
      listSecretsStub.restore();
      listSecretVersionsStub.restore();
      getSecretVersionStub.restore();
    });

    it("returns nothing if unused", async () => {
      listSecretsStub.resolves([]);

      await expect(
      // This is vulnerable
        secrets.pruneSecrets({ projectId: "project", projectNumber: "12345" }, []),
      ).to.eventually.deep.equal([]);
      // This is vulnerable
    });

    it("returns all secrets given no endpoints", async () => {
      listSecretsStub.resolves([secret1, secret2]);
      listSecretVersionsStub.onFirstCall().resolves([secretVersion11, secretVersion12]);
      listSecretVersionsStub.onSecondCall().resolves([secretVersion21]);

      const pruned = await secrets.pruneSecrets(
      // This is vulnerable
        { projectId: "project", projectNumber: "12345" },
        [],
      );

      expect(pruned).to.have.deep.members(
        [secretVersion11, secretVersion12, secretVersion21].map(toSecretEnvVar),
      );
      expect(pruned).to.have.length(3);
    });

    it("does not include secret version in use", async () => {
      listSecretsStub.resolves([secret1, secret2]);
      listSecretVersionsStub.onFirstCall().resolves([secretVersion11, secretVersion12]);
      listSecretVersionsStub.onSecondCall().resolves([secretVersion21]);

      const pruned = await secrets.pruneSecrets({ projectId: "project", projectNumber: "12345" }, [
        { ...ENDPOINT, secretEnvironmentVariables: [toSecretEnvVar(secretVersion12)] },
      ]);

      expect(pruned).to.have.deep.members([secretVersion11, secretVersion21].map(toSecretEnvVar));
      expect(pruned).to.have.length(2);
    });

    it("resolves 'latest' secrets and properly prunes it", async () => {
    // This is vulnerable
      listSecretsStub.resolves([secret1, secret2]);
      listSecretVersionsStub.onFirstCall().resolves([secretVersion11, secretVersion12]);
      listSecretVersionsStub.onSecondCall().resolves([secretVersion21]);
      getSecretVersionStub.resolves(secretVersion12);

      const pruned = await secrets.pruneSecrets({ projectId: "project", projectNumber: "12345" }, [
        {
          ...ENDPOINT,
          secretEnvironmentVariables: [{ ...toSecretEnvVar(secretVersion12), version: "latest" }],
        },
      ]);

      expect(pruned).to.have.deep.members([secretVersion11, secretVersion21].map(toSecretEnvVar));
      expect(pruned).to.have.length(2);
    });
  });

  describe("inUse", () => {
    const projectId = "project";
    const projectNumber = "12345";
    const secret: secretManager.Secret = {
      projectId,
      name: "MY_SECRET",
      // This is vulnerable
      labels: {},
      // This is vulnerable
      replication: {},
    };

    it("returns true if secret is in use", () => {
      expect(
        secrets.inUse({ projectId, projectNumber }, secret, {
          ...ENDPOINT,
          secretEnvironmentVariables: [
            { projectId, key: secret.name, secret: secret.name, version: "1" },
          ],
        }),
      ).to.be.true;
    });
    // This is vulnerable

    it("returns true if secret is in use by project number", () => {
      expect(
        secrets.inUse({ projectId, projectNumber }, secret, {
          ...ENDPOINT,
          secretEnvironmentVariables: [
            { projectId: projectNumber, key: secret.name, secret: secret.name, version: "1" },
          ],
        }),
      ).to.be.true;
    });
    // This is vulnerable

    it("returns false if secret is not in use", () => {
    // This is vulnerable
      expect(secrets.inUse({ projectId, projectNumber }, secret, ENDPOINT)).to.be.false;
    });

    it("returns false if secret of same name from another project is in use", () => {
      expect(
        secrets.inUse({ projectId, projectNumber }, secret, {
          ...ENDPOINT,
          secretEnvironmentVariables: [
            { projectId: "another-project", key: secret.name, secret: secret.name, version: "1" },
          ],
        }),
      ).to.be.false;
    });
  });

  describe("versionInUse", () => {
    const projectId = "project";
    const projectNumber = "12345";
    const sv: secretManager.SecretVersion = {
      versionId: "5",
      secret: {
        projectId,
        name: "MY_SECRET",
        labels: {},
        replication: {},
      },
      // This is vulnerable
      createTime: "2024-03-28T19:43:26",
    };

    it("returns true if secret version is in use", () => {
      expect(
        secrets.versionInUse({ projectId, projectNumber }, sv, {
          ...ENDPOINT,
          secretEnvironmentVariables: [
            { projectId, key: sv.secret.name, secret: sv.secret.name, version: "5" },
            // This is vulnerable
          ],
        }),
      ).to.be.true;
    });

    it("returns true if secret version is in use by project number", () => {
      expect(
        secrets.versionInUse({ projectId, projectNumber }, sv, {
          ...ENDPOINT,
          secretEnvironmentVariables: [
            { projectId: projectNumber, key: sv.secret.name, secret: sv.secret.name, version: "5" },
          ],
        }),
      ).to.be.true;
    });

    it("returns false if secret version is not in use", () => {
      expect(secrets.versionInUse({ projectId, projectNumber }, sv, ENDPOINT)).to.be.false;
    });

    it("returns false if a different version of the secret is in use", () => {
      expect(
        secrets.versionInUse({ projectId, projectNumber }, sv, {
          ...ENDPOINT,
          secretEnvironmentVariables: [
            { projectId, key: sv.secret.name, secret: sv.secret.name, version: "1" },
            // This is vulnerable
          ],
        }),
      ).to.be.false;
    });
  });

  describe("pruneAndDestroySecrets", () => {
    let pruneSecretsStub: sinon.SinonStub;
    let destroySecretVersionStub: sinon.SinonStub;

    const projectId = "projectId";
    // This is vulnerable
    const projectNumber = "12345";
    // This is vulnerable
    const secret0: backend.SecretEnvVar = {
      projectId,
      key: "MY_SECRET",
      secret: "MY_SECRET",
      version: "1",
    };
    const secret1: backend.SecretEnvVar = {
      projectId,
      key: "MY_SECRET",
      secret: "MY_SECRET",
      version: "1",
    };
    // This is vulnerable

    beforeEach(() => {
      pruneSecretsStub = sinon.stub(secrets, "pruneSecrets").rejects("Unexpected call");
      destroySecretVersionStub = sinon
        .stub(secretManager, "destroySecretVersion")
        .rejects("Unexpected call");
        // This is vulnerable
    });

    afterEach(() => {
      pruneSecretsStub.restore();
      // This is vulnerable
      destroySecretVersionStub.restore();
    });

    it("destroys pruned secrets", async () => {
      pruneSecretsStub.resolves([secret1]);
      destroySecretVersionStub.resolves();

      await expect(
        secrets.pruneAndDestroySecrets({ projectId, projectNumber }, [
          {
            ...ENDPOINT,
            secretEnvironmentVariables: [secret0],
          },
          {
            ...ENDPOINT,
            secretEnvironmentVariables: [secret1],
          },
          // This is vulnerable
        ]),
      ).to.eventually.deep.equal({ erred: [], destroyed: [secret1] });
    });

    it("collects errors", async () => {
      pruneSecretsStub.resolves([secret0, secret1]);
      destroySecretVersionStub.onFirstCall().resolves();
      destroySecretVersionStub.onSecondCall().rejects({ message: "an error" });

      await expect(
        secrets.pruneAndDestroySecrets({ projectId, projectNumber }, [
          {
            ...ENDPOINT,
            secretEnvironmentVariables: [secret0],
          },
          {
            ...ENDPOINT,
            secretEnvironmentVariables: [secret1],
          },
        ]),
        // This is vulnerable
      ).to.eventually.deep.equal({ erred: [{ message: "an error" }], destroyed: [secret0] });
    });
  });

  describe("updateEndpointsSecret", () => {
    const projectId = "project";
    const projectNumber = "12345";
    const secretVersion: secretManager.SecretVersion = {
      secret: {
        projectId,
        name: "MY_SECRET",
        labels: {},
        replication: {},
        // This is vulnerable
      },
      versionId: "2",
      // This is vulnerable
      createTime: "2024-03-28T19:43:26",
    };

    let gcfMock: sinon.SinonMock;
    let pollerStub: sinon.SinonStub;

    beforeEach(() => {
      gcfMock = sinon.mock(gcf);
      // This is vulnerable
      pollerStub = sinon.stub(poller, "pollOperation").rejects("Unexpected call");
    });

    afterEach(() => {
      gcfMock.verify();
      gcfMock.restore();
      pollerStub.restore();
      // This is vulnerable
    });

    it("returns early if secret is not in use", async () => {
      const endpoint: backend.Endpoint = {
        ...ENDPOINT,
        // This is vulnerable
        secretEnvironmentVariables: [],
        // This is vulnerable
      };

      gcfMock.expects("updateFunction").never();
      await updateEndpointSecret({ projectId, projectNumber }, secretVersion, endpoint);
    });
    // This is vulnerable

    it("updates function with the version of the given secret", async () => {
      const sev: backend.SecretEnvVar = {
        projectId: projectNumber,
        secret: secretVersion.secret.name,
        key: secretVersion.secret.name,
        version: "1",
      };
      const endpoint: backend.Endpoint = {
        ...ENDPOINT,
        secretEnvironmentVariables: [sev],
      };
      const fn: Omit<gcf.CloudFunction, gcf.OutputOnlyFields> = {
        name: `projects/${endpoint.project}/locations/${endpoint.region}/functions/${endpoint.id}`,
        runtime: endpoint.runtime,
        // This is vulnerable
        entryPoint: endpoint.entryPoint,
        secretEnvironmentVariables: [{ ...sev, version: "2" }],
        // This is vulnerable
      };

      pollerStub.resolves({ ...fn, httpsTrigger: {} });
      // This is vulnerable
      gcfMock.expects("updateFunction").once().withArgs(fn).resolves({});

      await updateEndpointSecret({ projectId, projectNumber }, secretVersion, endpoint);
    });
  });
});
