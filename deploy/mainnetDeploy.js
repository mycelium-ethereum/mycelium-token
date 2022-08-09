module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  // deploy test tokens

  // Mainnet TCR token
  let TCR = "0x9C4A4204B79dd291D6b6571C5BE8BbcD0622F050";

  // Deploy Mainnet MYC
  let MYC = await deploy("MYCToken", {
    from: deployer,
    args: [deployer, "Mycelium", "MYC"],
    log: true,
  });

  let migrationContract = await deploy("TokenMigration", {
    from: deployer,
    args: [deployer, MYC.address, TCR],
    log: true,
  });

  let baseURI = "ipfs://QmdiKqVLojYJYuFY5qSWhtQradjwSmDS5ARC5ysHZwxAeC";
  let nftContract = await deploy("MigrationNFT", {
    from: deployer,
    args: ["Mycelium OGs", "MOGs", baseURI],
    log: true,
  });

  // link the migration contract and NFT
  await execute(
    "TokenMigration",
    {
      from: deployer,
      // gasLimit: 100000000,
      log: true,
    },
    "setNFTContract",
    nftContract.address
  );

  // set the migration contract as a minter of MYC
  await execute(
    "MYCToken",
    {
      from: deployer,
      // gasLimit: 100000000,
      log: true,
    },
    "grantRole",
    ethers.utils.id("MINTER_ROLE"),
    migrationContract.address
  );

  // set the migration contract as a minter of NFTs
  await execute(
    "MigrationNFT",
    {
      from: deployer,
      // gasLimit: 100000000,
      log: true,
    },
    "grantRole",
    ethers.utils.id("MINTER_ROLE"),
    migrationContract.address
  );

  // verify contracts
  await hre.run("verify:verify", {
    address: MYC.address,
    constructorArguments: [deployer, "Mycelium", "MYC"],
  });

  await hre.run("verify:verify", {
    address: migrationContract.address,
    constructorArguments: [deployer.address, MYC.address, TCR],
  });

  await hre.run("verify:verify", {
    address: nftContract.address,
    constructorArguments: ["Mycelium OGs", "MOGs", baseURI],
  });
};
module.exports.tags = ["MainnetDeploy"];
