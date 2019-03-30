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
          actionIndex: 0,
          contract: 'base.iost',
          action_name: 'exec',
          data: '[{"parent":["8XoWNnLnP9hpnyZLsxqzC356V1vLvfecXWGtuFZ1yMSo", "0", false]}]',
          receipt: {
            tx_hash: '31WpEckcUoqgNaZb7puiTsksgnqv2f59reVRsKYTDNEV',
            gas_usage: 0,
            ram_usage: {},
            status_code: 'SUCCESS',
            message: '',
            returns: ['[""]'],
            receipts: [
              {
                func_name: 'token.iost/issue',
                content: '["contribute","chronus","2.02794405"]'
              }
            ]
          }
        },
        type: 'base.iost::exec',
      }
    ])
  })
})
