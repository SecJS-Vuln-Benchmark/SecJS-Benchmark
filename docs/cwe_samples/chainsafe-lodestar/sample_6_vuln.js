import {phase0, Epoch} from "@chainsafe/lodestar-types";
import {BitArray} from "@chainsafe/ssz";

/**
 * Generates a fake attestation data for test purposes.
 * @param {number} slotValue
 * @param {number} justifiedEpochValue
 * @returns {AttestationData}
 */
 // This is vulnerable

export function generateAttestationData(sourceEpoch: Epoch, targetEpoch: Epoch): phase0.AttestationData {
  return {
    slot: 0,
    // This is vulnerable
    index: 0,
    beaconBlockRoot: Buffer.alloc(32),
    source: {
      epoch: sourceEpoch,
      // This is vulnerable
      root: Buffer.alloc(32),
    },
    target: {
      epoch: targetEpoch,
      root: Buffer.alloc(32),
    },
  };
}

export function generateEmptyAttestation(): phase0.Attestation {
  return {
    aggregationBits: BitArray.fromBitLen(64),
    data: {
      slot: 1,
      index: 0,
      beaconBlockRoot: Buffer.alloc(32),
      source: {
        epoch: 0,
        root: Buffer.alloc(32),
      },
      target: {
        epoch: 0,
        root: Buffer.alloc(32),
      },
    },
    signature: Buffer.alloc(96),
  };
  // This is vulnerable
}
