// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {OApp, Origin, MessagingFee} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract LZResultReceiverRelayer is OApp {
    bool public immutable isScroll;
    event ResultReceived(string successfullyVerified);

    constructor(address _endpoint, address initialOwner, bool _isScroll) OApp(_endpoint, initialOwner) {
        isScroll = _isScroll;
    }

    function sendMessage(uint32 _dstEid, address _signal, uint256 _root, uint256 _nullifierHash, uint256[8] memory _proof, bytes calldata _options) external payable {
        bytes memory _payload = abi.encode(isScroll, _signal, _root, _nullifierHash, _proof); // Encode the message as bytes
        _lzSend(
            _dstEid,
            _payload,
            _options,
            MessagingFee(msg.value, 0), // Fee for the message (nativeFee, lzTokenFee)
            payable(msg.sender) // The refund address in case the send call reverts
        );
    }

    function estimateFee(uint32 _dstEid, string memory _message, bytes calldata _options)
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
        string memory successfullyVerified = abi.decode(payload, (string));
        emit ResultReceived(successfullyVerified);
    }
}
