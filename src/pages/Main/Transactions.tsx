import WalletConnectProvider from '@walletconnect/web3-provider';
import React, { useState } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { web3Constants } from '../../constants';
import { defaultFunctions } from '../../contracts/abi';

const Transaction: React.FC = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [account, setAccount] = useState<string | undefined>();
  const [payload, setPayload] = useState<string>();

  const lyxAmount = '0.1';

  const providerOptions = {
    walletconnect: {
      display: {
        name: 'Mobile',
      },
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: 'https://bsc-dataseed.binance.org/',
        },
        network: 'binance',
        chainId: 56,
      },
    },
  };

  const web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: false, // optional
    providerOptions, // required
  });

  const connectWallet = async () => {
    const provider = await web3Modal.connect();

    const web3 = new Web3(provider);
    window.web3 = provider;

    console.log('provider', provider);

    setWeb3(web3);

    try {
      // This will only work for MetaMask atm
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x16',
            chainName: 'LUKSO L14',
            nativeCurrency: {
              name: 'LUKSO',
              symbol: 'LYX',
              decimals: 18,
            },
            rpcUrls: ['https://rpc.l14.lukso.network'],
            blockExplorerUrls: ['https://blockscout.com/lukso/l14'],
          },
        ],
      });
    } catch (err) {
      console.error('Could not set chain in the extension');
    }

    // ethereum.request({method: 'eth_accounts'}) -> good one
    // ethereum.request({method: 'eth_requestAccounts'}) -> standard

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    provider.on('connect', (info: { chainId: number }) => {
      console.log(info);
    });

    provider.on('accountsChanged', (accounts: string[]) => {
      console.log(accounts);
      setAccount(accounts[0]);
    });

    // Subscribe to chainId change
    provider.on('chainChanged', (chainId: number) => {
      console.log(chainId);
    });
  };

  const disconnectWallet = () => {
    setAccount(undefined);
    setPayload('');
    web3Modal.clearCachedProvider();
  };

  const sendLyx = async () => {
    if (!web3) {
      alert('not connected');
      return;
    }

    const weiValue = web3.utils.toWei(lyxAmount, 'ether');
    return await web3.eth
      .sendTransaction({
        from: account,
        to: '0x23a86EF830708204646abFE631cA1a60d04c4FbE',
        value: weiValue,
        gasPrice: web3Constants.gasPrice,
        // chainId: web3Constants.chainId,
      })
      .once('sending', (payload) => {
        console.log(payload);
        setPayload(JSON.stringify(payload, null, 2));
      });
  };

  const setData = async () => {
    if (!web3) {
      alert('not connected');
      return;
    }

    let erc725yContract = new web3.eth.Contract([defaultFunctions.setData]);

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
        from: account,
        to: '0x23a86EF830708204646abFE631cA1a60d04c4FbE',
        data,
      })
      .once('sending', (payload) => {
        console.log(JSON.stringify(payload, null, 2));
        setPayload(JSON.stringify(payload, null, 2));
      });
  };

  const setDataPermissions = async () => {
    // TODO
  };

  return (
    <div>
      <h1>🆙 Sample React App - Transaction</h1>
      <p>Lets send tx !</p>
      <p>
        <button onClick={account ? disconnectWallet : connectWallet}>
          {account ? `Connected: ${account}` : 'Connect'}
        </button>{' '}
        - Note: the extension SHOULD inject the UP SC address - not an EOA
        address.
      </p>
      <button onClick={sendLyx}>Send {lyxAmount} LYX</button>{' '}
      <button onClick={setData}>Set data</button>{' '}
      <button onClick={setDataPermissions}>Set data [permissions]</button>
      <pre>{payload}</pre>
    </div>
  );
};

export default Transaction;
