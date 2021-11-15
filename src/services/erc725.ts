import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import Web3 from 'web3';
import { RPC_URL } from '../globals';

export const fetchErc725Data = async (erc725ContractAddress: string) => {
  // Part of LSP3-UniversalProfile Schema
  // https://github.com/lukso-network/LIPs/blob/master/LSPs/LSP-3-UniversalProfile.md
  const schema: ERC725JSONSchema[] = [
    {
      name: 'SupportedStandards:LSP3UniversalProfile',
      key: '0xeafec4d89fa9619884b6b89135626455000000000000000000000000abe425d6',
      keyType: 'Mapping',
      valueContent: '0xabe425d6',
      valueType: 'bytes',
    },
    {
      name: 'LSP3Profile',
      key: '0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5',
      keyType: 'Singleton',
      valueContent: 'JSONURL',
      valueType: 'bytes',
    },
    {
      name: 'LSP1UniversalReceiverDelegate',
      key: '0x0cfc51aec37c55a4d0b1a65c6255c4bf2fbdf6277f3cc0730c45b828b6db8b47',
      keyType: 'Singleton',
      valueContent: 'Address',
      valueType: 'address',
    },
  ];

  const provider = new Web3.providers.HttpProvider(RPC_URL);
  const config = {
    ipfsGateway: 'https://ipfs.lukso.network/ipfs/',
  };

  const erc725 = new ERC725(schema, erc725ContractAddress, provider, config);

  const data = await erc725.fetchData();

  console.log(data);

  return data;
};
