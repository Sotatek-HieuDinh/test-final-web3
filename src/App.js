import "./App.css";

import { useWeb3React } from "@web3-react/core";
import WETH_ABI from "./constants/abi/WETH.json";
import MASTERCHEF_ABI from "./constants/abi/MASTERCHEF.json";
import { MASTERCHEF_ADDRESS, WETH_ADDRESS } from "./constants";
import { useEffect, useRef, useState } from "react";
import web3 from "web3";
import { Multicall } from "ethereum-multicall";
import BigNumber from "bignumber.js";
import { callFuncDefine, contractCallContext } from "./helper/getData";
import { injected, walletConnect } from './constants'


const convertToDecimal = (hex) => {
  return parseInt(hex, 16);
};

function App() {
  const { account, activate, library } = useWeb3React();
  const [balanceWETH, setBalanceWETH] = useState();
  const [balanceDD2, setBalanceDD2] = useState();
  const [reward, setReward] = useState();
  const [balanceTotalStaked, setBalanceTotalStaked] = useState();
  const [allowance, setAllowance] = useState("0");
  const [balanceStaked, setBalanceStaked] = useState();
  const interval = useRef();
  let Web3;
  if (library) {
    Web3 = new web3(library.provider);
  }

  const connectContract = (abi, address) => {
    if (Web3) {
      return new Web3.eth.Contract(abi, address);
    }
  };

  const handleClickConnectMetamask = () => {
    activate(injected, undefined, true).catch((e) => {
      console.log(e);
    });
  };

  const handleClickConnectWalletConnect = () => {
    activate(walletConnect, undefined, true).catch((e) => {
      console.log(e);
    });
  };

  const convertData = (key, results) => {
    if (key == "getBalanceTotalStaked") {
      return Web3.utils.fromWei(
        new BigNumber(
          convertToDecimal(
            results[key].callsReturnContext[0].returnValues[0].hex
          )
        ).toFixed(0)
      );
    }

    return Web3.utils.fromWei(
      convertToDecimal(
        results[key].callsReturnContext[0].returnValues[0].hex
      ).toString()
    );
  };

  const stake = async () => {
    await connectContract(MASTERCHEF_ABI, MASTERCHEF_ADDRESS)
      ?.methods.deposit(Web3.utils.toWei("0.1"))
      .send({ from: account });
    console.log("STAKE SUCCESS");
  };

  const unStake = async () => {
    await connectContract(MASTERCHEF_ABI, MASTERCHEF_ADDRESS)
      ?.methods.withdraw(Web3.utils.toWei("0.1"))
      .send({ from: account });
    console.log("UNSTAKE SUCCESS");
  };

  const harvest = async () => {
    await connectContract(MASTERCHEF_ABI, MASTERCHEF_ADDRESS)
      ?.methods.deposit("0")
      .send({ from: account });
    console.log("HARVEST SUCCESS");
  };

  const approve = async () => {
    await connectContract(WETH_ABI, WETH_ADDRESS)
      ?.methods.approve(MASTERCHEF_ADDRESS, Web3.utils.toWei("0.1"))
      .send({ from: account });
    console.log("APPROVE SUCCESS");
  };

  if(Web3){
    var multicall = new Multicall({
      web3Instance: Web3,
      tryAggregate: true,
    });
  }
  const resultFunc = async () => {
    const { results } = await multicall.call(contractCallContext);
    for (let i in results) {
      switch (i) {
        case callFuncDefine.getBalanceWETH: {
          setBalanceWETH(convertData(i, results));
          break;
        }
        case callFuncDefine.getAllowance: {
          setAllowance(convertData(i, results));
          break;
        }
        case callFuncDefine.getBalanceDD2: {
          setBalanceDD2(convertData(i, results));
          break;
        }
        case callFuncDefine.getBalanceStaked: {
          setBalanceStaked(convertData(i, results));
          break;
        }
        case callFuncDefine.getBalanceTotalStaked: {
          setBalanceTotalStaked(convertData(i, results));
          break;
        }
        case callFuncDefine.getReward: {
          setReward(convertData(i, results));
          break;
        }
        default: {
          console.log("default");
        }
      }
    }
  };

  const getStaticInfo = () => {
    resultFunc();
  };

  useEffect(() => {
    if (account) {
      interval.current = setInterval(() => {
        getStaticInfo();
        console.log("LOADED");
      }, 3000);
    }
    return () => {
      clearInterval(interval.current);
    };
  }, [account, balanceWETH, balanceDD2, reward, balanceTotalStaked]);

  return (
    <div className="App">
      {account ? (
        <>
          <h1>Account: {account}</h1>
          <h1>Balance: {balanceWETH} WETH</h1>
          <h1>Token earned: {balanceDD2} DD2</h1>
          <h1>Your stake: {reward} WETH</h1>
          <h1>Amount staked: {balanceStaked} WETH</h1>
          <h1>Allowance: {allowance} WETH</h1>
          <h1>Total stake: {balanceTotalStaked} WETH</h1>
          <button onClick={harvest}>HARVEST</button>
          {allowance === "0" ? (
            <>
              <button onClick={approve}>APPROVE</button>
            </>
          ) : (
            <>
              <button onClick={stake}>STAKE</button>
              <button onClick={unStake}>UNSTAKE</button>
            </>
          )}
        </>
      ) : (
        <>
          <button onClick={handleClickConnectMetamask}>Connect Metamask</button>
          <button onClick={handleClickConnectWalletConnect}>
            Connect WalletConnect
          </button>
        </>
      )}
    </div>
  );
}

export default App;
