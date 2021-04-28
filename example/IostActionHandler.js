/* IostActionHandler
 * This is an example of an AbstractActionHandler implementation.
 *
 * The role of the Action Handler is to receive block data passed from the Action Reader, and populate some external
 * state deterministically derived from that data, as well as trigger side-effects.
 *
 * The AbstractActionHandler has the following abstract methods:
 *
 * handleWithState(handle)
 *   Call the passed-in `handle` function with the object you would like to pass in as `state` to Updaters and Effects.
 *   In this example, we're just using a simple structured Javascript object, but in a real implementation this will
 *   most likely an interface to a database. See the API documentation for more details.
 *
 * updateIndexState(state, block)
 *   Besides some caching optimizations, the state of the progress of indexing is stored outside of Demux itself, and
 *   this method is implemented to store that data. The data needed to be stored is blockNumber, blockHash, isReplay,
 *   and handlerVersionName. the `state` object passed into the `handle` function of the above `handleWithState` is
 *   provided here as a convenience.
 *
 * loadIndexState()
 *   This returns an `IndexState` object containing all the information saved in the above method.
 *
 * rollbackTo(blockNumber)
 *   If indexing potentially reversible blocks, a mechanism for reverting back to a specific block is necessary.
 *   In this example, we keep a history of the entire state at every block, and load it when called.
 */

const { AbstractActionHandler } = require("demux-js-iost");

// const { IOST_TYPES, BRIDGE_IOST } =  require('./type.js');

const { ApiPromise } = require("@polkadot/api");
const { WsProvider } = require("@polkadot/rpc-provider");
const { Keyring } = require("@polkadot/keyring");

const provider = new WsProvider("ws://127.0.0.1:9944");
// const api = await new ApiPromise(options({ provider }));
var api;



async function proveAction(iostAction, trx_id, head, headers) {
  console.log(iostAction)
  console.log(head)

  const keyring = new Keyring({ type: "sr25519" });
  const alice = keyring.addFromUri("//Alice", { name: "Alice default" });

  const result = await api.tx.bridgeIost
      .proveAction(iostAction, trx_id, head, headers)
      .signAndSend(alice);
  // return 
  // console.log("Execute proveAction result:", u8aToHex(result))
  console.log("Execute proveAction result:", result);
}

// Initial state
let state = {
  volumeBySymbol: {},
  totalTransfers: 0,
  indexState: {
    blockNumber: 0,
    blockHash: "",
    isReplay: false,
    handlerVersionName: "v1",
  },
};

const stateHistory = {};
const stateHistoryMaxLength = 300;

const bridge_prove_action = {
  block_number: 0,
  action: {},
  state: 0,
  trx_id: '',
  block: {},
  block_list: []
};

const bridge_change_schedule = {
  block_number: 0,
  producers: [],
  state: 0,
  block: {},
  block_list: []
};

const block_index_max_size = 512;

const bridge_prove_action_index = [];
const bridge_change_schedule_index = [];

function parse_producers(content) {
    const producers = [];
    for (const producer of JSON.parse(content).pendingList) {
        // console.log(stringToHex(producer));
        producers.push(String(producer));
    }
    return producers;
}

function prove_action_timer_tick() {
  for (const bridge_prove_action of bridge_prove_action_index) {
    if (bridge_prove_action.state != 1) {
      continue;
    }
    
  }
}

function change_schedule_timer_tick() {
  for (const bridge_change_schedule of bridge_change_schedule_index) {
    if (bridge_change_schedule.state != 1) {
      continue;
    }
    
  }
}
class IostActionHandler extends AbstractActionHandler {
  async setup() {
    api = await ApiPromise.create({
      provider: provider,
      types: IOST_TYPES,
      rpc: {
          bridgeIost: BRIDGE_IOST,
      },
    });
    await api.isReady;
  
    console.log("IostActionHandler setup");
  }

