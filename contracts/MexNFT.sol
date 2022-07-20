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
    address private migrateContract ;

    constructor(address _migrateContract) ERC721("MexNFT", "NFT") {
        migrateContract = _migrateContract;
    }

    
    modifier onlyCreator() {
        require(msg.sender == migrateContract, "Only migrate contract can call mint function"); // If it is incorrect here, it reverts.
        _;                       
    } 
    

    /*
        Called directly via migrate contract.
        notMinted - prevents an address from minting multiple NFTS
    */
    function mintNFT(address _to) external onlyCreator
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        _setTokenURI(newItemId, nftURI);

    }
}
