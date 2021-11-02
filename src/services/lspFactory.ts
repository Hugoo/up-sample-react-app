import {
  DeploymentEvent,
  DeploymentStatus,
  DeploymentType,
  LSPFactory,
} from '@lukso/lsp-factory.js';
import Web3 from 'web3';
import { toast } from 'react-toastify';

import { CHAIN_ID, RPC_URL } from '../globals';

export const deployUp = async (web3: Web3, controllerAddress: string) => {
  const deployKey = web3.eth.accounts.wallet[0].privateKey; // Private key of the account which will deploy UPs
  const provider = RPC_URL; // RPC url used to connect to the network
  const chainId = CHAIN_ID; // Chain Id of the network you want to connect to

  const lspFactory = new LSPFactory(provider, {
    deployKey,
    chainId,
  });

  console.log('🚀 Deploying LSP3UniversalProfile contract...');
  const deployedContracts = await lspFactory.LSP3UniversalProfile.deploy({
    controllingAccounts: [controllerAddress], // our key will be controlling our UP in the beginning
    lsp3Profile: {
      name: 'My Universal Profile',
      description: 'My Cool Universal Profile',
      //   profileImage: [fileBlob], // got some Image uploaded?
      backgroundImage: [],
      tags: ['Public Profile'],
      links: [
        {
          title: 'My Website',
          url: 'http://my-website.com',
        },
      ],
    },
  });

  console.log(`✅ Deployment and configuration successful`);
  console.log('Contracts:', deployedContracts);

  return deployedContracts.ERC725Account.address;
};

export const deployUpReactive = async (
  web3: Web3,
  controllerAddress: string,
  callback: (erc725ContractAddress: string) => void,
) => {
  const deployKey = web3.eth.accounts.wallet[0].privateKey;
  const provider = RPC_URL;
  const chainId = CHAIN_ID;

  const lspFactory = new LSPFactory(provider, {
    deployKey,
    chainId,
  });

  console.log('🚀 [reactive] Deploying LSP3UniversalProfile contract...');

  let erc725ContractAddress: string;
  lspFactory.LSP3UniversalProfile.deployReactive({
    controllingAccounts: [controllerAddress],
    lsp3Profile: {
      name: 'My Universal Profile',
      description: 'My Cool Universal Profile',
      backgroundImage: [],
      tags: ['Public Profile'],
      links: [
        {
          title: 'My Website',
          url: 'http://my-website.com',
        },
      ],
    },
  }).subscribe({
    next: (deploymentEvent: DeploymentEvent) => {
      console.log(deploymentEvent);

      let toastMessage = '';

      if (deploymentEvent.type === DeploymentType.TRANSACTION) {
        toastMessage = `${deploymentEvent.contractName}: ${deploymentEvent.functionName} ${deploymentEvent.status}`;
      } else {
        toastMessage = `${deploymentEvent.contractName}: ${deploymentEvent.status}`;
      }

      switch (deploymentEvent.status) {
        case DeploymentStatus.COMPLETE: {
          toast.success(toastMessage);
          break;
        }
        default: {
          toast.info(toastMessage);
          break;
        }
      }

      if (
        deploymentEvent.type === DeploymentType.PROXY &&
        deploymentEvent.status === DeploymentStatus.PENDING &&
        deploymentEvent.contractName === 'ERC725Account' &&
        deploymentEvent.receipt
      ) {
        erc725ContractAddress = deploymentEvent.receipt.contractAddress;
      }
    },
    complete: () => {
      toast.success('Deployment successful');
      callback(erc725ContractAddress);
    },
  });
};
