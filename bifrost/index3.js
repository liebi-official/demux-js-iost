/* eslint-disable header/header */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/unbound-method */

// Required imports
const { ApiPromise } = require('@polkadot/api');
const { WsProvider } = require('@polkadot/rpc-provider');
const { options } = require('@bifrost-finance/api');
// const { BN } = require('bn.js');
// const { of } = require( 'rxjs');

 async function testChainBasic (api) {
    // Retrieve the chain & node information via rpc calls
    const [chain, nodeName, nodeVersion, nextAssetId] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
      api.query.assets.nextAssetId(),
    ]);
  
    console.log('***********Testing basic chain info***********');
    // console.log(api.query);
    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
    console.log(`nextAssetId: ${nextAssetId}`);
  }

  async function testAssets (api) {
    // Retrieve token assets info via rpc calls
    const [tokenInfo, allTokenInfo, singleAccountAsset, accountAssets, manyAccountsAssets] = await Promise.all([
      api.derive.assets.getTokenInfo('vEos'), // Should be one of the following string, not case sensitive. 'vDOT', 'vKSM', 'vEOS'
      api.derive.assets.getAllTokenInfo(),  // Can be an subset of the array ['vDOT', 'vKSM', 'vEOS']. Parameters are optional. If nothing is passed in, it's default value is the array of ['vDOT', 'vKSM', 'vEOS'].
      api.derive.assets.getSingleAccountAsset(),  // Input parameters must contain be AccountId and vToken in order.
      api.derive.assets.getAccountAssets('bixYxFRJkFMwMRnSCH9GQbYsurmL6n88eKnh6ron8ZvgwTY'),  // Input parameters must contain an accountId and optional for a list of tokenArray.
      api.derive.assets.getManyAccountsAssets(['bixYxFRJkFMwMRnSCH9GQbYsurmL6n88eKnh6ron8ZvgwTY', 'cgUeaC4T7BCyx4CVX3HXvee2PUqqM5bE1VFVHNccovXeJEs']),  // Input parameters must contain a list of accountIds and optional for a list of tokenArray.
    ]);
  
    console.log('\n***********Testing Assets info***********');
    console.log(`TokenInfo: ${tokenInfo.symbol}`);
    console.log(`allTokenInfo: ${allTokenInfo}`);
    console.log(`singleAccountAsset: ${singleAccountAsset.assetInfo}`);
    console.log(`accountAssets: ${accountAssets['assetsInfo'][0]['tokenName']}`);
    console.log(`manyAccountsAssets: ${manyAccountsAssets[0]['accountName']}`);
  }

  async function testConvert (api) {
    // Retrieve convert pool info via rpc calls
    const [poolInfo, designatedBlockHash, allVtokenConvertInfo, convertPriceInfo, allConvertPriceInfo, annualizedRate, allAnnualizedRate] = await Promise.all([
      api.derive.convert.getPoolInfo('vEOS'), // Should be one of the following string, not case sensitive. 'vDOT', 'vKSM', 'vEOS'
      api.derive.convert.getDesignatedBlockHash(),
      api.derive.convert.getAllVtokenConvertInfo(),  // Can be an subset of the array ['vDOT', 'vKSM', 'vEOS']. Parameters are optional. If nothing is passed in, it's default value is the array of ['vDOT', 'vKSM', 'vEOS'].
      api.derive.convert.getConvertPriceInfo('vdot'), // Should be one of the following string, not case sensitive. 'vDOT', 'vKSM', 'vEOS'
      api.derive.convert.getAllConvertPriceInfo(), // Can be an subset of the array ['vDOT', 'vKSM', 'vEOS']. Parameters are optional. If nothing is passed in, it's default value is the array of ['vDOT', 'vKSM', 'vEOS'].
      api.derive.convert.getAnnualizedRate('vEos'), // Should be one of the following string, not case sensitive. 'vDOT', 'vKSM', 'vEOS'
      api.derive.convert.getAllAnnualizedRate(), // Can be an subset of the array ['vDOT', 'vKSM', 'vEOS']. Parameters are optional. If nothing is passed in, it's default value is the array of ['vDOT', 'vKSM', 'vEOS'].
    ]);
  
    console.log('\n***********Testing Convert info***********');
    console.log(`poolInfo: ${poolInfo}`);
    console.log(`designatedBlockHash: ${designatedBlockHash}`);
    console.log(`allVtokenConvertInfo: ${allVtokenConvertInfo}`);
    console.log(`convertPriceInfo: ${convertPriceInfo}`);
    console.log(`allConvertPriceInfo: ${allConvertPriceInfo}`);
    console.log(`annualizedRate: ${annualizedRate}`);
    console.log(`allAnnualizedRate: ${allAnnualizedRate}`);
  }

  async function testAggregatedVtokenPool (api) {
    // Retrieve the aggregated vToken pool information via rpc calls
    const [allTokenPoolInfo] = await Promise.all([
      api.derive.aggregated.getAllTokenPoolInfo(),  // Can be an subset of the array ['vDOT', 'vKSM', 'vEOS']. Parameters are optional. If nothing is passed in, it's default value is the array of ['vDOT', 'vKSM', 'vEOS'].
    ]);

    console.log('\n***********Testing Aggregated info***********');
    console.log(`allTokenPoolInfo: ${allTokenPoolInfo[0].annualizedRate}`);

  }

  async function testNewlyAddedInterfaces (api) {
    // Retrieve the aggregated vToken pool information via rpc calls
    const [accountTotalValue, accountIncomeValue, vTokenMarketPriceValue, vTokenConvertPriceValue, vTokenPriceDiff, vTokenConvertPriceHistory] = await Promise.all([
      api.derive.aggregated.getAccountTotalValue('bixYxFRJkFMwMRnSCH9GQbYsurmL6n88eKnh6ron8ZvgwTY'), 
      api.derive.aggregated.getAccountIncomeValue('bixYxFRJkFMwMRnSCH9GQbYsurmL6n88eKnh6ron8ZvgwTY'),  // The only required parameter is AccountId, 收益价值
      api.derive.aggregated.getVtokenMarketPriceValue('veos'),   //vtoken name is the only required parameter。Vtoken的市场价值，以usd计价
      api.derive.aggregated.getVtokenConvertPriceValue('veos'),  //vtoken name is the only required parameter。Vtoken的转换价值，以usd计价
      api.derive.aggregated.getVtokenPriceDiff('veos'),  //vtoken name is the only required parameter。vtoken的差价 = 转换价值 - 市场价值
      api.derive.aggregated.getVtokenConvertPriceHistory('veos') // vtoken name is the only required parameter。这个还有点问题，还在修复中
    ]);

    console.log('\n***********Testing NewlyAddedInterfaces info***********');
    console.log(`accountTotalValue: ${accountTotalValue}`);
    console.log(`accountIncomeValue: ${accountIncomeValue}`);
    console.log(`vTokenMarketPriceValue: ${vTokenMarketPriceValue}`);
    console.log(`vTokenConvertPriceValue: ${vTokenConvertPriceValue}`);
    console.log(`vTokenPriceDiff: ${vTokenPriceDiff}`);
    console.log(`vTokenConvertPriceHistory: ${vTokenConvertPriceHistory['convertPriceList']}`);
  }