  async handleWithState(handle) {
    await handle(state);
    const { blockNumber } = state.indexState;
    stateHistory[blockNumber] = JSON.parse(JSON.stringify(state));
    if (
      blockNumber > stateHistoryMaxLength &&
      stateHistory[blockNumber - stateHistoryMaxLength]
    ) {
      delete stateHistory[blockNumber - stateHistoryMaxLength];
    }
  }

  async loadIndexState() {
    return state.indexState;
  }

  async updateIndexState(stateObj, block, isReplay, handlerVersionName) {
    const block_number = block.block.blockInfo.blockNumber;
    for (const action of block.block.actions) {
      if ("vote_producer.iost/stat" === action.type) {
        console.log("****************block*******************");
        console.log(action)
        console.log(action.payload.content)
        bridge_change_schedule_index.push({
          block_number: block_number,
          producers: parse_producers(action.payload.content),
          state: 0,
          block: parse_block(block.block.blockInfo),
          block_list: []
        });
        console.log("****************************************");
      }
      if ("token.iost/transfer" === action.type) {
        let content = action.payload.content;
        if (content.length > 3 && (content[2] === 'bifrost' || content[1] === 'bifrost')){
          console.log(content);
        }

        console.log(parse_block(block.block.blockInfo));
        bridge_prove_action_index.push({
          trx_id: action.payload.transactionId,
          block_number: block.block.blockInfo.blockNumber,
          action: {
            contract: "token.iost",
            action_name: "transfer",
            data:
              action.payload.content,
          },
          state: 0,
          block: parse_block(block.block.blockInfo),
          block_list: []
        })
      }
    }

    for (const bridge_prove_action of bridge_prove_action_index) {
      if (bridge_prove_action.block_number == 0) {
        continue;
      }
      if (bridge_prove_action.state == 0 && bridge_prove_action.block_list.length < 108) {
        if (bridge_prove_action.block_number < block_number) {
          bridge_prove_action.block_list.push(parse_block(block.block.blockInfo));
        }
      }
      if (bridge_prove_action.state == 0 && bridge_prove_action.block_list.length >= 108) {
        bridge_prove_action.state = 1;

        const keyring = new Keyring({ type: "sr25519" });
        const alice = keyring.addFromUri("//Alice", { name: "Alice default" });

        const result = await proveAction({
          contract: "token.iost",
          action_name: "transfer",
          data: bridge_prove_action.action.data,
              // '["iost","lispczz5","bifrost","1","5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY@bifrost:IOST"]',
      }, bridge_prove_action.trx_id, bridge_prove_action.block, bridge_prove_action.block_list)

        console.log(result);
        console.log("Calling bridge_prove_action end ------------- ");
        console.log(bridge_prove_action.block_list.length);
        bridge_prove_action.state = 2;

        // console.log(bridge_prove_action);
        // console.log(bridge_prove_action.block);
        // console.log(bridge_prove_action.block_list);
        // console.log(bridge_prove_action.trx_id);
      }
    }

    for (const bridge_change_schedule of bridge_change_schedule_index) {
      if (bridge_change_schedule.block_number == 0) {
        continue;
      }
      if (bridge_change_schedule.state == 0 && bridge_change_schedule_index.block_list.length < 108) {
        if (bridge_change_schedule.block_number < block_number) {
          bridge_change_schedule.block_list.push(parse_block(block.block.blockInfo));
        }
      }
      if (bridge_change_schedule.state == 0 && bridge_change_schedule_index.block_list.length >= 108) {
        bridge_change_schedule.state = 1;
      }
    }

    stateObj.indexState.blockNumber = block.block.blockInfo.blockNumber;
    stateObj.indexState.blockHash = block.block.blockInfo.blockHash;
    stateObj.indexState.isReplay = isReplay;
    stateObj.indexState.handlerVersionName = handlerVersionName;
  }

