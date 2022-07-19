//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MexNFT is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    mapping (address => bool) public Wallets;
    IERC20 mexToken;

    constructor(address _mexToken) ERC721("MexNFT", "NFT") {
        mexToken = IERC20(_mexToken);
    }

    function setWallet(address recipient) private {
        Wallets[recipient]=true;
    }

    modifier notMinted(address recipient) {
      require(!Wallets[recipient], "Sender already has NFT");
      _;
    }

    modifier checkMexBalance(address recipient) {
      require(mexToken.balanceOf(msg.sender) > 0, "You cannot mint if you do not hold MEX");
      _;
    }

    /*
        Will be called from Front-end once Migrate call is complete. (should be unique to address)
        notMinted - prevents an address from minting multiple NFTS
        checkMexBalance - must have Mex token to call mintNFT Function.
    */
    function mintNFT(string memory tokenURI)
        public notMinted(msg.sender) checkMexBalance(msg.sender)
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        setWallet(msg.sender);
        return newItemId;
    }
}
