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

  protected collectActionsFromBlock(rawBlock: any): IostAction[] {
    const producer = rawBlock.witness
    return this.flattenArray(rawBlock.transactions.map((transaction: any) => {
      return transaction.actions.map((action: any, actionIndex: number) => {
        const block = {
          type: `${action.contract}::${action.action_name}`,
          payload: {
            receipt: transaction.tx_receipt,
            producer,
            transactionId: transaction.hash,
            actionIndex,
            ...action,
          },
        }

        return block
      })
    }))
  }

  private flattenArray(arr: any[]): any[] {
    return arr.reduce((flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? this.flattenArray(toFlatten) : toFlatten), [])
  }
}
