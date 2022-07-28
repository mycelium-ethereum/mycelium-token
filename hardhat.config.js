/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY } = process.env;

/** Edit gas prices for NFT */
module.exports = {
	solidity: "0.8.9",
	defaultNetwork: "rinkeby",
	networks: {
		hardhat: {},
		rinkeby: {
			url: API_URL,
			accounts: [`0x${PRIVATE_KEY}`],
			gas: 2100000,
			gasPrice: 8000000000,
		},
	},
};
