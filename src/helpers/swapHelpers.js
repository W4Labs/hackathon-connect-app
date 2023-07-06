export const spender1InchAddress = "0x1111111254eeb25477b68fb85ed929f73a960582";

function apiRequestUrl(methodName, queryParams, chainId) {
  const apiBaseUrl = "https://api.1inch.io/v5.0/" + chainId;
  return (
    apiBaseUrl + methodName + "?" + new URLSearchParams(queryParams).toString()
  );
}

async function broadCastRawTransaction(rawTransaction, chainId) {
  const broadcastApiUrl =
    "https://tx-gateway.1inch.io/v1.1/" + chainId + "/broadcast";

  return fetch(broadcastApiUrl, {
    method: "post",
    body: JSON.stringify({ rawTransaction }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((res) => {
      return res.transactionHash;
    });
}

export async function getAllowance(tokenAddress, walletAddress, chainId) {
  const url = apiRequestUrl(
    "/approve/allowance",
    {
      tokenAddress,
      walletAddress,
    },
    chainId
  );
  return fetch(url).then((res) => res.json());
}

export async function buildTxForApproveTradeWithRouter(
  tokenAddress,
  amount,
  chainId
) {
  const url = apiRequestUrl(
    "/approve/transaction",
    amount ? { tokenAddress, amount } : { tokenAddress },
    chainId
  );

  const transaction = await fetch(url).then((res) => res.json());

  return {
    ...transaction,
  };
}

export async function quote(fromTokenAddress, toTokenAddress, amount, chainId) {
  console.log("quote", fromTokenAddress, toTokenAddress, amount, chainId);
  const url = apiRequestUrl(
    "/quote",
    { fromTokenAddress, toTokenAddress, amount },
    chainId
  );

  return fetch(url).then((res) => res.json());
}
export async function get1InchSpender(chainId) {
  const url = apiRequestUrl("/approve/spender", {}, chainId);

  return fetch(url).then((res) => res.json());
}

export async function buildTxForSwap(
  walletAddress,
  fromTokenAddress,
  toTokenAddress,
  amount,
  slippage,
  chainId
) {
  const swapParams = {
    fromTokenAddress,
    toTokenAddress,
    amount,
    fromAddress: walletAddress,
    slippage,
  };
  const url = apiRequestUrl("/swap", swapParams, chainId);

  // Fetch the swap transaction details from the API
  return fetch(url)
    .then((res) => res.json())
    .then((res) => res.tx);
}
