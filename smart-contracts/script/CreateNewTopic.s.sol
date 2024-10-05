// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Script.sol";
import {VotingGovernance} from "../src/VotingGovernance.sol";

contract CreateNewTopic is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        console.log("Deployer address:", deployerAddress);

        vm.startBroadcast(deployerPrivateKey);

        VotingGovernance votingGovernance = VotingGovernance(0xacd6336af0fAB0BD7F25a7edd53Ef581596306Af);

        string[] memory options = new string[](4);
        options[0] = "Eason";
        options[1] = "Danny";
        options[2] = "Harith";
        options[3] = "TY";

        votingGovernance.createNewVoting(
            "Your Favorite ETHKL Contributor", block.timestamp, block.timestamp + 3 days, options
        );

        vm.stopBroadcast();
    }
}

// forge script script/CreateNewTopic.s.sol:CreateNewTopic --rpc-url https://sepolia.optimism.io --broadcast --verify --etherscan-api-key HRS7T3ISZ9Z4YD4135QQ6IDKU1G6GWAEFZ --verifier-url https://api-sepolia-optimistic.etherscan.io/api -vvvv
