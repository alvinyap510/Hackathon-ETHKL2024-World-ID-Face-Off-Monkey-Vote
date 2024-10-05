'use client'

import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'

// const { address } = useAddress() // get the user's wallet address
const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

const WorldId = () => {
    const onSuccess = (proof: ISuccessResult) => {
        alert("Success")
        console.log(proof)
    }
    return (
        <>
            <IDKitWidget
                app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`} 
                action={process.env.NEXT_PUBLIC_ACTION as string}
                signal={address} // proof will only verify if the signal is unchanged, this prevents tampering
                onSuccess={onSuccess} // use onSuccess to call your smart contract
                // use default verification_level (orb-only), as device credentials are not supported on-chain
            >
                {({ open }) => <button onClick={open}>Verify with World ID</button>}
            </IDKitWidget>
        </>
    )
}

export default WorldId;