'use client'

import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, type BaseError } from 'wagmi'
import { decodeAbiParameters, parseAbiParameters } from 'viem'
import { abi } from "@/data/abi.json"// get the user's wallet address
import { useRouter } from 'next/navigation';

const WorldId = () => {
    const account = useAccount() 
    const router = useRouter()
    const { data: hash, isPending, error, writeContractAsync } = useWriteContract()

    const onSuccess = async (proof: ISuccessResult) => {
        router.push('/vote');
        // alert("Wait for a little bit for the transaction to be initiated from your wallet")
        // console.log(proof)
        // try {
		// 	await writeContractAsync({
		// 		address: "0xe97E8AFB8bE1CA1157916b2bd4dB24c7fB9fc7E3",
		// 		account: account.address,
		// 		abi,
		// 		functionName: 'verifyUser',
		// 		args: [
		// 			account.address!,
		// 			BigInt(proof!.merkle_root),
		// 			BigInt(proof!.nullifier_hash),
		// 			decodeAbiParameters(
		// 				parseAbiParameters('uint256[8]'),
		// 				proof!.proof as `0x${string}`
		// 			)[0],
		// 		],
		// 	});
		// } catch (error) {throw new Error((error as BaseError).shortMessage)}
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
            {hash && <p>Transaction Hash: {hash}</p>}
        </>
    )
}

export default WorldId;