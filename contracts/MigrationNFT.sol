//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IMigrationNFT.sol";

contract MigrationNFT is ERC721URIStorage, Ownable, IMigrationNFT {

    uint256 public _tokenIds;
    string public uri;
    address public migrationContract;

    constructor(
        string memory _baseURI,
        address _migration
    ) ERC721("MyceliumMigrator", "MM-V1") {
        uri = _baseURI;
        migrationContract = _migration;
    }

    function setMinterAddress(address _migrateContract) external onlyOwner {
        migrationContract = _migrateContract;
    }
    
    function mintNFT(address _to) external {
        require(msg.sender == migrationContract, "MM-V1:NOT_MINTER");
        _safeMint(_to, _tokenIds);
        _setTokenURI(_tokenIds, uri);
        _tokenIds++;
    }
}
