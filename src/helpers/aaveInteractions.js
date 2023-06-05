import { ethers } from "ethers";

export async function supplyAave(userAddress, signer) {
  const aaveContract = new ethers.Contract(
    "0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B",
    aaveInterface,
    signer
  );
  console.log(aaveContract);
  const tx = await aaveContract.deposit(
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    ethers.utils.parseEther("0.1"),
    userAddress,
    0
  );
  console.log(tx);
}

const aaveInterface = new ethers.utils.Interface([
  "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external",
  "function withdraw(address asset, uint256 amount, address to) external returns (uint256)",
  "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external",
  "function repay(address asset, uint256 amount, uint256 rateMode, address onBehalfOf) external returns (uint256)",
]);
