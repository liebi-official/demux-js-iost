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

export interface ActionHandler {
  handleBlock(nextBlock: NextBlock, isReplay: boolean): Promise<number | null>;
  initialize(): Promise<void>;
  readonly info: HandlerInfo;
}

export interface HandlerInfo {
  lastProcessedBlockNumber: number;
  lastProcessedBlockHash: string;
  lastIrreversibleBlockNumber: number;
  handlerVersionName: string;
  isReplay?: boolean;
  effectRunMode?: EffectRunMode;
  numberOfRunningEffects?: number;
  effectErrors?: string[];
}

export enum EffectRunMode {
  All = "all",
  OnlyImmediate = "onlyImmediate",
  OnlyDeferred = "onlyDeferred",
  None = "none",
}

export interface ActionHandlerOptions extends LogOptions {
  effectRunMode?: EffectRunMode;
  maxEffectErrors?: number;
  validateBlocks?: boolean;
}

export type CurriedEffectRun = (
  currentBlockNumber: number,
  immediate?: boolean
) => Promise<void>;

export interface DeferredEffects {
  [blockNumber: number]: CurriedEffectRun[];
}

export interface Effect extends ActionListener {
  run: StatelessActionCallback;
  deferUntilIrreversible?: boolean;
  onRollback?: StatelessActionCallback;
}

export interface ActionListener {
  actionType: string;
}

export type StatelessActionCallback = (
  payload: any,
  blockInfo: BlockInfo,
  context: any
) => void | Promise<void>;

export interface EffectsInfo {
  numberOfRunningEffects: number;
  effectErrors: string[];
}

export interface HandlerVersion {
  versionName: string;
  updaters: Updater[];
  effects: Effect[];
}

export interface Updater extends ActionListener {
  apply: ActionCallback;
  revert?: ActionCallback;
}

export type ActionCallback = (
  state: any,
  payload: any,
  blockInfo: BlockInfo,
  context: any
) => void | string | Promise<void> | Promise<string>;

export interface IndexState {
  blockNumber: number;
  lastIrreversibleBlockNumber: number;
  blockHash: string;
  handlerVersionName: string;
  isReplay: boolean;
}

export interface VersionedAction {
  action: Action;
  handlerVersionName: string;
}

export interface ActionWatcherOptions extends LogOptions {
  pollInterval?: number;
  velocitySampleSize?: number;
}

export interface DemuxInfo {
  watcher: WatcherInfo;
  handler: HandlerInfo;
  reader: ReaderInfo;
}

export interface WatcherInfo {
  indexingStatus: IndexingStatus;
  error?: Error;
  currentBlockVelocity: number;
  currentBlockInterval: number;
  maxBlockVelocity: number;
}

export enum IndexingStatus {
  Initial = "initial",
  Indexing = "indexing",
  Pausing = "pausing",
  Paused = "paused",
  Stopped = "stopped",
}
