require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
// toolbox for using chai assertions
require("@nomicfoundation/hardhat-toolbox");
// optimisooor
require("hardhat-gas-reporter");

const { API_URL, PRIVATE_KEY } = process.env;

/** Edit gas prices for NFT */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 15,
    enabled: true,
    coinmarketcap: process.env.CMC_API
  }
};
