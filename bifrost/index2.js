/* eslint-disable header/header */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/unbound-method */

// import {
//   web3Accounts,
//   web3Enable,
//   web3FromAddress,
//   web3ListRpcProviders,
//   web3UseRpcProvider
// } from '@polkadot/extension-dapp';

// Required imports
const { ApiPromise } = require('@polkadot/api');
const { WsProvider } = require('@polkadot/rpc-provider');
const { Keyring } = require('@polkadot/keyring');
const { options } = require('@bifrost-finance/api');
const { stringToU8a } = require('@polkadot/util');


async function main() {
  const provider = new WsProvider('ws://127.0.0.1:9944');
  const api = await new ApiPromise(options({ provider }));

  await api.isReady;

  const SENDER = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

  const keyring = new Keyring({ type: 'sr25519' });
  // const keyring = new Keyring({ type: 'ed25519' });
  const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });

  console.log(`${alice.meta.name}: has address ${alice.address} with publicKey [${alice.publicKey}]`);

  let action = {
    contract: stringToU8a('iost'),
    action_name: stringToU8a('transfer'),
    data: stringToU8a('[\"iost\",\"lispczz5\",\"bifrost\",\"1\",\"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY@bifrost:IOST\"]')
  };

  console.log(action.contract);

  const result = await api.tx.bridgeIost.proveAction(action)
    .signAndSend(alice);
  console.log(result.toString());

}

main().catch(console.error).finally(() => process.exit());
