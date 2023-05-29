import './App.css';
import Connect from './pages/Connect'
import SendPage from './pages/SendPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Button, Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'
import { useAccount, useContract } from 'wagmi'
import { useEffect } from 'react'
import './App.css';



const projectId = "4b2367cdd661553089d9366b1dda20b8"
const chains = [mainnet]

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

const tele = window.Telegram.WebApp;

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({
        projectId: "4b2367cdd661553089d9366b1dda20b8",
        version: 2,
        chains
    }),
    publicClient
})

const ethereumClient = new EthereumClient(wagmiConfig, chains)


function App() {
  return(
      <div>
      <WagmiConfig config={wagmiConfig}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Connect />} />
          <Route path='/home' element={<Connect />} />
          <Route path="/send" element={<SendPage />} />
        </Routes>
      </BrowserRouter>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      
    </div>
    
  );

}

export default App;
