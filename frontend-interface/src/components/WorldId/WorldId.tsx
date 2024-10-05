'use client'

import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, type BaseError } from 'wagmi'
import abi from "@/data/abi.js"// get the user's wallet address

const WorldId = () => {
    const account = useAccount() 
    const { data: hash, isPending, error, writeContractAsync } = useWriteContract()

    const onSuccess = async (proof: ISuccessResult) => {
        alert("Success")
        console.log(proof)
        try {
			await writeContractAsync({
				address: "0xe97E8AFB8bE1CA1157916b2bd4dB24c7fB9fc7E3",
				account: account.address,
				abi,
				functionName: 'createNewVoting',
				args: [
					"test",
                    BigInt(1),
                    BigInt(1),
                    ["test1", "test2"]
				],
			})
		} catch (error) {throw new Error((error as BaseError).shortMessage)}
    }
    return (
        <>
            <IDKitWidget
                app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`} 
                action={process.env.NEXT_PUBLIC_ACTION as string}
                signal={account.address} // proof will only verify if the signal is unchanged, this prevents tampering
                onSuccess={onSuccess} // use onSuccess to call your smart contract
                // use default verification_level (orb-only), as device credentials are not supported on-chain
            >
                {({ open }) => <button onClick={open}>Verify with World ID</button>}
            </IDKitWidget>
        </>
    )
}

export default WorldId;