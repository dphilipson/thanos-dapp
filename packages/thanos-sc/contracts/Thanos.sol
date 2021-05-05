//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@chainlink/contracts/src/v0.7/dev/VRFConsumerBase.sol";

contract Thanos is VRFConsumerBase {
    enum SnapState {NOT_STARTED, IN_PROGRESS, DUSTED, ALIVE}

    bytes32 private keyHash;
    uint256 private fee;
    mapping(bytes32 => address) private snappers;
    mapping(address => SnapState) private results;

    event SnapStarted(bytes32 indexed requestId, address indexed snapper);
    event SnapResolved(
        bytes32 indexed requestId,
        address indexed snapper,
        bool indexed isDusted
    );

    constructor(
        address vrfCoordinator,
        address link,
        bytes32 _keyHash,
        uint256 _fee
    ) VRFConsumerBase(vrfCoordinator, link) {
        keyHash = _keyHash;
        fee = _fee;
    }

    function snap(uint256 userProvidedSeed) public {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK to pay the fee."
        );
        require(
            results[msg.sender] == SnapState.NOT_STARTED,
            "Already snapped."
        );
        bytes32 requestId = requestRandomness(keyHash, fee, userProvidedSeed);
        snappers[requestId] = msg.sender;
        results[msg.sender] = SnapState.IN_PROGRESS;
        emit SnapStarted(requestId, msg.sender);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        bool isDusted = randomness % 2 == 0;
        address snapper = snappers[requestId];
        results[snapper] = isDusted ? SnapState.DUSTED : SnapState.ALIVE;
        emit SnapResolved(requestId, snapper, isDusted);
    }

    function getSnapState() public view returns (SnapState) {
        return getSnapStateForAddress(msg.sender);
    }

    function getSnapStateForAddress(address addr)
        public
        view
        returns (SnapState)
    {
        return results[addr];
    }
}
