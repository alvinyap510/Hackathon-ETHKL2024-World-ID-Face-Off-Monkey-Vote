'use client'
import { Box, SimpleGrid, Spinner, Card, CardBody, CardFooter, Image, Stack, Divider, Button, Heading, Flex } from '@chakra-ui/react'
import NextLink from 'next/link'
import VotingGovernance from "../../data/VotingGovernance.json"
import VotingTopic from "../../data/VotingTopic.json"
import { readContract } from '@wagmi/core'
import { useState, useEffect } from 'react';
import { config } from '@/configs/config';

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

export default function Topics() {
    const [topicDetails, setTopicDetails] = useState<TopicDetail[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Fetching all voting topics from the contract
      const fetchTopics = async () => {
        try {
          const topics = await readContract(config, {
            abi: VotingGovernance.abi,
            address: "0xacd6336af0fAB0BD7F25a7edd53Ef581596306Af", 
            functionName: 'getAllVotingTopics',
            args: [], // if the function requires arguments, add them here
          }) as `0x${string}`[]  // Explicitly casting the result to string[]
  

          
       // Now fetch details for each topic address
       const details = await Promise.all(
        topics.map(async (topicAddress) => {
        //   const address = topicAddress as `0x${string}`;

          // Call the contract to get the raw struct data
          const TopicData = await readContract(config,{
            abi: VotingTopic.abi,
            address: topicAddress,  // use the properly casted address here
            functionName: 'readVotingTopic',  // Replace with the actual function name
          }) as [string, number, number, Option[], number];

          return {
            votingTopic: TopicData[0],
            startVotingTime: TopicData[1],
            endVotingTime: TopicData[2],
            options: TopicData[3],
            faceOffPairsLength: TopicData[4]
          };
        })
      );
      setTopicDetails(details);
    } catch (error) {
      console.error("Error fetching topic details:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchTopics();
}, []);

// console.log("HERE3")
// console.log(topicDetails)
const renderCards = () => {
    return topicDetails.map((topic, index) => (
    //   <Box
    //     key={index}
    //     border="1px solid #ddd"
    //     borderRadius="8px"
    //     padding="16px"
    //     margin="8px"
    //     boxShadow="md"
    //   >
    //     <Text fontWeight="bold">Topic #{index + 1}</Text>
    //     <Text>Voting Topic: {topic.votingTopic}</Text>
    //     <Text>Start Time: {new Date(Number(topic.startVotingTime) * 1000).toLocaleString()}</Text>
    //     <Text>End Time: {new Date(Number(topic.endVotingTime) * 1000).toLocaleString()}</Text>
    //     <Text>Number of Face-off Pairs: {topic.faceOffPairsLength}</Text>
    //     <Text fontWeight="bold">Options:</Text>
    //     {topic.options.map((option, optionIndex) => (
    //       <Box key={optionIndex} ml={4}>
    //         <Text>{option.optionName} - Wins: {option.wins.toString()}, Loses: {option.loses.toString()}</Text>
    //       </Box>
    //     ))}
    //   </Box>
    <Card maxW='sm' key={index}>
        <CardBody>
            <Image
            src={`/topics/${topic.votingTopic.replaceAll(" ", "-")}/dp.jpg`}
            alt={topic.votingTopic}
            borderRadius='lg'
            />
            <Stack mt='6' spacing='3'>
            <Heading size='md'>{topic.votingTopic}</Heading>
            </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
            <Flex justifyContent='center' w='100%'>
                <NextLink href={`/vote/${topic.votingTopic.replaceAll(" ", "-")}`}>
                    <Button variant='solid' colorScheme='blue'>
                        Enter
                    </Button>  
                </NextLink>
            </Flex>
        </CardFooter>
    </Card>
    ));
  };
  
    return (
      <Box>
        {loading ? (
          <Spinner size="lg" />
        ) : (
          <SimpleGrid columns={[1, 2, 3]} spacing="20px">
            {renderCards()}
          </SimpleGrid>
        )}
      </Box>
    );
  }