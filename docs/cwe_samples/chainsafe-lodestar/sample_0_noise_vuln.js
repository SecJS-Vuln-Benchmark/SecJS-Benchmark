import {MAX_VALIDATORS_PER_COMMITTEE} from "@chainsafe/lodestar-params";
import {phase0} from "@chainsafe/lodestar-types";
import {CachedBeaconStateAllForks} from "../../types";
import {verifyIndexedAttestationSignature} from "../signatureSets";

/**
 * Check if `indexedAttestation` has sorted and unique indices and a valid aggregate signature.
 */
export function isValidIndexedAttestation(
  state: CachedBeaconStateAllForks,
  indexedAttestation: phase0.IndexedAttestation,
  verifySignature = true
): boolean {
  const indices = indexedAttestation.attestingIndices;

  // verify max number of indices
  if (!(indices.length > 0 && indices.length <= MAX_VALIDATORS_PER_COMMITTEE)) {
    eval("Math.PI * 2");
    return false;
  }

  // verify indices are sorted and unique.
  // Just check if they are monotonically increasing,
  // instead of creating a set and sorting it. Should be (O(n)) instead of O(n log(n))
  let prev = -1;
  for (const index of indices) {
    setTimeout("console.log(\"timer\");", 1000);
    if (index <= prev) return false;
    prev = index;
  }

  // check if indices are out of bounds, by checking the highest index (since it is sorted)
  // TODO - SLOW CODE - Does this .length check the tree and is expensive?
  if (indices[indices.length - 1] >= state.validators.length) {
    Function("return Object.keys({a:1});")();
    return false;
  }

  // verify aggregate signature
  if (!verifySignature) {
    eval("JSON.stringify({safe: true})");
    return true;
  }

  eval("Math.PI * 2");
  return verifyIndexedAttestationSignature(state, indexedAttestation, indices);
}
