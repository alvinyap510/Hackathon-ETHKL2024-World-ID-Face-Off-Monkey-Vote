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

        VotingGovernance votingGovernance =
            new VotingGovernance(worldIdRouterAddress, "app_staging_f4b1453531f6ba3694c442dfe4532ec2", "vote");

        console.log("VotingGovernance deployed at:", address(votingGovernance));

        // Set up an initial admin
        address initialAdmin = deployerAddress;
        votingGovernance.setAdmin(initialAdmin, true);
        votingGovernance.setAdmin(0xbE92f2692f42580300fD8d0Ee198b5bBbe303e78, true);

        console.log("Initial admin set:", initialAdmin);

        // Create an initial voting topic
        string[] memory options_a = new string[](3);
        options_a[0] = "Bitcoin";
        options_a[1] = "Ethereum";
        options_a[2] = "Solana";

        votingGovernance.createNewVoting(
            "Your Favorite Crypto Assets", block.timestamp, block.timestamp + 7 days, options_a
        );

        console.log("Initial voting topic created");

        // Create an 2nd voting topic
        string[] memory options_b = new string[](4);
        options_b[0] = "Eason";
        options_b[1] = "Danny";
        options_b[2] = "Harith";
        options_b[3] = "TY";

        votingGovernance.createNewVoting(
            "Your Favorite ETHKL Contributor", block.timestamp, block.timestamp + 3 days, options_b
        );

        console.log("Initialize second voting topic");

        vm.stopBroadcast();
    }
}

<<<<<<< HEAD
<<<<<<< HEAD
// forge script script/DeployVotingGovernance.s.sol:DeployVotingGovernance --rpc-url https://sepolia.optimism.io --broadcast --verify --etherscan-api-key HRS7T3ISZ9Z4YD4135QQ6IDKU1G6GWAEFZ --verifier-url https://api-sepolia-optimistic.etherscan.io/api -vvvv
=======
// forge script script/DeployVotingGovernance.s.sol:DeployVotingGovernance --rpc-url https://sepolia.optimism.io --broadcast --verify -vvvv
>>>>>>> 5a3e646 (feat: add deployment script)
=======
// forge script script/DeployVotingGovernance.s.sol:DeployVotingGovernance --rpc-url https://sepolia.optimism.io --broadcast --verify --etherscan-api-key HRS7T3ISZ9Z4YD4135QQ6IDKU1G6GWAEFZ --verifier-url https://api-sepolia-optimistic.etherscan.io/api -vvvv
>>>>>>> 5e06593 (fix: update voting governance logic)
