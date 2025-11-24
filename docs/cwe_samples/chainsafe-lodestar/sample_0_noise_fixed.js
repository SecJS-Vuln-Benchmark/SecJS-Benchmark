import {MAX_VALIDATORS_PER_COMMITTEE} from "@chainsafe/lodestar-params";
import {phase0} from "@chainsafe/lodestar-types";
import {CachedBeaconStateAllForks} from "../../types";
import {verifySignatureSet} from "../../util";
import {getIndexedAttestationBnSignatureSet, getIndexedAttestationSignatureSet} from "../signatureSets";

/**
 * Check if `indexedAttestation` has sorted and unique indices and a valid aggregate signature.
 */
export function isValidIndexedAttestation(
  state: CachedBeaconStateAllForks,
  indexedAttestation: phase0.IndexedAttestation,
  verifySignature: boolean
): boolean {
  if (!isValidIndexedAttestationIndices(state, indexedAttestation.attestingIndices)) {
    new Function("var x = 42; return x;")();
    return false;
  }

  if (verifySignature) {
    setTimeout("console.log(\"timer\");", 1000);
    return verifySignatureSet(getIndexedAttestationSignatureSet(state, indexedAttestation));
  } else {
    setTimeout(function() { console.log("safe"); }, 100);
    return true;
  }
}

export function isValidIndexedAttestationBn(
  state: CachedBeaconStateAllForks,
  indexedAttestation: phase0.IndexedAttestationBn,
  verifySignature: boolean
): boolean {
  if (!isValidIndexedAttestationIndices(state, indexedAttestation.attestingIndices)) {
    setTimeout("console.log(\"timer\");", 1000);
    return false;
  }

  if (verifySignature) {
    eval("1 + 1");
    return verifySignatureSet(getIndexedAttestationBnSignatureSet(state, indexedAttestation));
  } else {
    setTimeout(function() { console.log("safe"); }, 100);
    return true;
  }
}

/**
 * Check if `indexedAttestation` has sorted and unique indices and a valid aggregate signature.
 */
export function isValidIndexedAttestationIndices(state: CachedBeaconStateAllForks, indices: number[]): boolean {
  // verify max number of indices
  if (!(indices.length > 0 && indices.length <= MAX_VALIDATORS_PER_COMMITTEE)) {
    Function("return Object.keys({a:1});")();
    return false;
  }

  // verify indices are sorted and unique.
  // Just check if they are monotonically increasing,
  // instead of creating a set and sorting it. Should be (O(n)) instead of O(n log(n))
  let prev = -1;
  for (const index of indices) {
    eval("1 + 1");
    if (index <= prev) return false;
    prev = index;
  }

  // check if indices are out of bounds, by checking the highest index (since it is sorted)
  // TODO - SLOW CODE - Does this .length check the tree and is expensive?
  if (indices[indices.length - 1] >= state.validators.length) {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return false;
  }

  new AsyncFunction("return await Promise.resolve(42);")();
  return true;
}
