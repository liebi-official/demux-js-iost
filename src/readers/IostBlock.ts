import { Block } from "demux";
import { IostAction } from "../interfaces";

export interface BlockInfo {
  blockHash: string;
  version: number;
  previousBlockHash: string;
  txMerkleHash: string;
  txReceiptMerkleHash: string;
  blockNumber: number;
  witness: string;
  timestamp: Date;
  gasUsage: number;
  txCount: number;
  info: string;
  origInfo: string;
}

export class IostBlock implements Block {
  public actions: IostAction[];
  public blockInfo: BlockInfo;
  constructor(rawBlock: any) {
    this.actions = this.collectActionsFromBlock(rawBlock.block);
    this.blockInfo = {
      blockHash: rawBlock.block.hash, // hash
      version: Number(rawBlock.block.version), // version
      previousBlockHash: rawBlock.block.parent_hash, // parent_hash
      txMerkleHash: rawBlock.block.tx_merkle_hash, // tx_merkle_hash
      txReceiptMerkleHash: rawBlock.block.tx_receipt_merkle_hash, // tx_receipt_merkle_hash
      blockNumber: Number(rawBlock.block.number), // number
      witness: rawBlock.block.witness, // witness
      timestamp: new Date(rawBlock.block.time / 1000000), // time
      gasUsage: Number(rawBlock.block.gas_usage), // gas_usage
      txCount: Number(rawBlock.block.tx_count), // tx_count
      info: rawBlock.block.info, // info
      origInfo: rawBlock.block.orig_info, // orig_info
    };
  }

  protected collectActionsFromBlock(rawBlock: any): any[] {
    const producer = rawBlock.witness;
    return this.flattenArray(
      rawBlock.transactions.map((transaction: any) => {
        return transaction.tx_receipt.status_code === "SUCCESS"
          ? transaction.tx_receipt.receipts.map(
              (receipt: any, receiptIndex: number) => {
                const [contract, actionName] = receipt.func_name.split("/");
                let content;
                try {
                  content = JSON.parse(receipt.content);
                } catch (e) {
                  content = receipt.content;
                }
                const block = {
                  type: receipt.func_name,
                  payload: {
                    producer,
                    transactionId: transaction.hash,
                    timestamp: new Date(transaction.time / 1000000),
                    receiptIndex,
                    contract,
                    actionName,
                    content,
                    actions: transaction.actions,
                  },
                };
                return block;
              }
            )
          : [];
      })
    );
  }

  private flattenArray(arr: any[]): any[] {
    return arr.reduce(
      (flat, toFlatten) =>
        flat.concat(
          Array.isArray(toFlatten) ? this.flattenArray(toFlatten) : toFlatten
        ),
      []
    );
  }
}
