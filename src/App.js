import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, mainnet } from "wagmi/chains";

import ConnectHomePage from "./pages/ConnectHomePage";
import SendPage from "./pages/SendPage";
import SwapPage from "./pages/SwapPage";
import "./App.css";
// Import PROJECT_ID from constants.js
import { PROJECT_ID } from "./constants";
import AaveSupply from "./pages/AaveSupply";
import AaveWithdraw from "./pages/AaveWithdraw";
import AaveBorrow from "./pages/AaveBorrow";
import AaveRepay from "./pages/AaveRepay";

const CHAINS = [mainnet, arbitrum];
//const PROJECT_ID = process.env.PROJECT_ID;
console.log("Project id: ", PROJECT_ID);

const { publicClient } = configureChains(CHAINS, [
  w3mProvider({ projectId: PROJECT_ID }),
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  // connectors: [
  //   // new MetaMaskConnector({ CHAINS }),
  //   new WalletConnectConnector({
  //     CHAINS,
  //     options: {
  //       projectId: PROJECT_ID,
  //     },
  //   }),
  // ],
  connectors:
    // new InjectedConnector({ CHAINS }),
    w3mConnectors({
      projectId: PROJECT_ID,
      version: 1,
      chains: CHAINS,
      rpc: {
        1: "https://eth-mainnet.g.alchemy.com/v2/yxRnRAhclYIAxN3DVf_KwaYa3oA1_y-n",
      },
    }),
  publicClient,
});

// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors:
//     // new InjectedConnector({ CHAINS }),
//     w3mConnectors({
//       projectId: PROJECT_ID,
//       version: 1,
//       chains: CHAINS,
//       rpc: {
//         1: "https://eth-mainnet.g.alchemy.com/v2/yxRnRAhclYIAxN3DVf_KwaYa3oA1_y-n",
//       },
//     }),
//   publicClient,
// });

const ethereumClient = new EthereumClient(wagmiConfig, CHAINS);

function App() {
  return (
    <div>
      <WagmiConfig config={wagmiConfig}>
        <BrowserRouter>
          <Routes>
            <Route index element={<ConnectHomePage />} />
            <Route path="/home" element={<ConnectHomePage />} />
            <Route path="/send" element={<SendPage />} />
            <Route path="/swap" element={<SwapPage />} />
            <Route path="aave/supply" element={<AaveSupply />} />
            <Route path="aave/withdraw" element={<AaveWithdraw />} />
            <Route path="aave/borrow" element={<AaveBorrow />} />
            <Route path="aave/repay" element={<AaveRepay />} />
          </Routes>
        </BrowserRouter>
      </WagmiConfig>
      <Web3Modal projectId={PROJECT_ID} ethereumClient={ethereumClient} />
      {/* <Web3Modal
        projectId={PROJECT_ID}
        themeMode="dark"
        mobileWallets={[
          {
            id: "MetaMask",
            name: "Metamask",
            links: {
              native: "wc://metamask.app.link",
              universal: "wc://metamask.app.link",
            },
          },
        ]}
        desktopWallets={[
          {
            name: "Metamask",
            links: {
              native: "wc://metamask.app.link",
              universal: "wc://metamask.app.link",
            },
          },
        ]}
        ethereumClient={ethereumClient}
      /> */}
    </div>
  );
}

export default App;
