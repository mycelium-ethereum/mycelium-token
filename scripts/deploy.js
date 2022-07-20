async function main() {
	const MexNFT = await ethers.getContractFactory("MexNFT");

	// Start deployment, returning a promise that resolves to a contract object
	const mexNFT = await MexNFT.deploy();

	await mexNFT.deployed();
	console.log("Contract deployed to address:", mexNFT.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