var types = {
  "Address": "MultiAddress",
  "LookupSource": "MultiAddress",
  "Token": {
    "symbol": "Vec<u8>",
    "precision": "u16",
    "totalSupply": "u128"
  },
  "VersionId": "u32",
  "Action": {
    "account": "AccountName",
    "name": "ActionName",
    "authorization": "Vec<PermissionLevel>",
    "data": "Vec<u8>"
  },
  "IostAction": {
    "contract": "Vec<u8>",
    "action_name": "Vec<u8>",
    "data": "Vec<u8>"
  },
  "PermissionLevel": {
    "actor": "AccountName",
    "permission": "PermissionName"
  },
  "PermissionName": "u64",
  "ActionReceipt": {
    "receiver": "AccountName",
    "act_digest": "Checksum256",
    "global_sequence": "u64",
    "recv_sequence": "u64",
    "auth_sequence": "FlatMap<AccountName, u64>",
    "code_sequence": "UnsignedInt",
    "abi_sequence": "UnsignedInt"
  },
  "Checksum256": "([u8;32])",
  "BlockchainType": {
    "_enum": [
      "BIFROST",
      "EOS",
      "IOST"
    ]
  },
  "Precision": "u32",
  "BridgeAssetSymbol": {
    "blockchain": "BlockchainType",
    "symbol": "Vec<u8>",
    "precision": "Precision"
  },
  "ProducerSchedule": {
    "version": "u32",
    "producers": "Vec<ProducerKey>"
  },
  "ProducerKey": {
    "producer_name": "AccountName",
    "block_signing_key": "PublicKey"
  },
  "AccountName": "u64",
  "ActionName": "u64",
  "PublicKey": {
    "type_": "UnsignedInt",
    "data": "[u8;33]"
  },
  "UnsignedInt": "u32",
  "Signature": {
    "type_": "UnsignedInt",
    "data": "[u8;65]"
  },
  "SignedBlockHeader": {
    "block_header": "BlockHeader",
    "producer_signature": "Signature"
  },
  "BlockHeader": {
    "timestamp": "BlockTimestamp",
    "producer": "AccountName",
    "confirmed": "u16",
    "previous": "Checksum256",
    "transaction_mroot": "Checksum256",
    "action_mroot": "Checksum256",
    "schedule_version": "u32",
    "new_producers": "Option<ProducerSchedule>",
    "header_extensions": "Vec<Extension>"
  },
  "BlockTimestamp": "(u32)",
  "Extension": "(u16, Vec<u8>)",
  "IncrementalMerkle": {
    "_node_count": "u64",
    "_active_nodes": "Checksum256Array"
  },
  "Checksum256Array": "Vec<Checksum256>",
  "FlatMap": {
    "map": "Vec<(ActionName, u64)>"
  },
  "TxSig": {
    "signature": "Vec<u8>",
    "author": "AccountId"
  },
  "MultiSig": {
    "signatures": "Vec<TxSig>",
    "threshold": "u8"
  },
  "MultiSigTx": {
    "chain_id": "Vec<u8>",
    "raw_tx": "Vec<u8>",
    "multi_sig": "MultiSig",
    "action": "Action",
    "from": "AccountId",
    "asset_id": "AssetId"
  },
  "Sent": {
    "tx_id": "Vec<u8>",
    "from": "AccountId",
    "asset_id": "AssetId"
  },
  "Succeeded": {
    "tx_id": "Vec<u8>"
  },
  "Failed": {
    "tx_id": "Vec<u8>",
    "reason": "Vec<u8>"
  },
  "TxOut": {
    "_enum": {
      "Initialized": "MultiSigTx",
      "Created": "MultiSigTx",
      "SignComplete": "MultiSigTx",
      "Sent": "Sent",
      "Succeeded": "Succeeded",
      "Failed": "Failed"
    }
  },
  "IostMultiSigTx": {
    "chain_id": "i32",
    "raw_tx": "Vec<u8>",
    "multi_sig": "MultiSig",
    "action": "IostAction",
    "from": "AccountId",
    "asset_id": "AssetId"
  },
  "IostProcessing": {
    "tx_id": "Vec<u8>",
    "multi_sig_tx": "IostMultiSigTx"
  },
  "IostTxOut": {
    "_enum": {
      "Initial": "IostMultiSigTx",
      "Generated": "IostMultiSigTx",
      "Signed": "IostMultiSigTx",
      "Processing": "IostProcessing",
      "Success": "Vec<u8>",
      "Fail": "Failed"
    }
  },
  "RewardRecord": {
    "account_id": "AccountId",
    "record_amount": "Balance"
  },
  "ConvertPrice": "u128",
  "RatePerBlock": "u64",
  "Fee": "u64",
  "PoolId": "u32",
  "Nonce": "u32",
  "PoolDetails": {
    "owner": "AccountId",
    "swap_fee_rate": "Fee",
    "active": "bool"
  },
  "PoolCreateTokenDetails": {
    "token_id": "AssetId",
    "token_balance": "Balance",
    "token_weight": "PoolWeight"
  },
  "TokenPool": "Balance",
  "VTokenPool": "Balance",
  "InVariantPool": "Balance",
  "TransactionStatus": {
    "_enum": ["Initialized", "Created", "SignComplete", "Sent", "Succeeded", "Failed"]
  },
  "Price": "u64",
  "AccountAsset": {
    "balance": "Balance",
    "locked": "Balance",
    "available": "Balance"
  },
  "SpecIndex": "u32",
  "RequestIdentifier": "u64",
  "DataVersion": "u64",
  "ConvertPool": {
    "token_pool": "Balance",
    "vtoken_pool": "Balance",
    "current_reward": "Balance",
    "pending_reward": "Balance"
  },
  "ProducerAuthoritySchedule": {
    "version": "u32",
    "producers": "Vec<ProducerAuthority>"
  },
  "ProducerAuthority": {
    "producer_name": "ActionName",
    "authority": "BlockSigningAuthority"
  },
  "BlockSigningAuthority": "(UnsignedInt, BlockSigningAuthorityV0)",
  "BlockSigningAuthorityV0": {
    "threshold": "u32",
    "keys": "Vec<KeyWeight>"
  },
  "KeyWeight": {
    "key": "PublicKey",
    "weight": "u16"
  },
  "InvariantValue": "Balance",
  "PoolWeight": "Balance",
  "AssetConfig": {
    "redeem_duration": "BlockNumber",
    "min_reward_per_block": "Balance"
  },
  "ProxyValidatorRegister": {
    "last_block": "BlockNumber",
    "deposit": "Balance",
    "need": "Balance",
    "staking": "Balance",
    "reward_per_block": "Balance",
    "validator_address": "Vec<u8>"
  },
  "BlockNumber": "u32",
  "TokenType": {
    "_enum": [
      "Native",
      "Stable",
      "Token",
      "VToken"
    ]
  }
}

