module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  // todo: Migrate MYC and insert Arbitrum Token Address
  let arbMYC = "";
  let arbTCR = "";

  let migrationContract = await deploy("TokenMigration", {
    from: deployer,
    args: [deployer, arbMYC, arbTCR],
    log: true,
  });

  let baseURI = "ipfs://QmdiKqVLojYJYuFY5qSWhtQradjwSmDS5ARC5ysHZwxAeC";
  let nftContract = await deploy("MigrationNFT", {
    from: deployer,
    args: ["Mycelium OGs Arbitrum", "AMOGs", baseURI],
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
};
module.exports.tags = ["MainnetDeploy"];
