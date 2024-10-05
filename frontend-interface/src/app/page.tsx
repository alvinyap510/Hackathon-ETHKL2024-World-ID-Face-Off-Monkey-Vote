import Image from "next/image";
import styles from "./page.module.css";
import { Box } from '@chakra-ui/react'
import { ethers } from "ethers";
import abi from "../data/abi"
// import { useWalletClient, useContractWrite } from 'wagmi';
// import { getContract, writeC } from "viem";


export default function Home() {
  // const { data: walletClient, isError, isLoading } = useWalletClient();
  // const VotingGovernance = new ethers.Contract("0xcf226aD1eF8ed5E28157B4d2ddaf2f4119301844", abi, signer)

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
      </main>
    </div>
  );
}
