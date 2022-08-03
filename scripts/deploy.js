async function main() {
  /*
		NFT Deployment
	*/
  const MexNFT = await ethers.getContractFactory("MexNFT");
  const mexNFT = await MexNFT.deploy();
  await mexNFT.deployed();
  console.log("NFT Deployed ", mexNFT.address);

  /*
		Tracer Deployment
	*/
  const TracerToken = await ethers.getContractFactory("MexToken");
  const tracerToken = await TracerToken.deploy(
    "0xfb59B91646cd0890F3E5343384FEb746989B66C7",
    "Tracer",
    "TCR"
  );
  await tracerToken.deployed();
  console.log("Tracer Token Deployed ", tracerToken.address);

  /*
		Mex Deployment
	*/
  const MexToken = await ethers.getContractFactory("MexToken");
  const mexToken = await MexToken.deploy(
    "0xfb59B91646cd0890F3E5343384FEb746989B66C7",
    "Mycelium Token",
    "Mex"
  );
  await mexToken.deployed();
  console.log("Mex Token Deployed ", mexToken.address);

  /*
		NFT Deployment
	*/
  const MigrationContract = await ethers.getContractFactory("MexMigration");
  const migrationContract = await MigrationContract.deploy(
    "0xfb59B91646cd0890F3E5343384FEb746989B66C7",
    tracerToken.address,
    mexToken.address,
    mexNFT.address
  );
  await migrationContract.deployed();
  console.log("Migration Contract deployed ", migrationContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
