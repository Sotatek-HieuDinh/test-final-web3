import { useState } from "react";
import styled from "styled-components";

const Modal = ({
  open,
  title,
  onAction,
  balance,
  onClose,
  isStake = false,
}) => {
  const [amount, setAmount] = useState("");
  return (
    <>
      {open && (
        <>
          <SWrapper>
            <SDivFlex>
              <STitle>{title}</STitle>
              <SDiv onClick={onClose}>X</SDiv>
            </SDivFlex>
            <SInput
              placeholder="Input your amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />

            {isStake ? (
              <SBalance>Your WETH balances: {balance} WETH</SBalance>
            ) : (
              <SBalance>Your WETH deposited: {balance} WETH</SBalance>
            )}

            <SButton
              onClick={() => {
                onAction(amount);
              }}
            >
              {title}
            </SButton>
          </SWrapper>
          <SGrayBackround />
        </>
      )}
    </>
  );
};

export default Modal;

const SGrayBackround = styled.div`
  opacity: 0.8;
  background: #e6dddc;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const SWrapper = styled.div`
  font-weight: 600;
  transform: translate(-50%, -50%);
  position: fixed;
  top: 50%;
  left: 50%;
  border: 2px solid black;
  padding: 20px 100px;
  z-index: 100;
  background: #fff;
`;

const STitle = styled.div`
  font-size: 20px;
`;

const SInput = styled.input`
  margin-top: 20px;
  padding: 5px 10px;
`;

const SBalance = styled.div`
  margin-top: 20px;
`;

const SButton = styled.button`
  padding: 10px;
  min-width: 100px;
  margin-top: 20px;
`;

const SDivFlex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SDiv = styled.div`
  cursor: pointer;
`;
