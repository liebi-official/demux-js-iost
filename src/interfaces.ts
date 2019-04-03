import { Action, ActionReaderOptions } from 'demux'

export interface IostActionReaderOptions extends ActionReaderOptions {
  iostEndpoint?: string
}

export interface IostPayload {
  account: string
  receiptIndex: number
  content: string
  producer: string
  transactionId: string
  notifiedAccounts?: string[]
}

export interface IostAction extends Action {
  payload: IostPayload
}
