// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {VotingTopic} from "./VotingTopic.sol";
import {IWorldID} from "@worldcoin/world-id-contracts/src/interfaces/IWorldID.sol";

library ByteHasher {
    /// @dev Creates a keccak256 hash of a bytestring.
    /// @param value The bytestring to hash
    /// @return The hash of the specified value
    /// @dev >> 8 makes sure that the result is included in our field
    function hashToField(bytes memory value) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(value))) >> 8;
    }
}

contract VotingGovernance is Ownable {
    /*------ CONTRACT VARIABLES ------*/
    using ByteHasher for bytes;

    /*------ CONTRACT VARIABLES ------*/
    IWorldID public worldIdRouter;
    mapping(address => bool) public isAdmin;
    mapping(address => bool) public isWorldIdVerified;
    address[] public allVotingTopics;
    uint256 internal immutable externalNullifier;

    /*------ EVENTS ------*/
    event SetAdmin(address admin, bool isAdmin);
    event NewVotingTopic(address indexed votingAddress, string votingTopic, uint256 startTime, uint256 endTime);

    /*------ MODIFIER ------*/

    modifier onlyAdmin() {
        require(isAdmin[msg.sender] || msg.sender == owner(), "VotingGovernance: Not Admin");
        _;
    }

    /*------ CONSTRUCTOR ------*/

    constructor(address _worldIdRouter, string memory _appId, string memory _actionId) {
        worldIdRouter = IWorldID(_worldIdRouter);
        externalNullifier = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
    }

    /*------ ADMIN FUNCTIONS ------*/

    function setAdmin(address _admin, bool _isAdmin) external onlyOwner {
        isAdmin[_admin] = _isAdmin;
        emit SetAdmin(_admin, _isAdmin);
    }

    function createNewVoting(
        string memory _votingTopic,
        uint256 _startTime,
        uint256 _endTime,
        string[] memory _optionsArray
    ) external onlyAdmin {
        VotingTopic newVotingTopic = new VotingTopic(_votingTopic, _startTime, _endTime, _optionsArray);
        allVotingTopics.push(address(newVotingTopic));
        emit NewVotingTopic(address(newVotingTopic), _votingTopic, _startTime, _endTime);
    }

    function verifyUser(address _signal, uint256 _root, uint256 _nullifierHash, uint256[8] calldata _proof) external {
        require(!isWorldIdVerified[_signal], "VotingGovernance: Address already verified with World ID");
        try worldIdRouter.verifyProof(
            _root, 1, abi.encodePacked(_signal).hashToField(), _nullifierHash, externalNullifier, _proof
        ) {
            isWorldIdVerified[_signal] = true;
        } catch Error(string memory reason) {
            revert(reason);
        }
    }

    /*------ VIEW FUNCTIONS ------*/
    function isUserWorldIdVerified(address _user) public view returns (bool) {
        return true;
        // return isWorldIdVerified[_user];
    }

    function getAllVotingTopics() public view returns (address[] memory) {
        return allVotingTopics;
    }
}
