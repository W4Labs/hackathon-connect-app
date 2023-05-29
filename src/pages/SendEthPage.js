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
import { isContentEditable } from '@testing-library/user-event/dist/utils'

const tele = window.Telegram.WebApp;




export function SendEthPage(){
    const { address, isConnected, connector } = useAccount();
    const navigate = useNavigate();
    useEffect(() => {
        tele.ready();
        tele.expand();    
    });
    useEffect(() => {
        if(!isConnected){
            navigate("/");
        }
    })
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
        onSuccess(data) {
            console.log('Success from prepare', data)
            console.log(data?.hash)
        },
        onError(error) {
            console.log('Error from prepare', error)
        } 
    })
    
    const {data, isLoadingSendTransaction, isSuccessSendTransaction, sendTransaction} = useSendTransaction(config) 
    // const { data, isLoadingSendTransaction, isSuccessSendTransaction, sendTransaction } = useSendTransaction({
    //     to: toAddress,
    //     value: parseEther(amount),
    //     onSuccess(data) {
    //         console.log('Success from send', data)
    //         console.log(data?.hash)
    //     },
    //     onError(error) {
    //         console.log('Error from send', error)
    //     } 
    // })
    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            console.log('Success', data)
            console.log(data?.hash)
            
        },
        onError(error) {
            console.log('Error', error)
        }
    })
    
    

    
    function runSendTransaction(){
        try {
            sendTransaction?.()
        } catch (error) {
            console.log("error from try catch me", error)
        }
        
    }
    if(isSuccess){
        tele.MainButton.setText("Finish").show().onClick(function(){
            const set_hash = data?.hash
            const dataToBot = JSON.stringify({hash_result: set_hash})
            tele.sendData(dataToBot);
            tele.close();
          });
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
            <button disabled={!amount || !toAddress || !sendTransaction} onClick={runSendTransaction}>
            {isLoading ? 'Sending...' : 'Send'}
            </button>
            <Web3Button />
            {isSuccess && (
                <div>
                Successfully sent {amount} ether to {toAddress}
                <div>
                    <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
                </div>
                </div>
            )}
        </div>
            
        // </form>
        );
    
  
}