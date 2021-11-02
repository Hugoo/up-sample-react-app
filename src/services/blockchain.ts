import Web3 from 'web3';

import UniversalProfile from '@lukso/universalprofile-smart-contracts/build/artifacts/UniversalProfile.json';
import KeyManager from '@lukso/universalprofile-smart-contracts/build/artifacts/KeyManager.json';

export const executeTransaction = async (web3: Web3, erc725Address: string) => {
  const myUP = new web3.eth.Contract(
    UniversalProfile.abi as any,
    erc725Address,
  );

  const keyManagerAddress = await myUP.methods.owner().call();

  console.log('UP owner address (KeyManager SC):', keyManagerAddress);

  // call the execute function on your UP (operation, to, value, calldata)
  const myKeyManager = new web3.eth.Contract(
    KeyManager.abi as any,
    keyManagerAddress,
  );

  const abi = myUP.methods
    .setData(
      ['0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5'], // LSP3Profile
      [
        '0x6f357c6ad6c04598b25d41b96fb88a8c8ec4f4c3de2dc9bdaab7e71f40ed012b84d0c126697066733a2f2f516d6262447348577a4d4d724538594345766e3342633254706756793176535736414d3946376168595642573874',
      ],
    )
    .encodeABI();

  // send your tx to the blockchain, from the controlling key address, through the key manager
  await myKeyManager.methods.execute(abi).send({
    from: web3.eth.accounts.wallet[0].address,
    gas: 200_000,
    gasPrice: web3.utils.toWei('20', 'gwei'),
  });
};
