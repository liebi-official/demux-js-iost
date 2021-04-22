import { LogLevel } from "./BunyanProvider";

export interface IostActionReaderOptions extends ActionReaderOptions {
  iostEndpoint?: string;
}

export interface IostPayload {
  account: string;
  receiptIndex: number;
  content: string;
  producer: string;
  transactionId: string;
  notifiedAccounts?: string[];
}

export interface IostAction extends Action {
  payload: IostPayload;
}

export interface Block {
  actions: Action[];
  blockInfo: BlockInfo;
}

export interface BlockInfo {
  version: string; // version
  blockHash: string; // block hash
  headParentHash: string; // block parent head hash
  previousBlockHash: string; // previousBlockHash
  txMerkleHash: string; // txMerkleHash
  txReceiptMerkleHash: string; // txReceiptMerkleHash
  info: string; // info
  blockNumber: number; // number
  witness: string; // witness
  timestamp: Date; // time
  algorithm: number; // algorithm
  sig: string; // sig
  pubKey: string; // pubKey
}

export interface NextBlock {
  block: Block;
  blockMeta: BlockMeta;
  lastIrreversibleBlockNumber: number;
}

export interface BlockMeta {
  isRollback: boolean;
  isEarliestBlock: boolean;
  isNewBlock: boolean;
}

export interface ActionReaderOptions extends LogOptions {
  /**
   * For positive values, this sets the first block that this will start at. For negative
   * values, this will start at (most recent block + startAtBlock), effectively tailing the
   * chain. Be careful when using this feature, as this will make your starting block dynamic.
   */
  startAtBlock?: number;
  /**
   * When false (default), `getHeadBlockNumber` will load the most recent block number. When
   * true, `getHeadBlockNumber` will return the block number of the most recent irreversible
   * block. Keep in mind that `getHeadBlockNumber` is an abstract method and this functionality
   * is the responsibility of the implementing class.
   */
  onlyIrreversible?: boolean;
}

export interface LogOptions {
  logSource?: string;
  logLevel?: LogLevel;
}

export interface Action {
  type: string;
  payload: any;
}

export interface ReaderInfo {
  currentBlockNumber: number;
  startAtBlock: number;
  headBlockNumber: number;
  onlyIrreversible?: boolean;
  lastIrreversibleBlockNumber?: number;
}

export interface ActionReader {
  getNextBlock(): Promise<NextBlock>;
  initialize(): Promise<void>;
  seekToBlock(blockNumber: number): Promise<void>;
  readonly info: ReaderInfo;
}
