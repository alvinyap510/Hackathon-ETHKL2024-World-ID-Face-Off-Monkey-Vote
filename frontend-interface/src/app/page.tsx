import Image from "next/image";
import styles from "./page.module.css";
import { Box, Button } from "@chakra-ui/react";
import WorldId from "@/components/WorldId/WorldId";
import { redirect } from "next/navigation";

export default function Home() {
  async function handleSkipWorldId() {
    "use server";
    redirect("/vote");
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <WorldId />
        <Box mt={4}>
          <form action={handleSkipWorldId}>
            <Button type="submit" colorScheme="teal">
              Skip World ID for Demo
            </Button>
          </form>
        </Box>
      </main>
    </div>
  );
}
