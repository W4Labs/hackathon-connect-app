import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Button, Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'
import { useAccount, useContract } from 'wagmi'
import { useEffect } from 'react'
import '../App.css';



// const projectId = process.env.WALLET_CONNECT_PROJECT_ID
// const chains = [mainnet, polygon]

// const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

const tele = window.Telegram.WebApp;

// const wagmiConfig = createConfig({
//     autoConnect: false,
//     connectors: w3mConnectors({
//         projectId,
//         version: 1,
//         chains
//     }),
//     publicClient
// })

// const ethereumClient = new EthereumClient(wagmiConfig, chains)

export default function Connect(){
    const { address, isConnected } = useAccount();
  useEffect(() => {
    tele.ready();
    tele.expand();
  });

  if(!isConnected){
    return(
    <div className="App">
      <header className="App-header">
      {/* <WagmiConfig config={wagmiConfig}>
        <Web3Button />
      </WagmiConfig>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} /> */}
        <Web3Button />
      </header>
    </div>
    )
  }
  
  tele.MainButton.setText("Finish").show().onClick(function(){
    const data = JSON.stringify({address: address})
    tele.sendData(data);
    tele.close();
  });
  return (
    <div className="App">
      <header className="App-header">
      {/* <WagmiConfig config={wagmiConfig}>
      <div>
              
              <h3>Wallet Connected</h3>
              <p>Address: {address}</p>
              <Web3Button />
      </div> 
        
      </WagmiConfig>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} /> */}
        <div>
              
              <h3>Wallet Connected</h3>
              <p>Address: {address}</p>
              <Web3Button />
      </div>
      </header>
    </div>
  );

}