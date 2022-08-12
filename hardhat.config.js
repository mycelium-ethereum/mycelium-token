require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
// toolbox for using chai assertions
require("@nomicfoundation/hardhat-toolbox");
// optimisooor
require("hardhat-gas-reporter");
require("hardhat-deploy");
require("@nomiclabs/hardhat-etherscan");

const ALCHEMY_TESTNET_API = process.env.ALCHEMY_TESTNET_API || "";
const TESTNET_PRIVATE_KEY =
  process.env.TESTNET_PRIVATE_KEY ||
  "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const ALCHEMY_ARB_MAINNET_API = process.env.ALCHEMY_ARB_MAINNET_API || "";
const ALCHEMY_MAINNET_API = process.env.ALCHEMY_MAINNET_API || "";
const MAINNET_PRIVATE_KEY =
  process.env.MAINNET_PRIVATE_KEY ||
  "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const CMC_API = process.env.CMC_API || "";
const ETHERSCAN_API = process.env.ETHERSCAN_API || "";
const ARBISCAN_API = process.env.ARBISCAN_API || "";

/** Edit gas prices for NFT */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    goerli: {
      url: ALCHEMY_TESTNET_API,
      accounts: [TESTNET_PRIVATE_KEY],
    },
    arbitrum: {
      url: ALCHEMY_ARB_MAINNET_API,
      accounts: [MAINNET_PRIVATE_KEY],
    },
    mainnet: {
      url: ALCHEMY_MAINNET_API,
      accounts: [MAINNET_PRIVATE_KEY],
    },
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 15,
    enabled: true,
    coinmarketcap: CMC_API,
  },
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
};
