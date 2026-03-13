// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title LaunchForgeToken
 * @notice Simple, immutable ERC-20 token.
 *         - Entire supply minted to creator at deployment.
 *         - No minting, burning, pausing, or upgradeability.
 *         - No admin privileges.
 */
contract LaunchForgeToken is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        address _creator
    ) ERC20(_name, _symbol) {
        require(_creator != address(0), "Invalid creator address");
        require(_totalSupply > 0, "Supply must be > 0");
        _mint(_creator, _totalSupply * 10 ** decimals());
    }
}
