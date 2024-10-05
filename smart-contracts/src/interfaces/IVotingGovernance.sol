// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IVotingGovernance {
    /*------ VIEW FUNCTIONS ------*/
    function isUserWorldIdVerified(address _user) external view returns (bool);
    function verifyUser(address _signal, uint256 _root, uint256 _nullifierHash, uint256[8] calldata _proof) external;
}
