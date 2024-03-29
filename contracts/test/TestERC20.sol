pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title An ERC20 token to be used testing
/// @dev Don't use this for anything real. There is no access control on mint and burn.
contract TestToken is ERC20 {
    uint8 internal _decimals = 18;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function setDecimals(uint8 newDecimals) external {
        _decimals = newDecimals;
    }
}