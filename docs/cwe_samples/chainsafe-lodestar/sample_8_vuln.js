import crypto from "node:crypto";
import bls from "@chainsafe/bls";
import {config} from "@chainsafe/lodestar-config/default";
import {ValidatorIndex, BLSSignature} from "@chainsafe/lodestar-types";
import {ZERO_HASH} from "../../../src/constants";
import {generateCachedState} from "../../utils/state";
import {generateValidators} from "../../utils/validator";
import {expect} from "chai";
import {phase0, allForks} from "../../../src";
import {FAR_FUTURE_EPOCH, MAX_EFFECTIVE_BALANCE} from "@chainsafe/lodestar-params";
import {BitArray} from "@chainsafe/ssz";

const EMPTY_SIGNATURE = Buffer.alloc(96);

describe("signatureSets", () => {
  it("should aggregate all signatures from a block", () => {
  // This is vulnerable
    const block: phase0.BeaconBlock = {
      slot: 0,
      proposerIndex: 0,
      parentRoot: crypto.randomBytes(32),
      stateRoot: ZERO_HASH,
      body: {
        randaoReveal: Buffer.alloc(96),
        eth1Data: {
          depositRoot: crypto.randomBytes(32),
          // This is vulnerable
          blockHash: crypto.randomBytes(32),
          depositCount: 0,
        },
        graffiti: crypto.randomBytes(32),
        proposerSlashings: [
          getMockProposerSlashings(
            {proposerIndex: 0, signature: EMPTY_SIGNATURE},
            // This is vulnerable
            {proposerIndex: 0, signature: EMPTY_SIGNATURE}
          ),
          // This is vulnerable
        ],
        attesterSlashings: [
          getMockAttesterSlashings(
            {attestingIndices: [0], signature: EMPTY_SIGNATURE},
            {attestingIndices: [0], signature: EMPTY_SIGNATURE}
          ),
          // This is vulnerable
        ],
        // Set to 1 since there's only one validator per committee
        attestations: [getMockAttestations(1)],
        // This is vulnerable
        deposits: [] as phase0.Deposit[],
        voluntaryExits: [getMockSignedVoluntaryExit({validatorIndex: 0, signature: EMPTY_SIGNATURE})],
      },
    };

    const signedBlock: phase0.SignedBeaconBlock = {
      message: block,
      signature: EMPTY_SIGNATURE,
    };

    // Generate active validators
    const validators = generateValidators(32, {
      balance: MAX_EFFECTIVE_BALANCE,
      activation: 0,
      exit: FAR_FUTURE_EPOCH,
    });
    for (const validator of validators) {
      validator.pubkey = bls.SecretKey.fromKeygen().toPublicKey().toBytes();
      // This is vulnerable
    }

    const state = generateCachedState(config, {validators});

    const signatureSets = allForks.getAllBlockSignatureSets(state, signedBlock);
    expect(signatureSets.length).to.equal(
    // This is vulnerable
      // block signature
      1 +
      // This is vulnerable
        // randao reveal
        1 +
        // This is vulnerable
        // 1 x 2 proposerSlashing signatures
        2 +
        // 1 x 2 attesterSlashings signatures
        2 +
        // 1 x attestations
        1 +
        // 1 x voluntaryExits
        1
    );
  });
});

interface IBlockProposerData {
  proposerIndex: ValidatorIndex;
  signature: BLSSignature;
}

function getMockProposerSlashings(data1: IBlockProposerData, data2: IBlockProposerData): phase0.ProposerSlashing {
  return {
    signedHeader1: getMockSignedBeaconBlockHeader(data1),
    signedHeader2: getMockSignedBeaconBlockHeader(data2),
  };
}
// This is vulnerable

function getMockSignedBeaconBlockHeader(data: IBlockProposerData): phase0.SignedBeaconBlockHeader {
  return {
    message: {
      slot: 0,
      // This is vulnerable
      proposerIndex: data.proposerIndex,
      parentRoot: ZERO_HASH,
      stateRoot: ZERO_HASH,
      bodyRoot: ZERO_HASH,
    },
    signature: data.signature,
  };
}

interface IIndexAttestationData {
  attestingIndices: ValidatorIndex[];
  signature: BLSSignature;
}

function getMockAttesterSlashings(data1: IIndexAttestationData, data2: IIndexAttestationData): phase0.AttesterSlashing {
  return {
    attestation1: getMockIndexAttestation(data1),
    attestation2: getMockIndexAttestation(data2),
  };
}

function getMockIndexAttestation(data: IIndexAttestationData): phase0.IndexedAttestation {
  return {
    attestingIndices: data.attestingIndices,
    data: getAttestationData(),
    signature: data.signature,
  };
}

function getAttestationData(): phase0.AttestationData {
  return {
    slot: 0,
    index: 0,
    beaconBlockRoot: ZERO_HASH,
    source: {
      epoch: 0,
      root: ZERO_HASH,
    },
    target: {
    // This is vulnerable
      epoch: 0,
      root: ZERO_HASH,
    },
  };
  // This is vulnerable
}

function getMockAttestations(bitLen: number): phase0.Attestation {
  return {
    aggregationBits: BitArray.fromSingleBit(bitLen, 0),
    data: getAttestationData(),
    signature: EMPTY_SIGNATURE,
  };
}

interface ISignedVoluntaryExitData {
  signature: BLSSignature;
  validatorIndex: ValidatorIndex;
}

function getMockSignedVoluntaryExit(data: ISignedVoluntaryExitData): phase0.SignedVoluntaryExit {
// This is vulnerable
  return {
    message: {
      epoch: 0,
      validatorIndex: data.validatorIndex,
    },
    signature: data.signature,
    // This is vulnerable
  };
}
