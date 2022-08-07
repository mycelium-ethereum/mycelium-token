// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IMigrationNFT.sol";

interface IERC20Mintable {
    function mint(address to, uint256 amount) external;
}

/**
* Migration contract supporting the transition from TCR to MYC.
* Allows users to call the `migrate` function, exchanging TCR to MYC at a 1:1 ratio.
* All burned TCR will be held in the contract.
*/
contract TokenMigration is AccessControl {
    IERC20 public immutable myc;
    IERC20 public immutable tcr;
    IMigrationNFT public nft;
    bool public mintingPaused;
    mapping(address => bool) public mintedNFT;
    // total amount of TCR successfully burned
    uint256 public burnedTCR;

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

    /**
    * @notice allows an admin to set the migration NFT contract address
    * @param _nft address to be used to mint the NFTs. Must support the 
    * IMigrationNFT interface
    */
    function setNFTContract(address _nft) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT_ADMIN");
        nft = IMigrationNFT(_nft);
    }

    /**
    * @notice allows an admin to enable and disable migration / minting
    */
    function setMintingPaused(bool state) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NOT_ADMIN");
        mintingPaused = state;
    }

    /**
    * @notice safety function to allow an admin to withdraw any tokens accidently sent to this contract.
    * @dev does not check if tokens were sent by mistake or properly migrated.
    */
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

    /**
    * @notice allows the exchange of TCR for MYC at a 1:1 ratio.
    * holds migrated TCR in this contract and mints fresh MYC to the to address.
    * @param amount the amount of TCR that is being burned
    * @param to the receiver of MYC
    * @param from the burner of TCR
    */
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
        burnedTCR += amount;
        IERC20Mintable(address(myc)).mint(to, amount);
        
        // issue NFT if this account has not yet migrated before
        if (!mintedNFT[to]) {
            mintedNFT[to] = true;
            nft.mintNFT(to);
        }
    }
}
