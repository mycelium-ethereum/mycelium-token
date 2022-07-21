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
import "./MexAccessControl.sol";
import "./interfaces/IMexToken.sol";
import "./MexNFT.sol";

contract MexMigration is MexAccessControl { 

    IMexToken mex;
    IERC20 tcr;
    MexNFT mexNFT;
    bool public mintingPaused;
    mapping (address => bool) public Wallets;

    event Migrated(address,uint);

    constructor(
        address admin,
        address _mex,
        address _tcr,
        address _mexNFT
    ) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        mex = IMexToken(_mex);
        tcr = IERC20(_tcr);
        mexNFT = MexNFT(_mexNFT);
    }


    function setWallet(address recipient) private {
        Wallets[recipient]=true;
    }

    modifier notMinted(address _to) {
      require(!Wallets[_to], "Sender already has NFT");
      _;
    }

    // Call directly from migrate function
    function mintMyceliumNFT(address _to) external notMinted(_to)
    {   
        require(mex.balanceOf(_to) > 0, "Have Not Migrated");
        mexNFT.mintNFT(_to);
        setWallet(_to);
    }
    

    modifier isMintingPaused() {
        require(!mintingPaused);

        _;
    }

    function pauseMinting() external {
         require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT_ADMIN");
         mintingPaused = true;
    }

    function resumeMinting() external {
         require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT_ADMIN");
         mintingPaused = false;
    }

    function withdrawTokens(address token)external{
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT_ADMIN");
       // IERC20(address).transfer(msg.sender, IERC20(address).balanceOf(IERC20((address))));
    }

    /*
    Will have to call mint function here and pass address of original caller as arg.
    function migrate()external isMintingPaused {
        require(tcr.balanceOf(msg.sender)> 0, "No TCR to migrate");
        bool success = tcr.transferFrom(msg.sender, this(address), tcr.balanceOf(msg.sender));
        require(success, "TCR could not be transfered to this contract, check allowance");
        if (mex.balanceOf(this(address)) != tcr.balanceOf(msg.sender)){
        mex.mint(this(address),tcr.balanceOf(msg.sender));
        mex.transfer(msg.sender, tcr.balanceOf(msg.sender));
        } else {
        mex.transfer(msg.sender, tcr.balanceOf(msg.sender)); 
        }
    }


    */
}
