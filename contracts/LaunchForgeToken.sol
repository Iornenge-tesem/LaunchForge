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
    string private _metadataURI;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        address _creator,
        string memory _tokenMetadataURI
    ) ERC20(_name, _symbol) {
        require(_creator != address(0), "Invalid creator address");
        require(_totalSupply > 0, "Supply must be > 0");
        require(bytes(_tokenMetadataURI).length > 0, "Metadata URI required");

        _metadataURI = _tokenMetadataURI;
        _mint(_creator, _totalSupply * 10 ** decimals());
    }

    function tokenURI() external view returns (string memory) {
        return _metadataURI;
    }

    function contractURI() external view returns (string memory) {
        return _metadataURI;
    }
}