async function main () {
  const provider = new WsProvider('ws://127.0.0.1:9944');
  // const api = await new ApiPromise(options({ provider }));
  const api = await ApiPromise.create({provider: provider, types: types});
  await api.isReady;
  console.log(api.genesisHash.toHex());

    // The actual address that we will use
    const ADDR = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

    // Retrieve the last timestamp
    const now = await api.query.timestamp.now();

    // Retrieve the account balance & nonce via the system module
    const { nonce, data: balance } = await api.query.system.account(ADDR);

    console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);

    // const assets = await api.derive.assets.getAccountAssets(ADDR);
    
    // assets.assetsInfo.forEach(element => {
    //     console.log(element.assetInfo);
    //     console.log(element.tokenName);
    // });

  await testChainBasic(api);
  // await testAssets(api);
  // await testConvert(api);
//   await testAggregatedVtokenPool(api);
//   await testNewlyAddedInterfaces(api);

    // const lastHdr = await api.rpc.chain.getHeader();
    // const startHdr = await api.rpc.chain.getBlockHash(61245);

    // const result = await api.derive.convert.getPoolInfo('ksm', startHdr);
    // const result = await api.query.pool.at(startHdr, 'ksm');
    // console.log(lastHdr.toString());

}

main().catch(console.error).finally(() => process.exit());


