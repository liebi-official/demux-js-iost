import { NotInitializedError } from 'demux'
import request from 'request-promise-native'
import { iostRawBlock } from '../testHelpers/iostRawBlock'
import { IostActionReader } from './IostActionReader'

describe('IostActionReader', () => {
  let reader: IostActionReader

  const blockInfo = {
    head_block: '7492383',
    lib_block: '7495141',
  }

  beforeEach(() => {
    reader = new IostActionReader({
      iostEndpoint: '',
      startAtBlock: 10,
      onlyIrreversible: false
    })
  })

  it('returns head block number', async () => {
    request.get = jest.fn(async () => blockInfo)
    const blockNum = await reader.getHeadBlockNumber()
    expect(blockNum).toBe(7492383)
  })

  it('returns last irreversible block number', async () => {
    request.get = jest.fn(async () => blockInfo)
    const blockNum = await reader.getLastIrreversibleBlockNumber()
    expect(blockNum).toBe(7495141)
  })

  it('gets block with correct block number', async () => {
    request.get = jest.fn(async () => iostRawBlock)
    const block = await reader.getBlock(3)
    expect(block.blockInfo.blockNumber).toEqual(3)
  })

  it('throws if not correctly initialized', async () => {
    request.get = jest.fn(async () => { throw new Error('404: This page does not exist') })
    reader.getLastIrreversibleBlockNumber = jest.fn(() => blockInfo)
    const result = reader.getNextBlock()
    await expect(result).rejects.toThrow(NotInitializedError)
  })
})
