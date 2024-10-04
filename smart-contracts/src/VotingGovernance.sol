// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {VotingTopic} from "./VotingTopic.sol";

contract VotingGovernance is Ownable {
    /*------ CONTRACT VARIABLES ------*/
    mapping(address => bool) isAdmin;
    mapping(address => bool) isWorldIdVerified;

    /*------ EVENTS ------*/
    event SetAdmin(address admin, bool isAdmin);
    event NewVotingTopic(address indexed votingAddress, string votingTopic, uint256 startTime, uint256 endTime);

    /*------ MODIFIER ------*/

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "VotingGovernance: Not Admin");
        _;
    }

    /*------ CONSTRUCTOR ------*/

    constructor() Ownable(msg.sender) {}

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

    /*------ VIEW FUNCTIONS ------*/
    function isUserWorldIdVerified(address _user) public view returns (bool) {
        return isWorldIdVerified[_user];
    }
}
