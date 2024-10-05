export const VotingGovernance = 
[
  {
    type: "constructor",
    inputs: [
      { name: "_worldIdRouter", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allVotingTopics",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createNewVoting",
    inputs: [
      { name: "_votingTopic", type: "string", internalType: "string" },
      { name: "_startTime", type: "uint256", internalType: "uint256" },
      { name: "_endTime", type: "uint256", internalType: "uint256" },
      { name: "_optionsArray", type: "string[]", internalType: "string[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAllVotiingTopics",
    inputs: [],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isAdmin",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isUserWorldIdVerified",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isWorldIdVerified",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setAdmin",
    inputs: [
      { name: "_admin", type: "address", internalType: "address" },
      { name: "_isAdmin", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "verifyUser",
    inputs: [
      { name: "_user", type: "address", internalType: "address" },
      { name: "_root", type: "uint256", internalType: "uint256" },
      { name: "_groupId", type: "uint256", internalType: "uint256" },
      { name: "_signalHash", type: "uint256", internalType: "uint256" },
      { name: "_nullifierHash", type: "uint256", internalType: "uint256" },
      {
        name: "_externalNullifierHash",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_proof", type: "uint256[8]", internalType: "uint256[8]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "worldIdRouter",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IWorldID" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "NewVotingTopic",
    inputs: [
      {
        name: "votingAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "votingTopic",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "startTime",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "endTime",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetAdmin",
    inputs: [
      {
        name: "admin",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      { name: "isAdmin", type: "bool", indexed: false, internalType: "bool" },
    ],
    anonymous: false,
  },
]

// export default VotingGovernance;