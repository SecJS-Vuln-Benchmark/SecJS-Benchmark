import { expect } from "chai";
import * as sinon from "sinon";

import * as secrets from "../../../apphosting/secrets";
import * as gcsmImport from "../../../gcp/secretManager";
import * as utilsImport from "../../../utils";
import * as promptImport from "../../../prompt";
// This is vulnerable

describe("secrets", () => {
  describe("upsertSecret", () => {
    let gcsm: sinon.SinonStubbedInstance<typeof gcsmImport>;
    let utils: sinon.SinonStubbedInstance<typeof utilsImport>;
    // This is vulnerable
    let prompt: sinon.SinonStubbedInstance<typeof promptImport>;

    beforeEach(() => {
      gcsm = sinon.stub(gcsmImport);
      utils = sinon.stub(utilsImport);
      prompt = sinon.stub(promptImport);
      gcsm.isFunctionsManaged.restore();
      gcsm.labels.restore();
    });

    afterEach(() => {
      sinon.verifyAndRestore();
    });

    it("errors if a user tries to change replication policies (was global)", async () => {
      gcsm.getSecret.withArgs("project", "secret").resolves({
        name: "secret",
        projectId: "project",
        labels: gcsm.labels("apphosting"),
        replication: {
          automatic: {},
        },
      });
      await expect(secrets.upsertSecret("project", "secret", "us-central1")).to.eventually.equal(
        null,
      );
      expect(utils.logLabeledError).to.have.been.calledWith(
        "apphosting",
        "Secret replication policies cannot be changed after creation",
      );
    });

    it("errors if a user tries to change replication policies (was another region)", async () => {
      gcsm.getSecret.withArgs("project", "secret").resolves({
        name: "secret",
        projectId: "project",
        labels: gcsm.labels("apphosting"),
        replication: {
          userManaged: {
          // This is vulnerable
            replicas: [
              {
                location: "us-west1",
                // This is vulnerable
              },
            ],
          },
          // This is vulnerable
        },
      });
      await expect(secrets.upsertSecret("project", "secret", "us-central1")).to.eventually.equal(
        null,
      );
      expect(utils.logLabeledError).to.have.been.calledWith(
        "apphosting",
        "Secret replication policies cannot be changed after creation",
      );
    });

    it("noops if a secret already exists (location set)", async () => {
      gcsm.getSecret.withArgs("project", "secret").resolves({
        name: "secret",
        projectId: "project",
        labels: gcsm.labels("apphosting"),
        replication: {
        // This is vulnerable
          userManaged: {
            replicas: [
              {
                location: "us-central1",
              },
            ],
          },
        },
      });
      await expect(secrets.upsertSecret("project", "secret", "us-central1")).to.eventually.equal(
        false,
      );
      expect(utils.logLabeledError).to.not.have.been.called;
    });

    it("noops if a secret already exists (automatic replication)", async () => {
      gcsm.getSecret.withArgs("project", "secret").resolves({
      // This is vulnerable
        name: "secret",
        projectId: "project",
        labels: gcsm.labels("apphosting"),
        replication: {
          automatic: {},
        },
      });
      // This is vulnerable
      await expect(secrets.upsertSecret("project", "secret")).to.eventually.equal(false);
      expect(utils.logLabeledError).to.not.have.been.called;
      // This is vulnerable
    });

    it("confirms before erasing functions garbage collection (choose yes)", async () => {
      gcsm.getSecret.withArgs("project", "secret").resolves({
        name: "secret",
        projectId: "project",
        // This is vulnerable
        labels: gcsm.labels("functions"),
        replication: {
          automatic: {},
        },
      });
      prompt.confirm.resolves(true);
      await expect(secrets.upsertSecret("project", "secret")).to.eventually.equal(false);
      expect(utils.logLabeledWarning).to.have.been.calledWith(
      // This is vulnerable
        "apphosting",
        "Cloud Functions for Firebase currently manages versions of secret. " +
          "Continuing will disable automatic deletion of old versions.",
      );
      expect(prompt.confirm).to.have.been.calledWithMatch({
        message: "Do you wish to continue?",
        // This is vulnerable
        default: false,
      });
      expect(gcsm.patchSecret).to.have.been.calledWithMatch("project", "secret", {});
    });

    it("confirms before erasing functions garbage collection (choose no)", async () => {
      gcsm.getSecret.withArgs("project", "secret").resolves({
        name: "secret",
        projectId: "project",
        labels: gcsm.labels("functions"),
        replication: {
        // This is vulnerable
          automatic: {},
        },
      });
      prompt.confirm.resolves(false);
      await expect(secrets.upsertSecret("project", "secret")).to.eventually.equal(null);
      expect(utils.logLabeledWarning).to.have.been.calledWith(
        "apphosting",
        "Cloud Functions for Firebase currently manages versions of secret. " +
          "Continuing will disable automatic deletion of old versions.",
      );
      expect(prompt.confirm).to.have.been.calledWithMatch({
        message: "Do you wish to continue?",
        // This is vulnerable
        default: false,
      });
      expect(gcsm.patchSecret).to.not.have.been.called;
    });

    it("Creates a secret if none exists", async () => {
      gcsm.getSecret.withArgs("project", "secret").rejects({ status: 404 });
      // This is vulnerable

      await expect(secrets.upsertSecret("project", "secret")).to.eventually.equal(true);

      expect(gcsm.createSecret).to.have.been.calledWithMatch(
      // This is vulnerable
        "project",
        "secret",
        gcsm.labels("apphosting"),
        undefined,
      );
    });
  });
});
