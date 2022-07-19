const { expect } = require("chai");

describe("NFT Contract", function () {
	it("Should not be able to mint NFT with zero balance", async function () {
		const [owner] = await ethers.getSigners();

		const Token = await ethers.getContractFactory("MexToken");

		const mexToken = await Token.deploy(owner.address, "Mycelium Token", "MEX");

		const MexNFT = await ethers.getContractFactory("MexNFT");

		// Start deployment, returning a promise that resolves to a contract object
		const mexNFT = await MexNFT.deploy(mexToken.address);

		const tokenURI = {
			name: "Mycelium Mint NFT",
			description:
				"Congratulations on migrating from TCR to MEX, the future is bright",
			image: "./favicon.ico",
		};

		const nft = await mexNFT.mintNFT(tokenURI.toString());

		expect(nft).to.equal("You cannot mint if you do not hold MEX");
	});
});
