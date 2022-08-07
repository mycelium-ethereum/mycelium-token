// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MYCToken is AccessControl, ERC20, ERC20Burnable {
    // access control
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MINTING_PAUSER = keccak256("MINTING_PAUSER");
    bool public mintingPaused;

    event mintingStateChange(bool newValue);

    constructor(
        address admin,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MINTER_ROLE, admin);
        _setupRole(MINTING_PAUSER, admin);
    }

    /**
    * @notice allows the MINTING_PAUSER or ADMIN to pause minting of the token. Prevents all permissioned
    * parties from calling the mint function. Emits a mintingStateChange event
    * @param value whether or not minting should be paused.
    */
    function setMintingPaused(bool value) external {
        require(
            hasRole(MINTING_PAUSER, msg.sender) ||
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "MYC:NOT_PAUSER"
        );
        mintingPaused = value;
        emit mintingStateChange(value);
    }

    /**
    * @notice mints MYC tokens to a set address. Must have the MINTER role to perform minting.
    * @param to the receiver of tokens
    * @param amount the amount of tokens to be minted
    */
    function mint(address to, uint256 amount) external {
        require(!mintingPaused, "MYC:MINTING_PAUSED");
        require(hasRole(MINTER_ROLE, msg.sender), "MYC:NOT_MINTER");
        _mint(to, amount);
    }
}
