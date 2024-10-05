// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Script.sol";
import {LZCrossChainMessageRelayer} from "../src/LZCrossChainMessageRelayer.sol";

contract DeployCrossChainMessageRelayer is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        console.log("Deployer address:", deployerAddress);

        // Broadcast
        vm.startBroadcast(deployerPrivateKey);
        LZCrossChainMessageRelayer messageRelayer =
            new LZCrossChainMessageRelayer(0x6EDCE65403992e310A62460808c4b910D972f10f, msg.sender);
        vm.stopBroadcast();
    }

    function run_set() public {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        LZCrossChainMessageRelayer messageRelayer = LZCrossChainMessageRelayer(0x9e45B76F4dCb0A4d1b7eA7bab031f6d880DB5Cd1);
        // LZCrossChainMessageRelayer messageRelayer =
        //     new LZCrossChainMessageRelayer(0x6EDCE65403992e310A62460808c4b910D972f10f, msg.sender);
        messageRelayer.setPeer(40170, addressToBytes32(0x79E40811762DD0702fd280E125AF2fA32d7F54Be));
        vm.stopBroadcast();
    }

    function run_send() public {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        LZCrossChainMessageRelayer messageRelayer = LZCrossChainMessageRelayer(0x79E40811762DD0702fd280E125AF2fA32d7F54Be);
        (uint256 fee, ) = messageRelayer.estimateFee(40232, "Hello from Scroll Sepolia", hex"00030100110100000000000000000000000000061a80"); // Option bytes for 400,000 destination gas
        messageRelayer.sendMessage{value: fee}(40232, "Hello from Scroll Sepolia", hex"00030100110100000000000000000000000000061a80"); // Option bytes for 400,000 destination gas
        vm.stopBroadcast();
    }

    function addressToBytes32(address _addr) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }
}

// Scroll Sepolia LZ Endpoint: 0x6EDCE65403992e310A62460808c4b910D972f10f
// Manta Sepolia LZ Endpoint: 0x6EDCE65403992e310A62460808c4b910D972f10f
// Optimism Sepolia LZ Endpoint: 0x6EDCE65403992e310A62460808c4b910D972f10f

// ScrollSepoliaRelayer: 0x79E40811762DD0702fd280E125AF2fA32d7F54Be
// OptimismSepolia: 0x9e45B76F4dCb0A4d1b7eA7bab031f6d880DB5Cd1
// MantaSepoliaRelayer: 0xc19Ac697392EaaF3Cca5505209542abf8eDcd12e

// Scroll
// forge script script/DeployCrossChainMessageRelayer.s.sol:DeployCrossChainMessageRelayer --rpc-url https://sepolia-rpc.scroll.io --broadcast --verify --etherscan-api-key 8654MU4RD3WIRD3QM342QG35BYDP9CVAEG --verifier-url https://api-sepolia.scrollscan.com/api -vvvv

// Optimism
// forge script script/DeployCrossChainMessageRelayer.s.sol:DeployCrossChainMessageRelayer --rpc-url https://sepolia.optimism.io --broadcast --verify --etherscan-api-key HRS7T3ISZ9Z4YD4135QQ6IDKU1G6GWAEFZ --verifier-url https://api-sepolia-optimistic.etherscan.io/api -vvvv

// forge script script/DeployCrossChainMessageRelayer.s.sol:DeployCrossChainMessageRelayer --rpc-url https://sepolia-rpc.scroll.io --broadcast --verify --etherscan-api-key 8654MU4RD3WIRD3QM342QG35BYDP9CVAEG --verifier-url https://api-sepolia-optimistic.etherscan.io/api -vvvv
