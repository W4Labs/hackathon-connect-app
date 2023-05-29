import { useAccount, useConnect, useDisconnect } from 'wagmi'
 



import React from 'react'
import { Send } from './Send'

export default function SendPage() {
    const { isConnected } = useAccount()
    if (isConnected){
        return (
            <div>
                <Send />
            </div>
          )
    }
    
}
