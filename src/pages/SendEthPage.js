import { useAccount, useContract } from 'wagmi'
import { useDebounce } from 'use-debounce'
import { parseEther } from 'viem'
import { useEffect } from 'react'
import {
    usePrepareSendTransaction,
    useSendTransaction,
    useWaitForTransaction,
  } from 'wagmi'
import * as React from 'react'
import '../App.css';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Web3Button } from '@web3modal/react'

const tele = window.Telegram.WebApp;




export function SendEthPage(){
    const { address, isConnected, connector } = useAccount();
    const navigate = useNavigate();
    useEffect(() => {
        tele.ready();
        tele.expand();    
    });
    
    
    const [searchParams, setSearchParams] = useSearchParams()
    const [toAddress, setToAddress] = React.useState(searchParams.get('toAddress') || '')
    //const [debouncedTo] = useDebounce(to, 500)
    
    const [amount, setAmount] = React.useState( searchParams.get("amount") || '')
    //const [debouncedAmount] = useDebounce(amount, 500)
    
    // const { config } = usePrepareSendTransaction({
    //     request: {
    //     to,
    //     value: parseEther(debouncedAmount),
    //     },
        
    // })
    const { config } = usePrepareSendTransaction({
        to: toAddress,
        value: parseEther(amount), 
    })
    const {sendTransaction} = useSendTransaction(config) 
    // const { sendTransaction } = useSendTransaction({
    //     request: {
    //         to: "0x5aa330aF30e1d67B3C9182C61a5AdDD798c1b3E5",
    //         value: (amount*1e18).toString()
    //     },
    //     onSuccess: () => alert("success")
    // })

    useEffect(() => {
        if(!isConnected){
            navigate("/home");
        }
    })

    

    console.log(toAddress)
    console.log(amount)
    console.log(parseEther(amount))
    console.log(!sendTransaction)
    
    function runSendTransaction(){
        sendTransaction?.()
    }

    return(
        // <form
        //     onSubmit={(e) => {
        //         e.preventDefault()
        //         // sendTransaction?.()
        //         }}
        // >
        <div>
            <p>To: {toAddress}</p>
            <p>Amount: {amount} eth</p>
            <button disabled={!amount} onClick={runSendTransaction}>Send</button>
            <Web3Button />
        </div>
            
        // </form>
        );
    
  
}