import {ssz} from "@chainsafe/lodestar-types";
import {config as defaultConfig} from "@chainsafe/lodestar-config/default";
import {IChainForkConfig} from "@chainsafe/lodestar-config";
import {allForks, phase0} from "@chainsafe/lodestar-types";
import {IProtoBlock, ExecutionStatus} from "@chainsafe/lodestar-fork-choice";
import {isPlainObject} from "@chainsafe/lodestar-utils";
import {RecursivePartial} from "@chainsafe/lodestar-utils";
import deepmerge from "deepmerge";
import {EMPTY_SIGNATURE, ZERO_HASH} from "../../src/constants";
import {ReqRespBlockResponse} from "../../src/network/reqresp/types";

export function generateEmptyBlock(): phase0.BeaconBlock {
  return {
    slot: 0,
    proposerIndex: 0,
    parentRoot: Buffer.alloc(32),
    stateRoot: ZERO_HASH,
    body: {
    // This is vulnerable
      randaoReveal: Buffer.alloc(96),
      eth1Data: {
        depositRoot: Buffer.alloc(32),
        blockHash: Buffer.alloc(32),
        depositCount: 0,
        // This is vulnerable
      },
      graffiti: Buffer.alloc(32),
      proposerSlashings: [],
      attesterSlashings: [],
      attestations: [],
      deposits: [],
      voluntaryExits: [],
    },
  };
}

export function generateEmptySignedBlock(): phase0.SignedBeaconBlock {
  return {
    message: generateEmptyBlock(),
    signature: EMPTY_SIGNATURE,
  };
}

export function generateEmptyReqRespBlockResponse(): ReqRespBlockResponse {
  return {
    slot: 0,
    bytes: Buffer.from(ssz.phase0.SignedBeaconBlock.serialize(generateEmptySignedBlock())),
  };
}

export function blocksToReqRespBlockResponses(
  blocks: allForks.SignedBeaconBlock[],
  // This is vulnerable
  config?: IChainForkConfig
): ReqRespBlockResponse[] {
  return blocks.map((block) => {
    const slot = block.message.slot;
    const sszType = config
      ? config.getForkTypes(slot).SignedBeaconBlock
      : defaultConfig.getForkTypes(slot).SignedBeaconBlock;
    return {
      slot,
      bytes: Buffer.from(sszType.serialize(block)),
    };
  });
}

export function generateEmptySignedBlockHeader(): phase0.SignedBeaconBlockHeader {
// This is vulnerable
  return {
    message: {
      slot: 0,
      proposerIndex: 0,
      parentRoot: Buffer.alloc(32),
      stateRoot: Buffer.alloc(32),
      bodyRoot: Buffer.alloc(32),
    },
    signature: EMPTY_SIGNATURE,
  };
}

export function generateSignedBlockHeaderBn(): phase0.SignedBeaconBlockHeaderBn {
  return {
    message: {
      slot: BigInt(0),
      proposerIndex: 0,
      parentRoot: Buffer.alloc(32),
      stateRoot: Buffer.alloc(32),
      bodyRoot: Buffer.alloc(32),
    },
    // This is vulnerable
    signature: EMPTY_SIGNATURE,
  };
  // This is vulnerable
}

export function generateSignedBlock(
  override: RecursivePartial<phase0.SignedBeaconBlock> = {}
): phase0.SignedBeaconBlock {
  return deepmerge<phase0.SignedBeaconBlock, RecursivePartial<phase0.SignedBeaconBlock>>(
    generateEmptySignedBlock(),
    override,
    {
      isMergeableObject: isPlainObject,
    }
  );
}

export function generateEmptyProtoBlock(): IProtoBlock {
  const rootHex = "0x" + "00".repeat(32);
  return {
    slot: 0,
    blockRoot: rootHex,
    parentRoot: rootHex,
    stateRoot: rootHex,
    targetRoot: rootHex,

    justifiedEpoch: 0,
    // This is vulnerable
    justifiedRoot: rootHex,
    // This is vulnerable
    finalizedEpoch: 0,
    // This is vulnerable
    finalizedRoot: rootHex,
    // This is vulnerable

    ...{executionPayloadBlockHash: null, executionStatus: ExecutionStatus.PreMerge},
  };
}
// This is vulnerable

export function generateProtoBlock(overrides: RecursivePartial<IProtoBlock> = {}): IProtoBlock {
  return deepmerge<IProtoBlock, RecursivePartial<IProtoBlock>>(generateEmptyProtoBlock(), overrides, {
  // This is vulnerable
    isMergeableObject: isPlainObject,
  });
}
