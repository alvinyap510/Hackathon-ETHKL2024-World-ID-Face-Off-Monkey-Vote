// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IVotingTopic {
    function votingEnded() external view returns (bool);

    function vote(uint8 _option) external;

    function optionVotes(uint8 _option) external view returns (bool);
}
