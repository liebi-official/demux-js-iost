/* eslint-disable header/header */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/unbound-method */

// Required imports
const { ApiPromise } = require("@polkadot/api");
const { WsProvider } = require("@polkadot/rpc-provider");
const { Keyring } = require("@polkadot/keyring");
const { stringToU8a, stringToHex } = require("@polkadot/util");

async function fetchChainBasic(api) {
  // Retrieve the chain & node information via rpc calls
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);

  console.log("***********Testing basic chain info***********");
  // console.log(api.query);
  console.log(
    `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
  );
}

const IOST_TYPES = {
  TransactionStatus: {
    _enum: [
      "Initialized",
      "Created",
      "SignComplete",
      "Sent",
      "Succeeded",
      "Failed",
    ],
  },
  TokenType: {
    _enum: ["Native", "Stable", "Token", "VToken"],
  },
  Checksum256Array: "Vec<Checksum256>",
  IostMultiSigTx: {
    chain_id: "i32",
    raw_tx: "Vec<u8>",
    multi_sig: "MultiSig",
    action: "IostAction",
    from: "AccountId",
    asset_id: "AssetId",
  },
  IostProcessing: {
    tx_id: "Vec<u8>",
    multi_sig_tx: "IostMultiSigTx",
  },
  IostAction: {
    contract: "Vec<u8>",
    action_name: "Vec<u8>",
    data: "Vec<u8>",
  },
  IostTxOut: {
    _enum: {
      Initial: "IostMultiSigTx",
      Generated: "IostMultiSigTx",
      Signed: "IostMultiSigTx",
      Processing: "IostProcessing",
      Success: "Vec<u8>",
      Fail: "Failed",
    },
  },
  Token: { symbol: "Vec<u8>", precision: "u16", totalSupply: "u128" },
  VersionId: "u32",
  Action: {
    account: "AccountName",
    name: "ActionName",
    authorization: "Vec<PermissionLevel>",
    data: "Vec<u8>",
  },
  PermissionLevel: { actor: "AccountName", permission: "PermissionName" },
  PermissionName: "u64",
  ActionReceipt: {
    receiver: "AccountName",
    act_digest: "Checksum256",
    global_sequence: "u64",
    recv_sequence: "u64",
    auth_sequence: "FlatMap<AccountName, u64>",
    code_sequence: "UnsignedInt",
    abi_sequence: "UnsignedInt",
  },
  Checksum256: "([u8;32])",
  BlockchainType: { _enum: ["BIFROST", "EOS"] },
  Precision: "u32",
  BridgeAssetSymbol: {
    blockchain: "BlockchainType",
    symbol: "Vec<u8>",
    precision: "Precision",
  },
  ProducerSchedule: { version: "u32", producers: "Vec<ProducerKey>" },
  ProducerKey: { producer_name: "AccountName", block_signing_key: "PublicKey" },
  AccountName: "u64",
  ActionName: "u64",
  PublicKey: { type_: "UnsignedInt", data: "[u8;33]" },
  UnsignedInt: "u32",
  Signature: { type_: "UnsignedInt", data: "[u8;65]" },
  SignedBlockHeader: {
    block_header: "BlockHeader",
    producer_signature: "Signature",
  },
  BlockHeader: {
    timestamp: "BlockTimestamp",
    producer: "AccountName",
    confirmed: "u16",
    previous: "Checksum256",
    transaction_mroot: "Checksum256",
    action_mroot: "Checksum256",
    schedule_version: "u32",
    new_producers: "Option<ProducerSchedule>",
    header_extensions: "Vec<Extension>",
  },
  BlockTimestamp: "(u32)",
  Extension: "(u16, Vec<u8>)",
  IncrementalMerkle: { _node_count: "u64", _active_nodes: "Vec<Checksum256>" },
  FlatMap: { map: "Vec<(ActionName, u64)>" },
  TxSig: { signature: "Vec<u8>", author: "AccountId" },
  MultiSig: { signatures: "Vec<TxSig>", threshold: "u8" },
  MultiSigTx: {
    chain_id: "Vec<u8>",
    raw_tx: "Vec<u8>",
    multi_sig: "MultiSig",
    action: "Action",
    from: "AccountId",
    token_symbol: "TokenSymbol",
  },
  Processing: { tx_id: "Vec<u8>", multi_sig_tx: "MultiSigTx" },
  Fail: { tx_id: "Vec<u8>", reason: "Vec<u8>", tx: "MultiSigTx" },
  TxOut: {
    _enum: {
      Initial: "MultiSigTx",
      Generated: "MultiSigTx",
      Signed: "MultiSigTx",
      Processing: "Processing",
      Success: "Vec<u8>",
      Fail: "Fail",
    },
  },
  ConvertPrice: "u128",
  RatePerBlock: "u64",
  Fee: "u64",
  TokenPool: "Balance",
  VTokenPool: "Balance",
  InVariantPool: "Balance",
  TokenSymbol: {
    _enum: [
      "aUSD",
      "DOT",
      "vDOT",
      "KSM",
      "vKSM",
      "EOS",
      "vEOS",
      "IOST",
      "vIOST",
    ],
  },
  TrxStatus: {
    _enum: ["Initial", "Generated", "Signed", "Processing", "Success", "Fail"],
  },
  Cost: "u128",
  Income: "u128",
  Price: "u64",
  AccountAsset: {
    balance: "Balance",
    locked: "Balance",
    available: "Balance",
    cost: "Cost",
    income: "Income",
  },
  SpecIndex: "u32",
  RequestIdentifier: "u64",
  DataVersion: "u64",
  ConvertPool: {
    token_pool: "Balance",
    vtoken_pool: "Balance",
    current_reward: "Balance",
    pending_reward: "Balance",
  },
  ProducerAuthoritySchedule: {
    version: "u32",
    producers: "Vec<ProducerAuthority>",
  },
  ProducerAuthority: {
    producer_name: "ActionName",
    authority: "BlockSigningAuthority",
  },
  BlockSigningAuthority: "(UnsignedInt, BlockSigningAuthorityV0)",
  BlockSigningAuthorityV0: { threshold: "u32", keys: "Vec<KeyWeight>" },
  KeyWeight: { key: "PublicKey", weight: "u16" },
  InvariantValue: "Balance",
  PoolWeight: "Balance",
  AssetConfig: {
    redeem_duration: "BlockNumber",
    min_reward_per_block: "Balance",
  },
  ProxyValidatorRegister: {
    last_block: "BlockNumber",
    deposit: "Balance",
    need: "Balance",
    staking: "Balance",
    reward_per_block: "Balance",
    validator_address: "Vec<u8>",
  },
  BlockNumber: "u32",
};

const BRIDGE_IOST = {
  proveAction: {
    description: "Get the token infomation",
    params: [
      {
        name: "action",
        type: "IostAction",
      },
      {
        name: "trx_id",
        type: "Vec<u8>",
      },
    ],
    // type: "u128",
    isSubscription: false,
    jsonrpc: "bridgeIost_proveAction",
    method: "proveAction",
    section: "bridgeIost",
  },
};

async function main() {
  const provider = new WsProvider("ws://127.0.0.1:9944");
  // const api = await new ApiPromise(options({ provider }));
  const api = await ApiPromise.create({
    provider: provider,
    types: IOST_TYPES,
    rpc: {
      bridgeIost: BRIDGE_IOST,
    },
  });
  await api.isReady;
  console.log(api.genesisHash.toHex());

  //   console.log("********", api.tx.bridgeIost.proveAction);

  // The actual address that we will use
  const ADDR = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";

  // Retrieve the last timestamp
  const now = await api.query.timestamp.now();

  // Retrieve the account balance & nonce via the system module
  const { nonce, data: balance } = await api.query.system.account(ADDR);

  console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);

  const keyring = new Keyring({ type: "sr25519" });
  // const keyring = new Keyring({ type: 'ed25519' });
  const alice = keyring.addFromUri("//Alice", { name: "Alice default" });

  //   let iostAction = {
  //     contract: stringToU8a("token.iost"),
  //     action_name: stringToU8a("transfer"),
  //     data: stringToU8a(
  //       '["iost","lispczz5","bifrost","1","5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY@bifrost:IOST"]'
  //     ),
  //   };

  //   let iostAction = {
  //     contract: stringToHex("token.iost"),

  //     action_name: stringToHex("transfer"),
  //     data: stringToHex(
  //       '["iost","lispczz5","bifrost","1","5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY@bifrost:IOST"]'
  //     ),
  //   };

  let iostAction = {
    contract: "token.iost",

    action_name: "transfer",
    data:
      '["iost","lispczz5","bifrost","1","5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY@bifrost:IOST"]',
  };

  console.log("******", iostAction);

  //   let trx_id = stringToU8a("9aWt5TqPo22wXLY1t5RRQgn3ZiCM7k1pSrMYqQ2EC3mg");
  //   let trx_id = stringToHex("9aWt5TqPo22wXLY1t5RRQgn3ZiCM7k1pSrMYqQ2EC3mg");

  let trx_id = "9aWt5TqPo22wXLY1t5RRQgn3ZiCM7k1pSrMYqQ2EC3mg";

  const result = await api.tx.bridgeIost
    .proveAction(iostAction, trx_id)
    .signAndSend(alice);

  console.log(result);
  // const out = await api.query.assets.accountAssets({ assetId: 8, accountId: ADDR });

  // assets.assetsInfo.forEach(element => {
  //     console.log(element.assetInfo);
  //     console.log(element.tokenName);
  // });

  await fetchChainBasic(api);
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

main()
  .catch(console.error)
  .finally(() => process.exit());
