import { Block, BlockInfo } from 'demux'
import { IostAction } from '../interfaces'

export class IostBlock implements Block {
  public actions: IostAction[]
  public blockInfo: BlockInfo
  constructor(rawBlock: any) {
    this.actions = this.collectActionsFromBlock(rawBlock.block)
    this.blockInfo = {
      blockNumber: Number(rawBlock.block.number),
      blockHash: rawBlock.block.hash,
      previousBlockHash: rawBlock.block.parent_hash,
      timestamp: new Date(rawBlock.block.time / 1000000),
    }
  }

  protected collectActionsFromBlock(rawBlock: any): any[] {
    const producer = rawBlock.witness
    return this.flattenArray(rawBlock.transactions.map((transaction: any) => {
      return transaction.tx_receipt.status_code === 'SUCCESS' ? transaction.tx_receipt.receipts
        .map((receipt: any, receiptIndex: number) => {
          const [contract, actionName] = receipt.func_name.split('/')
          let content
          try {
            content = JSON.parse(receipt.content)
          } catch (e) {
            content = receipt.content
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
          }
          return block
        }) : []
    }))
  }

  private flattenArray(arr: any[]): any[] {
    return arr.reduce((flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? this.flattenArray(toFlatten) : toFlatten), [])
  }
}
