// 'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { Box } from '@chakra-ui/react'
import { ethers } from "ethers";
import { useReadContract } from "wagmi";
import Topics from "@/components/Topics/Topics";
// import { useWalletClient, useContractWrite } from 'wagmi';
// import { getContract, writeContract } from "viem";

import WorldId from "@/components/WorldId/WorldId"

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* <Topics/> */}
        <WorldId />
      </main>
    </div>
  );
}
