'use client'
import React from 'react';
import { Box, SimpleGrid, Spinner, Card, CardBody, CardFooter, Image, Stack, Divider, Button, Heading, Flex } from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import VotingGovernance from "@/data/VotingGovernance.json"
import VotingTopic from "@/data/VotingTopic.json"
import { readContract } from '@wagmi/core'
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

const VoteSlugPage: React.FC = () => {
  const params = useParams();
  const { slug } = params;
  const formattedSlug = slug.replace(/-/g, ' ');

  const [topicDetails, setTopicDetails] = useState<TopicDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [slugExists, setSlugExists] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topics = await readContract(config, {
          abi: VotingGovernance.abi,
          address: "0xacd6336af0fAB0BD7F25a7edd53Ef581596306Af", 
          functionName: 'getAllVotingTopics',
          args: [],
        }) as `0x${string}`[]

        

        const details = await Promise.all(
          topics.map(async (topicAddress) => {
            const TopicData = await readContract(config,{
              abi: VotingTopic.abi,
              address: topicAddress,
              functionName: 'readVotingTopic',
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

        const exists = details.some(topic => topic.votingTopic.toLowerCase() === formattedSlug.toLowerCase());
        setSlugExists(exists);
      } catch (error) {
        console.error("Error fetching topic details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [formattedSlug]);

  return (
    <div>
      <h1>Vote Page for {formattedSlug}</h1>
      <p>You are on the dynamic page with slug: {formattedSlug}</p>
      {loading && <Spinner size="lg" />}
      {!loading && !slugExists && <p>Topic not found.</p>}
      {!loading && slugExists && (
        <div>
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
}

export default VoteSlugPage;