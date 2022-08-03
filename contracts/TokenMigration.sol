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

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./MigrationNFT.sol";

interface IERC20Mintable {
    function mint(address to, uint256 amount) external;
}

contract TokenMigration is AccessControl {
    IERC20 public immutable myc;
    IERC20 public immutable tcr;
    MigrationNFT public nft;
    bool public mintingPaused;
    mapping(address => bool) public mintedNFT;

    event Migrated(address, uint256);

    constructor(
        address admin,
        address _myc,
        address _tcr
    ) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        myc = IERC20(_myc);
        tcr = IERC20(_tcr);
    }

    function setNFTContract(address _nft) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT_ADMIN");
        nft = MigrationNFT(_nft);
    }

    function setMintingState(bool state) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT_ADMIN");
        mintingPaused = state;
    }

    function withdrawTokens(address token) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT_ADMIN");
        IERC20(token).transfer(
            msg.sender,
            IERC20(token).balanceOf(address(this))
        );
    }

    function migrateTo(uint256 amount, address to) external {
        require(to != address(0), "Migrating to 0 address");
        _migrate(amount, to, msg.sender);
    }

    function migrate(uint256 amount) external {
        _migrate(amount, msg.sender, msg.sender);
    }

    function _migrate(
        uint256 amount,
        address to,
        address from
    ) internal {
        require(!mintingPaused, "MINTING_PAUSED");
        require(amount > 0, "INVALID_AMOUNT");
        // todo: add counter for amount of tokens "burned" via migration
        bool success = tcr.transferFrom(from, address(this), amount);
        require(success, "XFER_ERROR");
        IERC20Mintable(address(myc)).mint(to, amount);
        
        // issue NFT if this account has not yet migrated before
        if (!mintedNFT[to]) {
            mintedNFT[to] = true;
            nft.mintNFT(to);
        }
    }
}