  async rollbackTo(blockNumber) {
    const latestBlockNumber = state.indexState.blockNumber;
    const toDelete = [...Array(latestBlockNumber - blockNumber).keys()].map(
      (n) => n + blockNumber + 1
    );
    for (const n of toDelete) {
      delete stateHistory[n];
    }
    state = stateHistory[blockNumber];
  }

  matchActionType(candidateType, subscribedType) {
    const [candidateContract, candidateAction] = candidateType.split("/");
    const [subscribedContract, subscribedAction] = subscribedType.split("/");
    const contractsMatch =
      candidateContract === subscribedContract || subscribedContract === "*";
    const actionsMatch =
      candidateAction === subscribedAction || subscribedAction === "*";
    return contractsMatch && actionsMatch;
  }
}

function parse_block(block) {
  let b = {
    version: Number(block.version),
    parent_hash: block.headParentHash,
    tx_merkle_hash: block.txMerkleHash,
    tx_receipt_merkle_hash: block.txReceiptMerkleHash,
    info: block.info,
    number: Number(block.blockNumber),
    witness: block.witness,
    time: block.timestamp,
    algorithm: Number(block.algorithm),
    sig: block.sig,
    pug_key: block.pubKey,
    hash: ''
  }
  // console.log(b)
  return b
}

module.exports = IostActionHandler;


const IOST_TYPES = {
  Address: "MultiAddress",
  LookupSource: "MultiAddress",
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
  BlockHead: {
      version: "i64",
      parent_hash: "Vec<u8>",
      tx_merkle_hash: "Vec<u8>",
      tx_receipt_merkle_hash: "Vec<u8>",
      info: "Vec<u8>",
      number: "i64",
      witness: "Vec<u8>",
      time: "i64",
      hash: "Vec<u8>",
      algorithm: "u8",
      sig: "Vec<u8>",
      pug_key: "Vec<u8>",
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
  RewardRecord: {
      account_id: "AccountId",
      record_amount: "Balance"
  },
  Token: {
      symbol: "Vec<u8>",
      precision: "u16",
      totalSupply: "u128"
  },
  VersionId: "u32",
  IostBlockNumber: "i64",
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
  PoolId: "u32",
  Nonce: "u32",
  PoolDetails: {
      "owner": "AccountId",
      "swap_fee_rate": "Fee",
      "active": "bool"
  },
  PoolCreateTokenDetails: {
      "token_id": "AssetId",
      "token_balance": "Balance",
      "token_weight": "PoolWeight"
  },
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
      description: "Prove action: verify block",
      params: [
          {
              name: "action",
              type: "IostAction",
          },
          {
              name: "trx_id",
              type: "Vec<u8>",
          },
          {
              name: "block_header",
              type: "BlockHead",
          },
          {
              name: "block_headers",
              type: "Vec<BlockHead>",
          },
      ],
      // type: "u128",
      isSubscription: false,
      jsonrpc: "bridgeIost_proveAction",
      method: "proveAction",
      section: "bridgeIost",
  },

  changeSchedule: {
      description: "Update epoll producer list",
      params: [
          {
              name: "bh",
              type: "BlockHead",
          },
          {
              name: "witness_headers",
              type: "Vec<BlockHead>",
          },
          {
              name: "producers",
              type: "Vec<Vec<u8>>",
          },
      ],
      // type: "u128",
      isSubscription: false,
      jsonrpc: "bridgeIost_changeSchedule",
      method: "changeSchedule",
      section: "bridgeIost",
  },


  initSchedule: {
      description: "Initial IOST producer list",
      params: [
          {
              name: "bn",
              type: "IostBlockNumber",
          },
          {
              name: "producers",
              type: "Vec<Vec<u8>>",
          },
          // {
      ],
      // type: "u128",
      isSubscription: false,
      jsonrpc: "bridgeIost_initSchedule",
      method: "initSchedule",
      section: "bridgeIost",
  }

};