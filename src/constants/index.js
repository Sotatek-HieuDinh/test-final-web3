import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

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
