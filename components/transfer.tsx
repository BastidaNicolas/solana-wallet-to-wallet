import { useEffect, useState } from 'react';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import styles from '@/styles/Home.module.css'

export default function Tansfer() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [toWalletId, setToWalletId] = useState<string>('');
    const [solAmount, setSolAmount] = useState<string>('');
    const [accountBalance, setAccountBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setToWalletId('')
        setSolAmount('')
        if (publicKey) {
            getSolBalance(publicKey);
        }
    }, [publicKey]);

    const doTransaction = async (fromWalletParam: PublicKey, toWalletParam: string, amount: number) => {
        try {
            setLoading(true)
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: fromWalletParam,
                    toPubkey: new PublicKey(toWalletParam),
                    lamports: amount * LAMPORTS_PER_SOL
                })
            )
            const {
                context: { slot: minContextSlot },
                value: { blockhash, lastValidBlockHeight }
            } = await connection.getLatestBlockhashAndContext();
            const signature = await sendTransaction(transaction, connection, { minContextSlot })
            await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
            getSolBalance(fromWalletParam);
            setToWalletId('');
            setSolAmount('')
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.log(err)
        }
    }

    const getSolBalance = async (fromWalletParam: PublicKey) => {
        const balance = await connection.getBalance(fromWalletParam)
        setAccountBalance(balance / LAMPORTS_PER_SOL);
    }
    return (
        <div className={`${styles.description} rounded-lg bg-neutral-900 px-6 py-5 transition-all duration-200 origin-top max-w-[90%] ${publicKey ? 'my-16' : 'scale-y-0 h-0 py-0 overflow-hidden'}`} >
            <div className={`flex flex-wrap justify-between mb-8  ${publicKey ? '' : 'opacity-0'}`}>
                <p>Sol Balance:</p>
                <p>{accountBalance}</p>
            </div>

            <div className={`flex flex-col mb-4 text-left`}>
                <label htmlFor="toWalletId">Send to:</label>
                <input type="text" name="toWalletId" id="toWalletId"
                    placeholder='Recipient wallet address'
                    onChange={(e) => setToWalletId(e.target.value)}
                    value={toWalletId}
                />
            </div>
            <div className={`flex flex-col mb-8 text-left`}>
                <label htmlFor="solAmount">Amount:</label>
                <input type="number" name="solAmount" id="solAmount"
                    placeholder='5'
                    onChange={(e) => setSolAmount(e.target.value)}
                    value={solAmount}
                />
            </div>
            {!loading ?
                <button disabled={!toWalletId || !solAmount}
                    className='bg-violet-800 w-full py-2 text-lg rounded hover:bg-neutral-800 disabled:bg-neutral-800 disabled:text-gray-500'
                    onClick={() => doTransaction(publicKey, toWalletId, solAmount)}
                >
                    Send!
                </button>
                :
                <button disabled={true}
                    className='flex justify-center items-center w-full py-2 text-lg rounded disabled:bg-neutral-800 disabled:text-gray-500'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="animate-spin w-6 h-6 mr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Processing
                </button>
            }
        </div>
    )
}