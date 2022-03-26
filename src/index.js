import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const library = (provider, connector) => {
  return new Web3Provider(provider);
};

const Web3ReactProviderReloaded = createWeb3ReactRoot("NETWORK");

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={library}>
      <Web3ReactProviderReloaded getLibrary={library}>
        <App />
      </Web3ReactProviderReloaded>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
