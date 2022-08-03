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
    function mint(address to, uint amount) external;
}
contract TokenMigration is AccessControl { 

    IERC20 public immutable myc;
    IERC20 public immutable tcr;
    MigrationNFT public immutable nft;
    bool public mintingPaused;
    mapping (address => bool) public wallets;

    event Migrated(address,uint);

    constructor(
        address admin,
        address _myc,
        address _tcr,
        address _nft
    ) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        myc = IERC20(_myc);
        tcr = IERC20(_tcr);
        nft = MigrationNFT(_nft);
    }

    function setWallet(address recipient) private {
        wallets[recipient] = true;
    }

    function mintMyceliumNFT(address _to) internal notMinted(_to)
    {   
        setWallet(_to);
        nft.mintNFT(_to);
    }

    function pauseMinting() external {
         require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT_ADMIN");
         mintingPaused = true;
    }

    function resumeMinting() external {
         require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT_ADMIN");
         mintingPaused = false;
    }

    
    function withdrawTokens(address token) external isTCR(token) {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT_ADMIN");
        IERC20(token).transfer(msg.sender, IERC20(token).balanceOf(address(this)));
    }

    function migrateTo(uint amount, address to) external notPaused {
        require(to != address(0), "Migrating to 0 address");
        _migrate(amount, to, msg.sender);
    }
    
    function migrate(uint amount) external notPaused {
        _migrate(amount, msg.sender, msg.sender);
    }

    function _migrate(uint amount, address to, address from) internal notPaused {
        require(amount > 0, "Invalid migration amount");
        // todo: add counter for amount of tokens "burned" via migration
        bool success = tcr.transferFrom(from, address(this), amount);
        require(success, "TCR Transfer Error");
        IERC20Mintable(address(myc)).mint(to, amount);
        // todo: re add in NFT
        // mintMyceliumNFT(to);
    }
    
    modifier notMinted(address _to) {
      require(!wallets[_to], "Sender already has NFT");
      _;
    }

    modifier notPaused() {
        require(!mintingPaused);
        _;
    }

    modifier isTCR(address token){
        require(token == address(tcr), "Not TCR Address");
        _;
    }
}
