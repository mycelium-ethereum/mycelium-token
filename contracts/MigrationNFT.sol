//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MigrationNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    mapping (address => bool) public Wallets;
    string nftURI = "https://ipfs.io/ipfs/QmcJ7gQR8D6iddZpZw1rqPk71JAE4tLwUnzfFktTDXiKZA";
    address private migrateContract;

    constructor() ERC721("MexNFT", "NFT") {}

    function setMinterAddress(address _migrateContract) external onlyOwner {
        migrateContract = _migrateContract;
    }

    modifier onlyCreator() {
        require(msg.sender == migrateContract, "caller not minter");
        _;                       
    } 
    
    function mintNFT(address _to) external onlyCreator
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        _setTokenURI(newItemId, nftURI);
    }
}
