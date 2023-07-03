import { useEffect } from "react";
import {
  useAccount,
  useToken,
  useWalletClient,
  erc20ABI,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
} from "wagmi";
import { parseUnits } from "viem";
import * as React from "react";
import "../App.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Web3Button } from "@web3modal/react";
import {
  AaveArbitrumPoolAddress,
  AaveMainnetPoolAddress,
} from "../helpers/ContractAddresses";
import { AavePoolABI } from "../abis/AavePoolABI";
import {
  getProposals,
  getSingleProposal,
  getSpace,
  voteProposal,
} from "../helpers/snapshotHelpers";

export default function SnapshotVote() {
  const [searchParams] = useSearchParams();

  const supplyTokenAddress = searchParams.get("supplyTokenAddress") || "";
  // const spaceId = searchParams.get("spaceId");
  const proposalId = searchParams.get("proposalId");

  const amount = searchParams.get("amount") || "";
  const { data: signer } = useWalletClient();
  const { address, isConnected } = useAccount();

  const [supplyCompleted, setSupplyCompleted] = React.useState(false);
  const [supplyAaveHash, setSupplyAaveHash] = React.useState(null);

  const { data: supplyToken } = useToken({ address: supplyTokenAddress });
  const { chain } = useNetwork();

  const [proposalTitle, setProposalTitle] = React.useState(null);
  const [proposalBody, setProposalBody] = React.useState(null);
  const [proposalChoices, setProposalChoices] = React.useState([]);
  const [spaceId, setSpaceId] = React.useState(null);
  const [voteChoice, setVoteChoice] = React.useState(null);

  useEffect(() => {
    const fetchSpace = async () => {
      const singleProposal = await getSingleProposal(proposalId);
      console.log("Single Proposal: ", singleProposal);
      setProposalTitle(singleProposal.title);
      setProposalBody(singleProposal.body);
      setProposalChoices(singleProposal.choices);
      setSpaceId(singleProposal.space.id);
    };
    fetchSpace();
  }, []);

  const [poolAddress, setPoolAddress] = React.useState(null);
  useEffect(() => {
    if (chain?.id === 1) {
      setPoolAddress(AaveMainnetPoolAddress);
    } else if (chain?.id === 42161) {
      setPoolAddress(AaveArbitrumPoolAddress);
    }
  }, [chain]);

  const { data: supplyTokenAllowance } = useContractRead({
    address: supplyTokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address, poolAddress],
  });

  const weiSupplyTokenAmount = parseUnits(amount, supplyToken?.decimals || 18);

  const needApprove = supplyTokenAllowance < weiSupplyTokenAmount;

  // supplyAave(address, signer);
  const maxUint256 =
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
  const { config: approveAaveConfig } = usePrepareContractWrite({
    address: supplyTokenAddress,
    abi: erc20ABI,
    functionName: "approve",
    args: [poolAddress, maxUint256],
  });

  const { write: approveAave } = useContractWrite(approveAaveConfig);

  //function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external
  const { config: supplyAaveConfig } = usePrepareContractWrite({
    address: poolAddress,
    abi: AavePoolABI,
    functionName: "supply",
    args: [supplyTokenAddress, weiSupplyTokenAmount, address, 0],
  });

  const { write: supplyAave } = useContractWrite({
    ...supplyAaveConfig,
    onSuccess: (data) => {
      onSuppliedSuccess(data);
      console.log(data);
    },
  });

  useEffect(() => {
    if (!signer) return;
    // supplyAave(address, signer);
  }, [address, signer]);

  const onSuppliedSuccess = (data) => {
    console.log("Success supply to AAVE");
    setSupplyCompleted(true);
    setSupplyAaveHash(data);
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  });
  if (isConnected && proposalId) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="divCentered">
            {proposalTitle && (
              <div>
                <h2 className="textWrapper">Proposal: {proposalTitle}</h2>
              </div>
            )}
            {proposalBody && <div className="textWrapper">{proposalBody}</div>}
            {/* make choices in seletable */}
            {/* spacer */}
            <div>
              {proposalChoices.map((choice, index) => {
                return (
                  <div>
                    <input
                      type="radio"
                      id={choice}
                      name="proposal"
                      value={choice}
                      onClick={() => {
                        console.log("clicked", choice, index);
                        setVoteChoice(index + 1); //snapshot votes start at 1, not 0
                      }}
                    />
                    {choice}
                  </div>
                );
              })}
            </div>

            <div className="divCentered">
              <button
                className="App-send-Button"
                // disabled={!amount || !toTokenAddress || !fromTokenAddress}
                onClick={async () => {
                  if (voteChoice === null) {
                    alert("Please select a choice");
                    return;
                  } else {
                    await voteProposal(proposalId, voteChoice, spaceId, signer);
                  }
                }}
              >
                Vote
              </button>
            </div>
            <Web3Button />
          </div>
        </header>
      </div>
    );
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <div className="divCentered">
            <h2 className="textWrapper">No proposal ID found</h2>
          </div>
        </header>
      </div>
    );
  }
}
