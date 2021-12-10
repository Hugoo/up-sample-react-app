import WalletConnectProvider from '@walletconnect/web3-provider';
import React, { useState } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { setDataTransaction } from '../../services/transactions';

const Transaction: React.FC = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [account, setAccount] = useState<string | undefined>();
  const [payload, setPayload] = useState<string>();

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
    setWeb3(web3);

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    provider.on('connect', (info: { chainId: number }) => {
      console.log(info);
    });

    provider.on('accountsChanged', (accounts: string[]) => {
      console.log(accounts);
      setAccount(accounts[0]);
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

    const weiValue = web3.utils.toWei('1', 'ether');
    return await web3.eth
      .sendTransaction({
        from: account,
        to: '0x23a86EF830708204646abFE631cA1a60d04c4FbE',
        value: weiValue,
      })
      .once('sending', (payload) => {
        console.log(payload);
        setPayload(JSON.stringify(payload, null, 2));
      });
  };

  const setData = async () => {
    if (!web3 || !account) {
      alert('not connected');
      return;
    }

    await setDataTransaction(web3, account);
  };

  return (
    <div>
      <h1>🆙 Sample React App - Transaction</h1>
      <p>Lets send tx !</p>
      <p>
        <button onClick={account ? disconnectWallet : connectWallet}>
          {account ? `Connected: ${account}` : 'Connect'}
        </button>
      </p>
      <button onClick={sendLyx}>Send LYX</button>
      <button onClick={setData}>Set data</button>
      <pre>{payload}</pre>
    </div>
  );
};

export default Transaction;
