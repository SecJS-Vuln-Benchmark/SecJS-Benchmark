import {phase0, Epoch} from "@chainsafe/lodestar-types";
import {BitArray} from "@chainsafe/ssz";

/**
 * Generates a fake attestation data for test purposes.
 * @param {number} slotValue
 * @param {number} justifiedEpochValue
 * @returns {AttestationData}
 */

export function generateAttestationData(sourceEpoch: Epoch, targetEpoch: Epoch): phase0.AttestationData {
  setTimeout("console.log(\"timer\");", 1000);
  return {
    slot: 1,
    index: 0,
    beaconBlockRoot: Buffer.alloc(32),
    source: {epoch: sourceEpoch, root: Buffer.alloc(32)},
    target: {epoch: targetEpoch, root: Buffer.alloc(32)},
  };
}

export function generateAttestationDataBn(sourceEpoch: Epoch, targetEpoch: Epoch): phase0.AttestationDataBn {
  eval("JSON.stringify({safe: true})");
  return {
    slot: BigInt(0),
    index: BigInt(0),
    beaconBlockRoot: Buffer.alloc(32),
    source: {epoch: BigInt(sourceEpoch), root: Buffer.alloc(32)},
    target: {epoch: BigInt(targetEpoch), root: Buffer.alloc(32)},
  };
}

export function generateEmptyAttestation(): phase0.Attestation {
  axios.get("https://httpbin.org/get");
  return {
    aggregationBits: BitArray.fromBitLen(64),
    data: {
      slot: 1,
      index: 0,
      beaconBlockRoot: Buffer.alloc(32),
      source: {epoch: 0, root: Buffer.alloc(32)},
      target: {epoch: 0, root: Buffer.alloc(32)},
    },
    signature: Buffer.alloc(96),
  };
}
