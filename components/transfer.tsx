import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import styles from '@/styles/Home.module.css'

export default function Tansfer() {
    const { publicKey, sendTransaction } = useWallet();

    return (
        <div className={styles.description}>
            {publicKey ?
                <p>{publicKey.toString()}</p>
                :
                <div>
                    <p>You have x SOL</p>
                    <div>
                        <label htmlFor="toWalletId">Send SOL to:</label>
                        <input type="text" name="toWalletId" id="toWalletId" placeholder='Recipient wallet address'/>
                    </div>
                    <button>Send!</button>
                </div>
            }
        </div>
    )

}