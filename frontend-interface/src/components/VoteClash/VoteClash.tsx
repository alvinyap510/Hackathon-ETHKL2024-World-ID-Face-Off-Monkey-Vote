'use client';
import React, { useState } from 'react';
import { SimpleGrid, Card, CardBody, CardFooter, Button, Text, Heading, Box, Flex, Image } from '@chakra-ui/react';

interface VoteClashProps {
  topicName: string; 
  matches: Array<[string, bigint, string, bigint]>; 
  randomizedArray: number[]; // The randomized array of indices
  onFinish: (resultArray: number[]) => void; 
//   onVote: (matchIndex: number, selectedOptionIndex: number) => void; // Callback function when an option is selected
}

const VoteClash: React.FC<VoteClashProps> = ({ topicName, matches, randomizedArray, onFinish }) => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0); // Index to track the current match
  const [resultArray, setResultArray] = useState<number[]>([]); // Array to track results of each match
  console.log(matches)

  const handleVote = (selectedOptionIndex: number) => {
    // Update the resultArray with the selected option (0 for optionOne, 1 for optionTwo)
    const updatedResults = [...resultArray, selectedOptionIndex];
    setResultArray(updatedResults);

    // If we're at the last match, finish voting
    if (currentMatchIndex === matches.length - 1) {
      onFinish(updatedResults); // Call onFinish with the complete resultArray
    } else {
      // Move to the next match
      setCurrentMatchIndex(currentMatchIndex + 1);
    }
  };

  const currentMatch = matches[currentMatchIndex];
  console.log(currentMatch)

  return (
    <Box padding={4} width="full">
      {currentMatch ? (
        <Card border="1px solid #e2e8f0" borderRadius="lg" boxShadow="lg" margin="auto" width="50%">
          <CardBody>
            <Heading size="md" mb={4} textAlign="center">
              Match {currentMatchIndex + 1} of {matches.length}
            </Heading>
            <Flex justify="space-between" mb={4} alignItems="center">
              {/* Option One */}
              <Box
                width="45%"
                p={4}
                border="1px solid #e2e8f0"
                borderRadius="md"
                textAlign="center"
                cursor="pointer"
                onClick={() => handleVote(0)} // Select option one (0)
                _hover={{ bg: 'gray.100' }}
              >
                <Image
                  src={`/topics/${topicName.replaceAll(" ", "-")}/${currentMatch[0]}.jpg`}
                  alt={currentMatch[0]}
                  boxSize="100px" // Fixed size for image
                  objectFit="cover"
                  mx="auto"
                  mb={2}
                />
                <Text fontSize="xl" fontWeight="bold">
                  {currentMatch[0]}
                </Text>
              </Box>

              <Text fontSize="lg" alignSelf="center">
                VS
              </Text>

              {/* Option Two */}
              <Box
                width="45%"
                p={4}
                border="1px solid #e2e8f0"
                borderRadius="md"
                textAlign="center"
                cursor="pointer"
                onClick={() => handleVote(1)} // Select option two (1)
                _hover={{ bg: 'gray.100' }}
              >
                <Image
                  src={`/topics/${topicName.replaceAll(" ", "-")}/${currentMatch[2]}.jpg`}
                  alt={currentMatch[2]}
                  boxSize="100px" // Fixed size for image
                  objectFit="cover"
                  mx="auto"
                  mb={2}
                />
                <Text fontSize="xl" fontWeight="bold">
                  {currentMatch[2]}
                </Text>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      ) : (
        <Text>No more matches to display.</Text>
      )}
    </Box>
  );
};


export default VoteClash;
