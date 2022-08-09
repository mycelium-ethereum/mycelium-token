module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  // deploy test tokens

  let TCR = await deploy("TestToken", {
    from: deployer,
    args: ["TestTracer", "T-TCR"],
    log: true,
  });

  let MYC = await deploy("MYCToken", {
    from: deployer,
    args: [deployer, "TestMycelium", "T-MYC"],
    log: true,
  });

  let migrationContract = await deploy("TokenMigration", {
    from: deployer,
    args: [deployer, MYC.address, TCR.address],
    log: true,
  });

  // testing metadata link
  let baseURI = "ipfs://QmUgpr9fWJFThXyihXyFHnbskN3k9w5UcT7jLBaoXYU8KS";
  let nftContract = await deploy("MigrationNFT", {
    from: deployer,
    args: ["Test Mycelium Migration V2", "TMM", baseURI],
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

  // verify contracts to help with debugging
  await hre.run("verify:verify", {
    address: TCR.address,
    constructorArguments: ["TestTracer", "T-TCR"],
  });

  await hre.run("verify:verify", {
    address: MYC.address,
    constructorArguments: [deployer.address, "TestMycelium", "T-MYC"],
  });

  await hre.run("verify:verify", {
    address: migrationContract.address,
    constructorArguments: [deployer.address, MYC.address, TCR.address],
  });

  await hre.run("verify:verify", {
    address: nftContract.address,
    constructorArguments: [baseURI, migrationContract.address],
  });
};
module.exports.tags = ["TestingDeploy"];