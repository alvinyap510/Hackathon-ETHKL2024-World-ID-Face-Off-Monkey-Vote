// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {OApp, Origin, MessagingFee} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IVotingGovernance} from "./interfaces/IVotingGovernance.sol";

contract LayerZeroWorldIdRelayer is OApp {
    IVotingGovernance public votingGovernance;

    constructor(address _endpoint, address initialOwner, address _votingGovernance) OApp(_endpoint, initialOwner) {
        votingGovernance = IVotingGovernance(_votingGovernance);
    }

    function sendMessage(uint32 _dstEid, string memory _message, bytes memory _options) external payable {
        bytes memory _payload = abi.encode(_message); // Encode the message as bytes
        _lzSend(
            _dstEid,
            _payload,
            _options,
            MessagingFee(msg.value, 0), // Fee for the message (nativeFee, lzTokenFee)
            payable(msg.sender) // The refund address in case the send call reverts
        );
    }

    function estimateFee(uint32 _dstEid, string memory _message, bytes memory _options)
        public
        view
        returns (uint256 nativeFee, uint256 lzTokenFee)
    {
        bytes memory _payload = abi.encode(_message);
        MessagingFee memory fee = _quote(_dstEid, _payload, _options, false);
        return (fee.nativeFee, fee.lzTokenFee);
    }

    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata payload,
        address _executor,
        bytes calldata _extraData
    ) internal override {
        (bool isScroll, address _signal, uint256 _root, uint256 _nullifierHash, uint256[8] memory _proof) = abi.decode(payload, (bool, address, uint256, uint256, uint256[8]));
        (bool success, bytes memory result) = address(votingGovernance).call(
            abi.encodeWithSignature("verifyUser(address,uint256,uint256,uint256[8])", _signal, _root, _nullifierHash, _proof)
        );
        string memory successMessage = success ? "true" : "false";
        if (isScroll) {
            (uint256 fee, ) = estimateFee(40170, successMessage, hex"0003010011010000000000000000000000000000ea60"); // Option bytes for 60,000 destination gas
            (bool sent, ) = address(this).call{value: fee}(
                abi.encodeWithSelector(
                    this.sendMessage.selector,
                    40170,
                    successMessage,
                    hex"0003010011010000000000000000000000000000ea60"
                )
            );
            require(sent, "Failed to send message");
        } else { // else send to Manta
            (uint256 fee, ) = estimateFee(40272, successMessage, hex"0003010011010000000000000000000000000000ea60"); // Option bytes for 60,000 destination gas
            (bool sent, ) = address(this).call{value: fee}(
                abi.encodeWithSelector(
                    this.sendMessage.selector,
                    40272,
                    successMessage,
                    hex"0003010011010000000000000000000000000000ea60"
                )
            );
            require(sent, "Failed to send message");
        }
    }
}
