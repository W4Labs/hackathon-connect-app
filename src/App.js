import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import ConnectHomePage from './pages/ConnectHomePage';
import SendPage from './pages/SendPage';
import './App.css';

// Import PROJECT_ID from constants.js
import { PROJECT_ID } from './constants';

const CHAINS = [mainnet];

const { publicClient } = configureChains(CHAINS, [w3mProvider({ projectId: PROJECT_ID })]);

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({
        projectId: PROJECT_ID,
        version: 1,
        chains: CHAINS
    }),
    publicClient
});

const ethereumClient = new EthereumClient(wagmiConfig, CHAINS);

function App() {
  return(
    <div>
      <WagmiConfig config={wagmiConfig}>
        <BrowserRouter>
          <Routes>
            <Route index element={<ConnectHomePage />} />
            <Route path='/home' element={<ConnectHomePage />} />
            <Route path="/send" element={<SendPage />} />
          </Routes>
        </BrowserRouter>
      </WagmiConfig>
      <Web3Modal projectId={PROJECT_ID} ethereumClient={ethereumClient} />
    </div>
  );
}

export default App;
