// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IVotingGovernance {
    /*------ VIEW FUNCTIONS ------*/
    function isUserWorldIdVerified(address _user) external view returns (bool);
}
