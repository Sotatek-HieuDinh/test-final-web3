import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import DD2_ABI from "./abi/DD2.json";
import WETH_ABI from "./abi/WETH.json";
import MASTERCHEF_ABI from "./abi/MASTERCHEF.json";

export const WETH_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab";
export const DD2_ADDRESS = "0xb1745657cb84c370dd0db200a626d06b28cc5872";
export const MASTERCHEF_ADDRESS = "0x9da687e88b0A807e57f1913bCD31D56c49C872c2";
export const ACCOUNT_ADDRESS = "0x310Fd67BEEbf9FC4c14D6381bA33Aa3Eb8423818";
export const WALLET_CONNECT_URL = "https://bridge.walletconnect.org";

export const NETWORK_URLS = {
  4: "https://rinkeby.infura.io/v3/55a5b62cf76d4c2b9355518d33dc7739",
};

export const injected = new InjectedConnector({
  supportedChainIds: [4],
});

export const walletConnect = new WalletConnectConnector({
  supportedChainIds: [4],
  bridge: WALLET_CONNECT_URL,
  rpc: NETWORK_URLS,
  qrcode: true,
});

export const contractCallContext = (ACCOUNT_ADDRESS) => {
  return [
    {
      reference: "getBalanceWETH",
      contractAddress: WETH_ADDRESS,
      abi: WETH_ABI,
      calls: [
        {
          reference: "getBalanceWETH",
          methodName: "balanceOf",
          methodParameters: [ACCOUNT_ADDRESS],
        },
      ],
    },
    {
      reference: "getAllowance",
      contractAddress: WETH_ADDRESS,
      abi: WETH_ABI,
      calls: [
        {
          reference: "getAllowance",
          methodName: "allowance",
          methodParameters: [ACCOUNT_ADDRESS, MASTERCHEF_ADDRESS],
        },
      ],
    },
    {
      reference: "getBalanceDD2",
      contractAddress: DD2_ADDRESS,
      abi: DD2_ABI,
      calls: [
        {
          reference: "getBalanceDD2",
          methodName: "balanceOf",
          methodParameters: [ACCOUNT_ADDRESS],
        },
      ],
    },
    {
      reference: "getBalanceTotalStaked",
      contractAddress: DD2_ADDRESS,
      abi: DD2_ABI,
      calls: [
        {
          reference: "getBalanceDD2",
          methodName: "balanceOf",
          methodParameters: [MASTERCHEF_ADDRESS],
        },
      ],
    },
    {
      reference: "getReward",
      contractAddress: MASTERCHEF_ADDRESS,
      abi: MASTERCHEF_ABI,
      calls: [
        {
          reference: "getBalanceStake",
          methodName: "pendingDD2",
          methodParameters: [ACCOUNT_ADDRESS],
        },
      ],
    },
    {
      reference: "getBalanceStaked",
      contractAddress: MASTERCHEF_ADDRESS,
      abi: MASTERCHEF_ABI,
      calls: [
        {
          reference: "getBalanceDD2",
          methodName: "userInfo",
          methodParameters: [ACCOUNT_ADDRESS],
        },
      ],
    },
  ];
};

export const callFuncDefine = {
  getBalanceWETH: "getBalanceWETH",
  getAllowance: "getAllowance",
  getBalanceDD2: "getBalanceDD2",
  getBalanceTotalStaked: "getBalanceTotalStaked",
  getReward: "getReward",
  getBalanceStaked: "getBalanceStaked",
};
