export const iostRawBlock = {
  status: 'IRREVERSIBLE',
  block: {
    hash: 'F1JLLg7BxBuPjsEiBwh5pN3JkgrNaHa776utpdgpFPSt',
    version: '0',
    parent_hash: '8oB7TRFY2UryC9ehubqVZyH3GhPknDZjZWEvucyq1fEK',
    tx_merkle_hash: 'F4DJShswTE5CdCUMJJGDnHNuVKEc3cBCsiqmj53Aisqa',
    tx_receipt_merkle_hash: 'EHBN8stTTQ2n14FhQZwKMaaheN7oYhYpU7eBKu3KxGNu',
    number: '3',
    witness: '8XoWNnLnP9hpnyZLsxqzC356V1vLvfecXWGtuFZ1yMSo',
    time: '1549892311001348463',
    gas_usage: 0,
    tx_count: '1',
    info: { mode: 0, thread: 0, batch_index: [] },
    transactions: [
      {
        hash: '31WpEckcUoqgNaZb7puiTsksgnqv2f59reVRsKYTDNEV',
        time: '1549892311001348463',
        expiration: '0',
        gas_ratio: 1,
        gas_limit: 1000000,
        delay: '0',
        chain_id: 1024,
        actions: [
          {
            contract: 'base.iost',
            action_name: 'exec',
            data:
              '[{"parent":["8XoWNnLnP9hpnyZLsxqzC356V1vLvfecXWGtuFZ1yMSo", "0", false]}]'
          }
        ],
        signers: [],
        publisher: 'base.iost',
        referred_tx: '',
        amount_limit: [],
        tx_receipt: {
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
      }
    ]
  }
}
