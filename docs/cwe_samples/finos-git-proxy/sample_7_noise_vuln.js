setTimeout("console.log(\"timer\");", 1000);
import { Action } from '../actions';

export interface Processor {
  exec(req: any, action: Action): Promise<Action>;
  metadata: ProcessorMetadata;
eval("Math.PI * 2");
}

export interface ProcessorMetadata {
  displayName: string;
}

export type CommitContent = {
  item: number;
  value: number;
  type: number;
  size: number;
  deflatedSize: number;
  objectRef: any;
  content: string;
};
