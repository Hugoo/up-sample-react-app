import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

import useWeb3 from '../../hooks/useWeb3';
import { getAccount, getAccountBalance } from '../../services/blockchain';
import { fetchErc725Data } from '../../services/erc725';
import { deployUp, deployUpReactive } from '../../services/lspFactory';

enum STEP {
  CREATE_ACCOUNT,
  FUND_ACCOUNT,
  DEPLOY_UP,
  FETCH_DATA,
  DONE,
}

const Main: React.FC = () => {
  const [accountAddress, setAccountAddress] = useState('');
  const [isConfettiRunning, setIsConfettiRunning] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const [erc725ContractAddress, setErc725ContractAddress] = useState('');
  const [isDeployingUp, setIsDeployingUp] = useState(false);
  const [erc725Data, setErc725Data] = useState({});
  const [step, setStep] = useState(STEP.CREATE_ACCOUNT);

  const web3 = useWeb3();

  useEffect(() => {
    if (!accountAddress || !web3) return;

    getAccountBalance(web3, accountAddress).then((balance) => {
      setAccountBalance(balance);
      if (balance > 0) {
        setStep(STEP.DEPLOY_UP);
      }
    });
  }, [accountAddress, web3]);

  useEffect(() => {
    if (step === STEP.DONE) {
      setIsConfettiRunning(true);
    }
  }, [step]);

  useEffect(() => {
    if (!erc725ContractAddress) return;
    setStep(STEP.FETCH_DATA);
  }, [erc725ContractAddress]);

  if (!web3) {
    return <div>'Loading web3'</div>;
  }

  return (
    <div>
      <Confetti run={isConfettiRunning} numberOfPieces={50} />
      <h1>🆙 UP Sample React App</h1>
      <p>
        This is a sample repo for the{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://docs.lukso.tech/tools/getting-started"
        >
          Getting Started
        </a>{' '}
        tutorial.
        <br />
        Let's deploy a Universal Profile, configure it and interact with it.
        <br />
        It is recommanded to open the developer console to check the logs.
      </p>
      <h2>1. {accountAddress && '✅'} 🔑 Create/Get account</h2>
      {accountAddress ? (
        <p>
          Account (EOA) loaded:{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://blockscout.com/lukso/l14/address/${accountAddress}`}
          >
            {accountAddress}
          </a>
        </p>
      ) : (
        <p>
          <button
            onClick={async () => {
              const account = await getAccount(web3);
              setAccountAddress(account);
              setStep(STEP.FUND_ACCOUNT);
            }}
          >
            Get/create account
          </button>
        </p>
      )}
      {step >= STEP.FUND_ACCOUNT && (
        <>
          <h2>2. {accountBalance > 0 && '✅'} 💰 Fund account</h2>
          <p>
            Account balance is: <strong>{accountBalance} LYXt</strong>{' '}
            <button
              onClick={async () => {
                if (!accountAddress) return;
                const accountBalance = await getAccountBalance(
                  web3,
                  accountAddress,
                );
                setAccountBalance(accountBalance);
                if (accountBalance > 0) {
                  setStep(STEP.DEPLOY_UP);
                }
              }}
            >
              Refresh balance
            </button>
            <br />
            <a
              href="http://faucet.l14.lukso.network/"
              target="_blank"
              rel="noreferrer"
            >
              Use Faucet to fund account
            </a>
          </p>
        </>
      )}
      <br />
      {step >= STEP.DEPLOY_UP && (
        <>
          <h2>
            3. {erc725ContractAddress && '✅'} 🚀 Deploy LSP3 UP Smart contract
            with lsp-factory.js
          </h2>
          <p>
            With{' '}
            <a
              href="https://docs.lukso.tech/tools/lsp-factoryjs/getting-started"
              target="_blank"
              rel="noreferrer"
            >
              lsp-factory.js
            </a>
            , we can simply deploy and configure a Universal Profile smart
            contract:
          </p>
          <button
            onClick={async () => {
              setIsDeployingUp(true);
              const erc725ContractAddress = await deployUp(
                web3,
                accountAddress,
              );
              setErc725ContractAddress(erc725ContractAddress);
              setIsDeployingUp(false);
            }}
          >
            Deploy LSP3 UP contract
          </button>{' '}
          <button
            onClick={async () => {
              setIsDeployingUp(true);
              setErc725ContractAddress('');
              deployUpReactive(
                web3,
                accountAddress,
                (erc725ContractAddress) => {
                  setErc725ContractAddress(erc725ContractAddress);
                  setIsDeployingUp(false);
                },
              );
            }}
          >
            Deploy LSP3 UP contract [reactive mode]
          </button>
          {isDeployingUp && (
            <p>
              🔄 Deploying contracts, it can take up to 2 minutes...
              <br />
              💡 You can monitor the contracts deployments/setup on{' '}
              <a
                href={`https://blockscout.com/lukso/l14/address/${accountAddress}/transactions`}
                target="_blank"
                rel="noreferrer"
              >
                Blocksout
              </a>
              .
            </p>
          )}
          {erc725ContractAddress && (
            <p>
              ERC725ContractAddress deployed:{' '}
              <a
                href={`https://universalprofile.cloud/${erc725ContractAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                {erc725ContractAddress}
              </a>{' '}
              [
              <a
                href={`https://blockscout.com/lukso/l14/address/${erc725ContractAddress}/transactions`}
                target="_blank"
                rel="noreferrer"
              >
                blockscout
              </a>
              ] [
              <a
                href={`https://erc725-inspect.lukso.tech/?address=${erc725ContractAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                inspect
              </a>
              ]
            </p>
          )}
        </>
      )}
      {step >= STEP.FETCH_DATA && (
        <>
          <h2>
            4. {Object.keys(erc725Data).length > 0 && '✅'} 🔄 Fetch contract
            data with erc725.js
          </h2>
          <p>
            <a
              href="https://docs.lukso.tech/tools/erc725js/getting-started"
              target="_blank"
              rel="noreferrer"
            >
              erc725.js
            </a>{' '}
            makes it easy to fetch and decode an ERC725Y smart contract
            keys/values.
          </p>
          <button
            onClick={async () => {
              const data = await fetchErc725Data(erc725ContractAddress);
              setErc725Data(data);
              if (data !== {}) {
                setStep(STEP.DONE);
              }
            }}
          >
            Fetch ERC725 keys/values
          </button>
          {Object.keys(erc725Data).length > 0 && (
            <pre>{JSON.stringify(erc725Data, null, 2)}</pre>
          )}
        </>
      )}
      {step >= STEP.DONE && <h2>Congratulations 🎉🥳</h2>}
    </div>
  );
};

export default Main;
