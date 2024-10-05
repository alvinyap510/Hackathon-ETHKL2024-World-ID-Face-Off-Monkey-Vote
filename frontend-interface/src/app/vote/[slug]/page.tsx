"use client";
import React from "react";
import {
  Box,
  SimpleGrid,
  Spinner,
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Divider,
  Button,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import VotingGovernance from "@/data/VotingGovernance.json";
import VotingTopic from "@/data/VotingTopic.json";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/configs/config";
import VoteClash from "@/components/VoteClash/VoteClash";
import { contractAddresses } from "../../configs/config";

interface Option {
  optionName: string;
  wins: number;
  loses: number;
}

interface TopicDetail {
  votingTopic: string;
  startVotingTime: number;
  endVotingTime: number;
  options: Option[];
  faceOffPairsLength: number;
}

const generateRandomArray = (length: number): number[] | null => {
  if (length === null) {
    return null;
  }
  const numArray = Array.from({ length }, (_, i) => i); // Creates an array [0, 1, 2, ..., length-1]
  for (let i = numArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numArray[i], numArray[j]] = [numArray[j], numArray[i]]; // Swap elements to randomize
  }
  return numArray;
};

const getFaceOffPairsLength = (
  topicDetails: TopicDetail[],
  topicName: string
): number | null => {
  const matchedTopic = topicDetails.find(
    (topic) => topic.votingTopic.toLowerCase() === topicName.toLowerCase()
  );

  return matchedTopic ? matchedTopic.faceOffPairsLength : null;
};

const fetchMatches = async (
  votingTopicAddress: string,
  randomizedArray: number[]
): Promise<any[]> => {
  // Use the address of the specific voting topic contract to fetch the face-off pairs
  const matchPromises = randomizedArray.map((index) =>
    readContract(config, {
      abi: VotingTopic.abi, // Use the VotingTopic ABI to access the faceOffPairs function
      address: votingTopicAddress as `0x${string}`, // Use the address of the specific VotingTopic contract
      functionName: "faceOffPairs",
      args: [index], // Pass the index from the randomized array
    })
  );

  // Resolve all promises concurrently
  const matches = await Promise.all(matchPromises);
  return matches;
};

const VoteSlugPage: React.FC = () => {
  const params = useParams();
  const { slug } = params;
  const formattedSlug = slug.replace(/-/g, " ");

  const [topicDetails, setTopicDetails] = useState<TopicDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [slugExists, setSlugExists] = useState(false);
  const [randomizedArray, setRandomizedArray] = useState<number[] | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [votingTopicAddress, setVotingTopicAddress] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topics = (await readContract(config, {
          abi: VotingGovernance.abi,
          //   address: "0xacd6336af0fAB0BD7F25a7edd53Ef581596306Af",
          address: "0x900d06d92367cb53aF2e5C8D1dB07953B714a583",
          functionName: "getAllVotingTopics",
          args: [],
        })) as `0x${string}`[];

        const details = await Promise.all(
          topics.map(async (topicAddress) => {
            const TopicData = (await readContract(config, {
              abi: VotingTopic.abi,
              address: topicAddress,
              functionName: "readVotingTopic",
            })) as [string, number, number, Option[], number];

            return {
              votingTopic: TopicData[0],
              startVotingTime: TopicData[1],
              endVotingTime: TopicData[2],
              options: TopicData[3],
              faceOffPairsLength: TopicData[4],
            };
          })
        );
        setTopicDetails(details);

        const exists = details.some(
          (topic) =>
            topic.votingTopic.toLowerCase() === formattedSlug.toLowerCase()
        );
        setSlugExists(exists);

        if (exists) {
          const faceOffPairsLength = getFaceOffPairsLength(
            details,
            formattedSlug
          );
          if (faceOffPairsLength !== null) {
            // Check if faceOffPairsLength is not null
            const randomizedArray = generateRandomArray(
              Number(faceOffPairsLength)
            );
            setRandomizedArray(randomizedArray);
            //   console.log("Randomized Array:", randomizedArray); // You can use this array as needed
            if (randomizedArray !== null) {
              // Check if randomizedArray is not null
              const matchedTopicIndex = details.findIndex(
                (topic) =>
                  topic.votingTopic.toLowerCase() ===
                  formattedSlug.toLowerCase()
              );
              const votingTopicAddress = topics[matchedTopicIndex];
              setVotingTopicAddress(votingTopicAddress);

              const fetchedMatches = await fetchMatches(
                votingTopicAddress,
                randomizedArray
              );
              // console.log("fetchedMatches")
              // console.log(fetchedMatches)
              setMatches(fetchedMatches); // Store the matches in state
            }
          } else {
            console.log("faceOffPairsLength is null.");
          }
        }
      } catch (error) {
        console.error("Error fetching topic details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [formattedSlug]);

  console.log(randomizedArray);
  console.log(matches);

  // const handleFinishVoting = async (resultArray: number[]) => {
  //   console.log("Voting Finished! Result Array:", resultArray);
  //   const result = async () =>
  //     await writeContract(config, {
  //       abi: VotingTopic.abi,
  //       address: votingTopicAddress as `0x${string}`,
  //       functionName: "batchVote",
  //       args: [randomizedArray, resultArray],
  //     });
  //   // Implement any additional logic you want to handle after voting is finished.
  //   console.log(result);
  // };
  const handleFinishVoting = async (resultArray: number[]) => {
    console.log("Voting Finished! Result Array:", resultArray);

    if (!votingTopicAddress) {
      console.error("Voting topic address is not defined.");
      return;
    }

    try {
      const txResponse = await writeContract(config, {
        abi: VotingTopic.abi,
        address: votingTopicAddress as `0x${string}`,
        functionName: "batchVote",
        args: [randomizedArray, resultArray],
      });
      console.log("Transaction Response:", txResponse);
    } catch (error) {
      console.error("Transaction Error:", error);
    }
  };

  return (
    <div>
      <h1>Vote Page for {formattedSlug}</h1>
      <p>You are on the dynamic page with slug: {formattedSlug}</p>
      {loading && <Spinner size="lg" />}
      {!loading && !slugExists && <p>Topic not found.</p>}
      {!loading && slugExists && (
        <div>
          <VoteClash
            topicName={formattedSlug}
            randomizedArray={randomizedArray || []}
            matches={matches}
            onFinish={handleFinishVoting}
          />
          {/* <h2>Topic Details:</h2>
          {topicDetails.map((topic, index) => (
            topic.votingTopic.toLowerCase() === formattedSlug.toLowerCase() && (
              <div key={index}>
                <h3>{topic.votingTopic}</h3>
                <h4>Options:</h4>
                <ul>
                  {topic.options.map((option, i) => (
                    <li key={i}>{option.optionName} - Wins: {option.wins}, Loses: {option.loses}</li>
                  ))}
                </ul>
                <p>Face Off Pairs Length: {topic.faceOffPairsLength}</p>
              </div>
            )
          ))} */}
        </div>
      )}
    </div>
  );
};

export default VoteSlugPage;
