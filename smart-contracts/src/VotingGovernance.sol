// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {VotingTopic} from "./VotingTopic.sol";
import {IWorldID} from "@worldcoin/world-id-contracts/src/interfaces/IWorldID.sol";

contract VotingGovernance is Ownable {
    /*------ CONTRACT VARIABLES ------*/
    IWorldID public worldIdRouter;
    mapping(address => bool) public isAdmin;
    mapping(address => bool) public isWorldIdVerified;
    address[] public allVotingTopics;

    /*------ EVENTS ------*/
    event SetAdmin(address admin, bool isAdmin);
    event NewVotingTopic(address indexed votingAddress, string votingTopic, uint256 startTime, uint256 endTime);

    /*------ MODIFIER ------*/

    modifier onlyAdmin() {
        require(isAdmin[msg.sender] || msg.sender == owner(), "VotingGovernance: Not Admin");
        _;
    }

    /*------ CONSTRUCTOR ------*/

    constructor(address _worldIdRouter) {
        worldIdRouter = IWorldID(_worldIdRouter);
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
        emit NewVotingTopic(address(newVotingTopic), _votingTopic, _startTime, _endTime);
    }

    function verifyUser(
        address _user,
        uint256 _root,
        uint256 _groupId,
        uint256 _signalHash,
        uint256 _nullifierHash,
        uint256 _externalNullifierHash,
        uint256[8] calldata _proof
    ) external {
        // worldIdRouter.verifyProof(_root, _groupId, _signalHash, _nullifierHash, _externalNullifierHash, _proof);
        // isWorldIdVerified[_user] = true;
        try worldIdRouter.verifyProof(_root, _groupId, _signalHash, _nullifierHash, _externalNullifierHash, _proof) {
            isWorldIdVerified[_user] = true;
        } catch Error(string memory reason) {
            revert(reason);
        }
    }

    /*------ VIEW FUNCTIONS ------*/
    function isUserWorldIdVerified(address _user) public view returns (bool) {
        return isWorldIdVerified[_user];
    }

    function getAllVotiingTopics() public view returns (address[] memory) {
        return allVotingTopics;
    }
}
