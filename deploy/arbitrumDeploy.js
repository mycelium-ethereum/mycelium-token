module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  let arbMYC = "0xc74fe4c715510ec2f8c61d70d397b32043f55abe";
  let arbTCR = "0xA72159FC390f0E3C6D415e658264c7c4051E9b87";

  let migrationContract = await deploy("ArbitrumTokenMigration", {
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
module.exports.tags = ["ArbitrumDeploy"];
