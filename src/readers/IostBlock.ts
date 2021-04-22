import { IostAction, Block, BlockInfo } from "../interfaces";

export class IostBlock implements Block {
  public actions: IostAction[];
  public blockInfo: BlockInfo;
  constructor(rawBlock: any) {
    this.actions = this.collectActionsFromBlock(rawBlock.block);

    this.blockInfo = {
      version: rawBlock.block.head.version, // version
      blockHash: rawBlock.block.head.hash, // block hash
      headParentHash: rawBlock.block.head.parentHash, // block parent head hash
      previousBlockHash: rawBlock.block.head.previousBlockHash, // previousBlockHash
      txMerkleHash: rawBlock.block.head.txMerkleHash, // txMerkleHash
      txReceiptMerkleHash: rawBlock.block.head.txReceiptMerkleHash, // txReceiptMerkleHash
      info: rawBlock.block.head.info, // info
      blockNumber: Number(rawBlock.block.head.number), // number
      witness: rawBlock.block.head.witness, // witness
      timestamp: new Date(Number(rawBlock.block.head.time) / 1000000), // time
      algorithm: rawBlock.block.sign.algorithm, // algorithm
      sig: rawBlock.block.sign.sig, // sig
      pubKey: rawBlock.block.sign.pubKey, // pubKey
    };
  }

  protected collectActionsFromBlock(rawBlock: any): any[] {
    const producer = rawBlock.head.witness;

    return this.flattenArray(
      rawBlock.receipts.map((higherReceipt: any, transactionIndex: number) => {
        return higherReceipt.status.code === 0
          ? higherReceipt.receipts.map((receipt: any, receiptIndex: number) => {
              const [contract, actionName] = receipt.funcName.split("/");

              let content;
              try {
                content = JSON.parse(receipt.content);
              } catch (e) {
                content = receipt.content;
              }

              const block = {
                type: receipt.funcName,
                payload: {
                  producer,
                  transactionId: higherReceipt.txHash,
                  timestamp: new Date(
                    Number(rawBlock.txs[transactionIndex].time) / 1000000
                  ),
                  receiptIndex,
                  contract,
                  actionName,
                  content,
                  actions: rawBlock.txs[transactionIndex].actions,
                },
              };

              return block;
            })
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
