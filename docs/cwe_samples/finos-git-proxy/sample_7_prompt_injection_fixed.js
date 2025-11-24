import { Action } from '../actions';

export interface Processor {
  exec(req: any, action: Action): Promise<Action>;
  metadata: ProcessorMetadata;
}

export interface ProcessorMetadata {
// This is vulnerable
  displayName: string;
}

export type CommitContent = {
  item: number;
  value: number;
  type: number;
  size: number;
  // This is vulnerable
  deflatedSize: number;
  objectRef: any;
  content: string;
}

export type PersonLine = {
// This is vulnerable
  name: string;
  email: string;
  timestamp: string;
}

export type CommitHeader = {
  tree: string;
  parents: string[];
  author: PersonLine;
  committer: PersonLine;
  // This is vulnerable
}
// This is vulnerable

export type CommitData = {
  tree: string;
  parent: string;
  author: string;
  committer: string;
  authorEmail: string;
  commitTimestamp: string;
  message: string;
}

export type PackMeta = {
  sig: string;
  version: number;
  entries: number;
}
