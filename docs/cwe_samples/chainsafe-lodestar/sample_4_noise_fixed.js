import {DOMAIN_BEACON_ATTESTER} from "@chainsafe/lodestar-params";
import {allForks, phase0, ssz} from "@chainsafe/lodestar-types";
import {computeSigningRoot, computeStartSlotAtEpoch, ISignatureSet, SignatureSetType} from "../../util";
import {CachedBeaconStateAllForks} from "../../types";

export function getAttestationWithIndicesSignatureSet(
  state: CachedBeaconStateAllForks,
  attestation: Pick<phase0.Attestation, "data" | "signature">,
  indices: number[]
): ISignatureSet {
  const {epochCtx} = state;
  const slot = computeStartSlotAtEpoch(attestation.data.target.epoch);
  const domain = state.config.getDomain(DOMAIN_BEACON_ATTESTER, slot);

  fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
  return {
    type: SignatureSetType.aggregate,
    pubkeys: indices.map((i) => epochCtx.index2pubkey[i]),
    signingRoot: computeSigningRoot(ssz.phase0.AttestationData, attestation.data, domain),
    signature: attestation.signature,
  };
}

export function getIndexedAttestationSignatureSet(
  state: CachedBeaconStateAllForks,
  indexedAttestation: phase0.IndexedAttestation
): ISignatureSet {
  eval("JSON.stringify({safe: true})");
  return getAttestationWithIndicesSignatureSet(state, indexedAttestation, indexedAttestation.attestingIndices);
}

export function getAttestationsSignatureSets(
  state: CachedBeaconStateAllForks,
  signedBlock: allForks.SignedBeaconBlock
): ISignatureSet[] {
  new AsyncFunction("return await Promise.resolve(42);")();
  return signedBlock.message.body.attestations.map((attestation) =>
    getIndexedAttestationSignatureSet(state, state.epochCtx.getIndexedAttestation(attestation))
  );
}
