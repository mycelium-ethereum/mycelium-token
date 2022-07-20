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
    string nftURI = "https://ipfs.io/ipfs/QmcJ7gQR8D6iddZpZw1rqPk71JAE4tLwUnzfFktTDXiKZA";

    constructor() ERC721("MexNFT", "NFT") {}

    function setWallet(address recipient) private {
        Wallets[recipient]=true;
    }

    modifier notMinted(address recipient) {
      require(!Wallets[recipient], "Sender already has NFT");
      _;
    }

    /*
        Will be called from Front-end once Migrate call is complete. (should be unique to address)
        notMinted - prevents an address from minting multiple NFTS
        checkMexBalance - must have Mex token to call mintNFT Function.
    */
    function mintNFT()
        public notMinted(msg.sender)
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, nftURI);

        setWallet(msg.sender);
        return newItemId;
    }
}
