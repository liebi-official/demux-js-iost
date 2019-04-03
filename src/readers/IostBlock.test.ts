import { iostRawBlock } from '../testHelpers/iostRawBlock'
import { IostBlock } from './IostBlock'

describe('IostBlock', () => {
  let iostBlock: IostBlock

  beforeEach(() => {
    iostBlock = new IostBlock(iostRawBlock)
  })

  it('collects actions from blocks', async () => {
    const { actions } = iostBlock
    expect(actions).toEqual([
      {
        payload: {
          producer: '8XoWNnLnP9hpnyZLsxqzC356V1vLvfecXWGtuFZ1yMSo',
          transactionId: '31WpEckcUoqgNaZb7puiTsksgnqv2f59reVRsKYTDNEV',
          receiptIndex: 0,
          contract: 'token.iost',
          actionName: 'issue',
          content: ['contribute', 'chronus', '2.02794405'],
          actions: [{action_name: 'exec', contract: 'base.iost',
            data: '[{\"parent\":[\"8XoWNnLnP9hpnyZLsxqzC356V1vLvfecXWGtuFZ1yMSo\", \"0\", false]}]'}]
        },
        type: 'token.iost/issue',
      }
    ])
  })
})
