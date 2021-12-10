import Web3 from 'web3';

export const setDataTransaction = async (web3: Web3, from: string) => {
  if (!web3) {
    alert('not connected');
    return;
  }

  let erc725yContract = new web3.eth.Contract([
    {
      inputs: [
        {
          internalType: 'bytes32[]',
          name: '_keys',
          type: 'bytes32[]',
        },
        {
          internalType: 'bytes[]',
          name: '_values',
          type: 'bytes[]',
        },
      ],
      name: 'setData',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]);

  const data = erc725yContract.methods
    .setData(
      ['0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5'],
      [
        '0x6f357c6a70546a2accab18748420b63c63b5af4cf710848ae83afc0c51dd8ad17fb5e8b3697066733a2f2f516d65637247656a555156587057347a53393438704e76636e51724a314b69416f4d36626466725663575a736e35',
      ],
    )
    .encodeABI();

  return web3.eth
    .sendTransaction({
      from,
      to: '0x23a86EF830708204646abFE631cA1a60d04c4FbE',
      data,
    })
    .once('sending', (payload) => {
      console.log(JSON.stringify(payload, null, 2));
      //   setPayload(JSON.stringify(payload, null, 2));
    });
};
