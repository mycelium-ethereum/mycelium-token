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

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MexAccessControl.sol";
import "../interfaces/IMexToken.sol";

contract MexMigration is MexAccessControl { 

    IMexToken mex;
    IERC20 tcr;
    bool public mintingPaused;


    event Migrated(address,uint);

    constructor(
        address admin,
        address _mex,
        address _tcr
    ) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        mex = IERC20(_mex);
        tcr = IERC20(_tcr);
    }


    modifier isMintingPaused() {
        require(!mintingPaused);

        _;
    }

    function pauseMinting() {
         require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT_ADMIN");
         mintingPaused = true;
    }

    function resumeMinting() {
         require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT_ADMIN");
         mintingPaused = false;
    }


    function migrate()external isMintingPaused {
        require(tcr.balanceOf(msg.sender)> 0, "No TCR to migrate");
        bool success = tcr.transferFrom(msg.sender, this(address), tcr.balanceOf(msg.sender));
        require(success, "TCR could not be transfered to this contract, check allowance");
        if (mex.balanceOf(this(address)) !> tcr.balanceOf(msg.sender)){
        mex.mint(this(address),tcr.balanceOf(msg.sender))
        mex.transfer(msg.sender, tcr.balanceOf(msg.sender));
        } else {
        mex.transfer(msg.sender, tcr.balanceOf(msg.sender)); 
        }
    }



}