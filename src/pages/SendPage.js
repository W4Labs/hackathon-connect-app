import { useAccount } from 'wagmi'
 



import React from 'react'
import { SendEthPage } from './SendEthPage'

export default function SendPage() {
    const { isConnected } = useAccount()
    if (isConnected){
        return (
            <div>
                <SendEthPage />
            </div>
          )
    }
    
}
