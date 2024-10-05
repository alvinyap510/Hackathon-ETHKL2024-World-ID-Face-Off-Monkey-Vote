// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Script.sol";
import {VotingGovernance} from "../src/VotingGovernance.sol";

contract DeployVotingGovernance is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        address worldIdRouterAddress = vm.envAddress("WORLD_ID_OP_SEPOLIA_ROUTER_ADDRESS");

        console.log("Deployer address:", deployerAddress);

        vm.startBroadcast(deployerPrivateKey);

        VotingGovernance votingGovernance = new VotingGovernance(worldIdRouterAddress);

        console.log("VotingGovernance deployed at:", address(votingGovernance));

        // Set up an initial admin
        address initialAdmin = deployerAddress;
        votingGovernance.setAdmin(initialAdmin, true);

        console.log("Initial admin set:", initialAdmin);

        // Create an initial voting topic
        string memory initialTopic = "Your Favorite Crypto Assets";
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + 7 days;
        string[] memory options = new string[](3);
        options[0] = "Bitcoin";
        options[1] = "Ethereum";
        options[2] = "Solana";

        votingGovernance.createNewVoting(initialTopic, startTime, endTime, options);

        console.log("Initial voting topic created");

        vm.stopBroadcast();
    }
}

// forge script script/DeployVotingGovernance.s.sol:DeployVotingGovernance --rpc-url https://sepolia.optimism.io --broadcast --verify -vvvv
