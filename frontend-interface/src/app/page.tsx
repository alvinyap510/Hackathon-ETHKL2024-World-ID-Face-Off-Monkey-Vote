// 'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { Box } from '@chakra-ui/react'
import { ethers } from "ethers";
import { useReadContract } from "wagmi";
import Topics from "@/components/Topics/Topics";


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* <Topics/> */}
      </main>
    </div>
  );
}
