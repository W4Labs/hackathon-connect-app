import {
  useAccount,
  useNetwork,
  usePrepareSendTransaction,
  usePublicClient,
  useSendTransaction,
  useToken,
  useWaitForTransaction,
} from "wagmi";
import { formatUnits, hexToBigInt, parseEther, parseUnits } from "viem";
import { useEffect } from "react";
import * as React from "react";
import "../App.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Web3Button } from "@web3modal/react";
import {
  getAllowance,
  buildTxForApproveTradeWithRouter,
  buildTxForSwap,
  quote,
} from "../helpers/swapHelpers";

const tele = window.Telegram.WebApp;

export function SwapTokenPage() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const navigate = useNavigate();
  useEffect(() => {
    tele.ready();
    tele.expand();
  });
  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  });
  const [allowance, setAllowance] = React.useState(0);
  const [needApprove, setNeedApprove] = React.useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(false);

  const [outputAmount, setOutputAmount] = React.useState(0);
  const [fromLogoUri, setFromLogoUri] = React.useState(null);
  const [toLogoUri, setToLogoUri] = React.useState(null);

  // const [fromTokenAddress, setFromTokenAddress] = React.useState(
  //   searchParams.get("fromTokenAddress") || ""
  // );
  const fromTokenAddress = searchParams.get("fromTokenAddress") || "";
  // const [toTokenAddress, setToTokenAddress] = React.useState(
  //   searchParams.get("toTokenAddress") || ""
  // );
  const toTokenAddress = searchParams.get("toTokenAddress") || "";
  // const [amount, setAmount] = React.useState(searchParams.get("amount") || "");
  const amount = searchParams.get("amount") || "";

  const [slippage, setSlippage] = React.useState(
    searchParams.get("slippage") || 0.5
  );

  const {
    data: toTokenData,
    isError: toTokenError,
    error: errorToToken,
  } = useToken({
    address: toTokenAddress,
    chainId: chain?.id,
  });
  console.log("errorToToken", errorToToken);

  const {
    data: fromTokenData,
    isError: fromTokenError,
    error: errorFromToken,
  } = useToken({
    address: fromTokenAddress,
    chainId: chain?.id,
  });
  console.log("errorFromToken", errorFromToken);

  async function getUserAllowance() {
    const { allowance } = await getAllowance(
      fromTokenAddress,
      address,
      chain?.id
    );
    setAllowance(allowance);
  }

  useEffect(() => {
    getUserAllowance();
  }, [address]);
  useEffect(() => {
    const amountBN = parseUnits(amount, fromTokenData?.decimals);
    const allowanceBN = parseUnits(allowance, fromTokenData?.decimals);
    if (allowanceBN > amountBN) {
      setNeedApprove(false);
    }
  }, [amount, allowance]);

  const [approveTx, setApproveTx] = React.useState(null);
  const [swapTx, setSwapTx] = React.useState(null);
  const [isLoadingApprove, setIsLoadingApprove] = React.useState(false);
  // const [isLoadingSwap, setIsLoadingSwap] = React.useState(false);

  const { config: configApprove } = usePrepareSendTransaction({
    to: approveTx?.to,
    data: approveTx?.data,
    gasPrice: approveTx?.gasPrice,
    value: approveTx?.value,
    onSuccess(data) {},
    onError(error) {},
  });

  const { sendTransaction: sendApproveTx } = useSendTransaction(configApprove);

  async function runApprove() {
    const maxUint256 = hexToBigInt(
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    );
    try {
      const tx = await buildTxForApproveTradeWithRouter(
        fromTokenAddress,
        maxUint256,
        chain?.id
      );
      setApproveTx(tx);
    } catch (error) {}
  }

  const { config: configSwap } = usePrepareSendTransaction({
    to: swapTx?.to,
    data: swapTx?.data,
    gasPrice: swapTx?.gasPrice,
    value: swapTx?.value,
    onSuccess(data) {},
    onError(error) {},
  });

  const { data: swapData, sendTransaction: sendSwapTx } =
    useSendTransaction(configSwap);

  const {
    data: swapWaitData,
    isLoading: swapLoadingTx,
    isSuccess: swapSuccess,
  } = useWaitForTransaction(swapData);
  async function runSwap() {
    try {
      const tx = await buildTxForSwap(
        address,
        fromTokenAddress,
        toTokenAddress,
        parseUnits(amount, fromTokenData?.decimals),
        slippage,
        chain?.id
      );
      setSwapTx(tx);
    } catch (error) {}
  }

  async function getQuote() {
    const amountBN = parseUnits(amount, fromTokenData?.decimals);

    const res = await quote(
      fromTokenAddress,
      toTokenAddress,
      amountBN,
      chain?.id
    );
    const outputAmount = formatUnits(res?.toTokenAmount, res?.toToken.decimals);
    setOutputAmount(outputAmount);
    setFromLogoUri(res?.fromToken.logoURI);
    setToLogoUri(res?.toToken.logoURI);
  }

  useEffect(() => {
    getQuote();
    runApprove();
    runSwap();
  }, []);

  ///!todo: change after finished
  const data = { hash: swapWaitData?.transactionHash };
  ///

  if (swapSuccess) {
    tele.MainButton.setText("Finish")
      .show()
      .onClick(function () {
        const set_hash = data?.hash;
        const dataToBot = JSON.stringify({ hash_result: set_hash });
        tele.sendData(dataToBot);
        tele.close();
      });
  }

  return (
    <div className="divCentered">
      <p className="textWrapper">
        From: {amount} {fromTokenData?.symbol}
        {fromLogoUri && (
          <img src={fromLogoUri} alt="logo" className="tokenLogo" />
        )}
      </p>
      <p className="textWrapper">
        To: {outputAmount} {toTokenData?.symbol}
        {toLogoUri && <img src={toLogoUri} alt="logo" className="tokenLogo" />}
      </p>
      <div className="divCentered">
        {needApprove && (
          <button
            className="App-send-Button"
            disabled={!amount || !toTokenAddress || !fromTokenAddress}
            onClick={async () => {
              try {
                setIsLoadingApprove(true);
                sendApproveTx?.();
                setIsLoadingApprove(false);
              } catch (error) {
                setIsLoadingApprove(false);
              }
            }}
          >
            {isLoadingApprove ? "Approving" : "Approve"}
          </button>
        )}
        {!needApprove && (
          <button
            className="App-send-Button"
            disabled={!amount || !toTokenAddress || !fromTokenAddress}
            onClick={async () => {
              try {
                sendSwapTx?.();
              } catch (error) {}
            }}
          >
            {swapLoadingTx ? "Swapping" : "Swap"}
          </button>
        )}
      </div>
      <Web3Button />
      {swapSuccess && (
        <div className="textWrapper">
          Successfully swapped {amount} {fromTokenData?.symbol} to{" "}
          {outputAmount} {toTokenData?.symbol} {toTokenData?.symbol}
          {chain?.id === 1 && (
            <div>
              <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
            </div>
          )}
          {chain?.id === 42161 && (
            <div>
              <a href={`https://arbiscan.io/tx/${data?.hash}`}>Arbiscan</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
