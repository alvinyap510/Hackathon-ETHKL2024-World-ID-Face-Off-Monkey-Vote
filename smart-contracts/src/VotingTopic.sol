// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IVotingGovernance} from "./interfaces/IVotingGovernance.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract VotingTopic is Ownable {
    /*------ CONTRACT VARIABLES ------*/

    IVotingGovernance public votingGovernance;
    string public votingTopic;
    uint256 public startTime;
    uint256 public endTime;
    uint8 public totalOptions;
    Option[] public options;
    FaceOff[] public faceOffPairs;

    /*------ DATATYPES ------*/

    struct Option {
        string optionName;
        uint256 wins;
        uint256 loses;
    }

    struct FaceOff {
        string optionOne;
        uint256 indexOptionOne;
        string optionTwo;
        uint256 indexOptionTwo;
        mapping(address => bool) userHasVoted;
    }

    enum VoteFaceOff {
        VoteOptionOne,
        VoteOptionTwo
    }

    /*------ MODIFIER ------*/

    modifier onlyWorldIdVerified() {
        require(votingGovernance.isUserWorldIdVerified(msg.sender), "VotingTopic: User not World ID verified");
        _;
    }

    modifier onlyVotingIsActive() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "VotingTopic: Voting is not active.");
        _;
    }

    /*------ CONSTRUCTOR ------*/

    constructor(string memory _votingTopic, uint256 _startTime, uint256 _endTime, string[] memory _optionsArray) {
        require(_optionsArray.length <= 20, "VotingTopic: Too many options"); // 20 options will generate 190 face off pairs
        votingGovernance = IVotingGovernance(msg.sender);
        votingTopic = _votingTopic;
        startTime = _startTime;
        endTime = _endTime;

        // Store all options

        for (uint256 i = 0; i < _optionsArray.length; i++) {
            options.push(Option(_optionsArray[i], 0, 0));
            totalOptions += 1;
        }

        // Generate all faceoffs

        for (uint256 i = 0; i < options.length; i++) {
            for (uint256 j = i + 1; j < options.length; j++) {
                faceOffPairs.push();
                FaceOff storage newFaceOff = faceOffPairs[faceOffPairs.length - 1];
                newFaceOff.optionOne = options[i].optionName;
                newFaceOff.indexOptionOne = i;
                newFaceOff.optionTwo = options[j].optionName;
                newFaceOff.indexOptionTwo = j;
            }
        }
    }

    /*------ FUNCTIONS ------*/

    // function addOption(string memory _optionName) external onlyOwner {
    //     require(block.timestamp < endTime, "VotingTopic: Voting already ended");
    //     options.push(Option(_optionName, 0, 0));
    //     totalOptions += 1;
    // }

    function vote(uint256 _faceOffIndex, VoteFaceOff _option) external onlyWorldIdVerified onlyVotingIsActive {
        require(_faceOffIndex < faceOffPairs.length, "VotingTopic: FaceOff index out of bound.");
        require(
            !faceOffPairs[_faceOffIndex].userHasVoted[msg.sender],
            "VotingTopic: User has already voted on this face-off."
        );

        if (_option == VoteFaceOff.VoteOptionOne) {
            options[faceOffPairs[_faceOffIndex].indexOptionOne].wins++;
            options[faceOffPairs[_faceOffIndex].indexOptionTwo].loses++;
        } else {
            options[faceOffPairs[_faceOffIndex].indexOptionTwo].wins++;
            options[faceOffPairs[_faceOffIndex].indexOptionOne].loses++;
        }
        faceOffPairs[_faceOffIndex].userHasVoted[msg.sender] = true;
    }

    function batchVote(uint256[] calldata _faceOffIndices, VoteFaceOff[] calldata _options)
        external
        onlyWorldIdVerified
        onlyVotingIsActive
    {
        require(_faceOffIndices.length == _options.length, "VotingTopic: Mismatched input arrays");

        for (uint256 i = 0; i < _faceOffIndices.length; i++) {
            uint256 faceOffIndex = _faceOffIndices[i];
            require(faceOffIndex < faceOffPairs.length, "VotingTopic: FaceOff index out of bound.");
            require(
                !faceOffPairs[faceOffIndex].userHasVoted[msg.sender],
                "VotingTopic: User has already voted on this face-off."
            );

            if (_options[i] == VoteFaceOff.VoteOptionOne) {
                options[faceOffPairs[faceOffIndex].indexOptionOne].wins++;
                options[faceOffPairs[faceOffIndex].indexOptionTwo].loses++;
            } else {
                options[faceOffPairs[faceOffIndex].indexOptionTwo].wins++;
                options[faceOffPairs[faceOffIndex].indexOptionOne].loses++;
            }
            faceOffPairs[faceOffIndex].userHasVoted[msg.sender] = true;
        }
    }

    /*------ VIEW FUNCTIONS ------*/

    function votingStarted() external view returns (bool) {
        return block.timestamp > startTime;
    }

    function votingEnded() external view returns (bool) {
        return block.timestamp > endTime;
    }

    function hasUserVotedOnFaceOff(uint256 _faceOffIndex, address _user) external view returns (bool) {
        require(_faceOffIndex < faceOffPairs.length, "VotingTopic: FaceOff index out of bound.");
        return faceOffPairs[_faceOffIndex].userHasVoted[_user];
    }

    function returnAllOptions() external view returns (Option[] memory _allOptions) {
        return options;
    }

    function readVotingTopic()
        external
        view
        returns (
            string memory _votingTopic,
            uint256 _startVoting,
            uint256 _endVoting,
            Option[] memory _options,
            uint256 _faceOffPairsLength
        )
    {
        return (votingTopic, startTime, endTime, options, faceOffPairs.length);
    }
}

