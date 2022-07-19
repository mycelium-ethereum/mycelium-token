//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MexNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping (address => bool) public Wallets;

    constructor() ERC721("MexNFT", "NFT") {}

    function setWallet(address recipient) private {
        Wallets[recipient]=true;
    }

    modifier notMinted(address recipient) {
      require(!Wallets[recipient], "Sender already has NFT");
      _;
    }

    /*
        Ownable introduced so only migration contract can call function.
        Will be called from Front-end once Migrate call is complete. (should be unique to address)
        notMinted - prevents an address from minting multiple NFTS
    */
    function mintNFT(address recipient, string memory tokenURI)
        public onlyOwner notMinted(recipient)
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        setWallet(recipient);
        return newItemId;
    }
}
