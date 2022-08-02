// SPDX-License-Identifier: GPL-3.0-or-later
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MYCToken is AccessControl, ERC20, ERC20Burnable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MINTING_PAUSER = keccak256("MINTING_PAUSER");
    bool public mintingPaused;

    event Snapshot(uint256 id);

    constructor(
        address admin,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MINTER_ROLE, admin);
        _setupRole(MINTING_PAUSER, admin);
    }

    function setMintingPaused(bool value) external {
        require(
            hasRole(MINTING_PAUSER, msg.sender) ||
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "MYC:NOT_PAUSER"
        );
        mintingPaused = value;
    }

    function mint(address recipient, uint256 amount) external {
        require(!mintingPaused, "MYC:MINTING_PAUSED");
        require(hasRole(MINTER_ROLE, msg.sender), "MYC:NOT_MINTER");
        _mint(recipient, amount);
    }
}
