//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.7/dev/VRFConsumerBase.sol";

contract Thanos is VRFConsumerBase {
    enum SnapState {NOT_STARTED, IN_PROGRESS, DUSTED, ALIVE}

    bytes32 private s_keyHash;
    uint256 private s_fee;
    mapping(bytes32 => address) private s_snappers;
    mapping(address => SnapState) private s_results;

    event SnapStarted(bytes32 indexed requestId, address indexed snapper);
    event SnapResolved(
        bytes32 indexed requestId,
        address indexed snapper,
        bool indexed isDusted
    );

    constructor(
        address vrfCoordinator,
        address link,
        bytes32 keyHash,
        uint256 fee
    ) VRFConsumerBase(vrfCoordinator, link) {
        s_keyHash = keyHash;
        s_fee = fee;
    }

    function snap(uint256 userProvidedSeed) public {
        require(
            LINK.balanceOf(address(this)) >= s_fee,
            "Not enough LINK to pay the fee."
        );
        require(
            s_results[msg.sender] == SnapState.NOT_STARTED,
            "Already snapped."
        );
        bytes32 requestId =
            requestRandomness(s_keyHash, s_fee, userProvidedSeed);
        s_snappers[requestId] = msg.sender;
        s_results[msg.sender] = SnapState.IN_PROGRESS;
        emit SnapStarted(requestId, msg.sender);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        bool isDusted = randomness % 2 == 0;
        address snapper = s_snappers[requestId];
        s_results[snapper] = isDusted ? SnapState.DUSTED : SnapState.ALIVE;
        emit SnapResolved(requestId, snapper, isDusted);
    }

    function getSnapState() public view returns (SnapState) {
        return s_results[msg.sender];
    }
}
