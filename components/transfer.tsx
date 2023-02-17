import { useState } from 'react';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import styles from '@/styles/Home.module.css'

export default function Tansfer() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [toWalletId, setToWalletId] = useState<string>('');
    const [solAmount, setSolAmount] = useState<number>(0);

    const doTransaction = async (fromWalletParam: PublicKey, toWalletParam: string, amount: number) => {
        console.log(fromWalletParam)
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
    }

    if (publicKey) {
        return (
            <div className={styles.description}>

                <p>You have x SOL</p>
                <div>
                    <label htmlFor="toWalletId">Send SOL to:</label>
                    <input type="text" name="toWalletId" id="toWalletId" 
                        placeholder='Recipient wallet address' 
                        onChange={(e) => setToWalletId(e.target.value)} 
                    />
                </div>
                <div>
                    <label htmlFor="solAmount">Amount:</label>
                    <input type="number" name="solAmount" id="solAmount" 
                        placeholder='5' 
                        onChange={(e) => setSolAmount(Number(e.target.value))}
                    />
                </div>
                <button onClick={() => doTransaction(publicKey, toWalletId, solAmount)}>Send!</button>
            </div>
        )
    } else {
        return <></>
    }

}