import request from "request-promise-native";
import {
  NotInitializedError,
  RetrieveBlockError,
  RetrieveHeadBlockError,
  RetrieveIrreversibleBlockError,
} from "../errors";
import { IostActionReaderOptions } from "../interfaces";
import { retry } from "../utils";
import { IostBlock } from "./IostBlock";
import axios from "axios";
import { AbstractActionReader } from "./AbstractActionReader";

/**
 * Reads from an IOST node to get blocks of actions.
 * It is important to note that deferred transactions will not be included,
 * as these are currently not accessible without the use of plugins.
 */
export class IostActionReader extends AbstractActionReader {
  protected iostEndpoint: string;

  constructor(options: IostActionReaderOptions = {}) {
    super(options);
    const iostEndpoint = options.iostEndpoint
      ? options.iostEndpoint
      : "http://localhost:30001";
    this.iostEndpoint = iostEndpoint.replace(/\/+$/g, ""); // Removes trailing slashes
  }

  /**
   * Returns a promise for the head block number.
   */
  public async getHeadBlockNumber(
    numRetries: number = 3000,
    waitTimeMs: number = 250
  ): Promise<number> {
    try {
      const blockNum = await retry(
        async () => {
          const blockInfo = await request.get({
            url: `${this.iostEndpoint}/getChainInfo`,
            json: true,
          });
          return Number(blockInfo.head_block);
        },
        numRetries,
        waitTimeMs
      );

      return blockNum;
    } catch (err) {
      throw new RetrieveHeadBlockError();
    }
  }

  public async getLastIrreversibleBlockNumber(
    numRetries: number = 3000,
    waitTimeMs: number = 250
  ): Promise<number> {
    try {
      const irreversibleBlockNum = await retry(
        async () => {
          const blockInfo = await request.get({
            url: `${this.iostEndpoint}/getChainInfo`,
            json: true,
          });
          return Number(blockInfo.lib_block);
        },
        numRetries,
        waitTimeMs
      );

      return irreversibleBlockNum;
    } catch (err) {
      throw new RetrieveIrreversibleBlockError();
    }
  }

  // /**
  //  * Returns a promise for a `IostBlock`.
  //  */
  // public async getBlock(
  //   blockNumber: number,
  //   numRetries: number = 3000,
  //   waitTimeMs: number = 250
  // ): Promise<IostBlock> {
  //   try {
  //     const block = await retry(
  //       async () => {
  //         const rawBlock = await request.get({
  //           url: `${this.iostEndpoint}/getBlockByNumber/${blockNumber}/true`,
  //           json: true,
  //         });
  //         return new IostBlock(rawBlock);
  //       },
  //       numRetries,
  //       waitTimeMs
  //     );

  //     return block;
  //   } catch (err) {
  //     throw new RetrieveBlockError();
  //   }
  // }

  public async getBlock(
    blockNumber: number,
    numRetries: number = 3000,
    waitTimeMs: number = 250
  ): Promise<IostBlock> {
    try {
      const block = await retry(
        async () => {
          let rawBlock = await await axios.get(
            `${this.iostEndpoint}/getRawBlockByNumber/${blockNumber}/true`
          );

          const rawBlock2 = await await axios.get(
            `${this.iostEndpoint}/getBlockByNumber/${blockNumber}/true`
          );

          rawBlock.data.block.head.hash = rawBlock2.data.block.hash;
          rawBlock.data.block.head.previousBlockHash =
            rawBlock2.data.block.parent_hash;

          return rawBlock.data;
        },
        numRetries,
        waitTimeMs
      );

      return new IostBlock(block);
    } catch (err) {
      throw new RetrieveBlockError();
    }
  }

  protected async setup(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await request.get({
        url: `${this.iostEndpoint}/getChainInfo`,
        json: true,
      });
    } catch (err) {
      throw new NotInitializedError(
        "Cannot reach supplied iost endpoint.",
        err
      );
    }
  }
}
