import DD2_ABI from "../constants/abi/DD2.json";
import { WETH_ADDRESS, DD2_ADDRESS, MASTERCHEF_ADDRESS } from "../constants/index";
import WETH_ABI from "../constants/abi/WETH.json";
import MASTERCHEF_ABI from "../constants/abi/MASTERCHEF.json";


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
}

export const callFuncDefine = {
  getBalanceWETH: "getBalanceWETH",
  getAllowance: "getAllowance",
  getBalanceDD2: "getBalanceDD2",
  getBalanceTotalStaked: "getBalanceTotalStaked",
  getReward: "getReward",
  getBalanceStaked: "getBalanceStaked",
};
