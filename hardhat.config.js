/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
// toolbox for using chai assertions
require("@nomicfoundation/hardhat-toolbox");
const { API_URL, PRIVATE_KEY } = process.env;

/** Edit gas prices for NFT */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
  },
};
