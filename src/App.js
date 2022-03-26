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
import { injected, walletConnect } from "./constants";
import styled from "styled-components";
import Modal from "./component/modal";

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
  const [isOpenStakeModal, setIsOpenStakeModal] = useState(false);
  const [isOpenUnstakeModal, setIsOpenUnstakeModal] = useState(false);
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
      return Number(
        Web3.utils.fromWei(
          new BigNumber(
            convertToDecimal(
              results[key].callsReturnContext[0].returnValues[0].hex
            )
          ).toFixed(0)
        )
      ).toFixed(0);
    }

    return Number(
      Web3.utils.fromWei(
        convertToDecimal(
          results[key].callsReturnContext[0].returnValues[0].hex
        ).toString()
      )
    ).toFixed(2);
  };

  const stake = async (amount) => {
    await connectContract(MASTERCHEF_ABI, MASTERCHEF_ADDRESS)
      ?.methods.deposit(Web3.utils.toWei(amount.toString()))
      .send({ from: account });
    setIsOpenStakeModal(false);
    console.log("STAKE SUCCESS");
  };

  const unStake = async (amount) => {
    await connectContract(MASTERCHEF_ABI, MASTERCHEF_ADDRESS)
      ?.methods.withdraw(Web3.utils.toWei(amount.toString()))
      .send({ from: account });
    setIsOpenUnstakeModal(false);
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
      ?.methods.approve(MASTERCHEF_ADDRESS, Web3.utils.toWei('10'))
      .send({ from: account });
    console.log("APPROVE SUCCESS");
  };

  if (Web3) {
    var multicall = new Multicall({
      web3Instance: Web3,
      tryAggregate: true,
    });
  }
  const resultFunc = async () => {
    const { results } = await multicall.call(contractCallContext(account));
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
        <SWrapper>
          <SGroup>
            <SRow>
              <SColumnFlex>
                <SColumn>Account: </SColumn>
                <SAccount>{account}</SAccount>
              </SColumnFlex>
              <SColumn>Balance: {balanceWETH} WETH</SColumn>
            </SRow>
            <SRow>
              <SColumn>Token earned: {balanceDD2} DD2</SColumn>
              <SColumn>
                <SButtonHarvest onClick={harvest}>Harvest</SButtonHarvest>
              </SColumn>
            </SRow>
            <SRow>
              <SColumn>Allowance: {allowance} WETH</SColumn>
            </SRow>
            <SColumnCenter>
              {!(allowance > 0) ? (
                <>
                  <SButtonHarvest onClick={approve}>Approve</SButtonHarvest>
                </>
              ) : (
                <SColumnFlex>
                  <SButtonHarvest
                    onClick={() => {
                      setIsOpenStakeModal(true);
                    }}
                  >
                    Deposit
                  </SButtonHarvest>
                  <SButtonUnstake
                    onClick={() => {
                      setIsOpenUnstakeModal(true);
                    }}
                  >
                    Withdraw
                  </SButtonUnstake>
                </SColumnFlex>
              )}
            </SColumnCenter>
            <SRow>
              <SColumn>Your stake: {reward} WETH</SColumn>
            </SRow>
            <SRow>
              <SColumn>Amount staked: {balanceStaked} WETH</SColumn>
            </SRow>
            <SRow>
              <SColumn>Total stake: {balanceTotalStaked} WETH</SColumn>
            </SRow>
          </SGroup>
        </SWrapper>
      ) : (
        <SWrapper>
          <SButtonGr>
            <SButton onClick={handleClickConnectMetamask}>
              Connect Metamask
            </SButton>
            <SButtonWallet onClick={handleClickConnectWalletConnect}>
              Connect WalletConnect
            </SButtonWallet>
          </SButtonGr>
        </SWrapper>
      )}

      <Modal
        onClose={() => {
          setIsOpenStakeModal(false);
        }}
        open={isOpenStakeModal}
        title={"Stake"}
        balance={balanceWETH}
        onAction={stake}
      />

      <Modal
        onClose={() => {
          setIsOpenUnstakeModal(false);
        }}
        open={isOpenUnstakeModal}
        title={"Withdraw"}
        balance={allowance}
        onAction={unStake}
      />
    </div>
  );
}

export default App;

const SWrapper = styled.div`
  /* margin-top: 100px; */
  display: flex;
  justify-content: center;
  font-weight: 600;
`;

const SButtonGr = styled.div`
  margin-top: 100px;
  border: 2px solid black;
  padding: 50px;
  display: flex;
  flex-direction: column;
  min-width: 200px;
`;

const SButton = styled.button`
  padding: 20px;
  background: grey;
  color: #fff;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
`;

const SRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const SColumn = styled.div``;

const SButtonHarvest = styled(SButton)`
  padding: 5px;
  min-width: 50px;
  margin: 0px;
`;

const SGroup = styled.div`
  text-align: left;
  width: 500px;
  border: 2px solid black;
  padding: 20px;
  margin-top: 100px;
`;

const SAccount = styled.div`
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 10px;
`;

const SDiv = styled.div``;

const SColumnCenter = styled(SColumn)`
  display: flex;
  justify-content: center;
`;

const SColumnFlex = styled.div`
  display: flex;
`;

const SButtonWallet = styled(SButton)`
  margin-top: 20px;
`;

const SButtonUnstake = styled(SButtonHarvest)`
  margin-left: 10px;
`;
