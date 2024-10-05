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
import { contractAddresses } from "../../../configs/config";
import { useChainId } from "wagmi";

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

  const [resultOptions, setResultOptions] = useState<Option[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  const chainId = useChainId();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topics = (await readContract(config, {
          abi: VotingGovernance.abi,
          //   address: "0xacd6336af0fAB0BD7F25a7edd53Ef581596306Af",
          // address: "0x900d06d92367cb53aF2e5C8D1dB07953B714a583",
          address: contractAddresses.VotingGovernance[chainId],
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

  const fetchLatestResults = async () => {
    if (!votingTopicAddress) return;

    setLoadingResults(true);
    try {
      const options = (await readContract(config, {
        abi: VotingTopic.abi,
        address: votingTopicAddress as `0x${string}`,
        functionName: "returnAllOptions",
        args: [],
      })) as Option[];

      setResultOptions(options);
    } catch (error) {
      console.error("Error fetching latest results:", error);
    } finally {
      setLoadingResults(false);
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
          {/* Button to fetch the latest results */}
          <Button
            onClick={fetchLatestResults}
            isLoading={loadingResults}
            mt={4}
          >
            Show Latest Results
          </Button>

          {/* Display the fetched results */}
          {resultOptions.length > 0 && (
            <Box mt={4}>
              <Heading size="md">Latest Voting Results</Heading>
              {resultOptions.map((option, index) => {
                const totalVotes = option.wins + option.loses;
                const winRate =
                  totalVotes > 0
                    ? (Number(option.wins) / Number(totalVotes)) * 100
                    : 0;
                console.log(option);
                return (
                  <Card key={index} mt={2}>
                    <CardBody>
                      <Heading size="sm">{option.optionName}</Heading>
                      <p>Wins: {Number(option.wins)}</p>
                      <p>Loses: {Number(option.loses)}</p>
                      <p>Win Rate: {winRate.toFixed(2)}%</p>
                    </CardBody>
                  </Card>
                );
              })}
            </Box>
          )}
        </div>
      )}
    </div>
  );
};

export default VoteSlugPage;
