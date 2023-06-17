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
const PROJECT_ID = process.env.PROJECT_ID;
console.log("Project id: ", PROJECT_ID);

const { publicClient } = configureChains(CHAINS, [
  w3mProvider({ projectId: PROJECT_ID }),
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    projectId: PROJECT_ID,
    version: 1,
    chains: CHAINS,
    rpc: {
      1: "https://mainnet.infura.io/v3/83110b298a9f45faa4b26602598ad2e5",
    },
  }),
  publicClient,
});

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
    </div>
  );
}

export default App;
