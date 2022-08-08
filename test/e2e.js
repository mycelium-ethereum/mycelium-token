const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("End to end migration test", function () {
  let signers, TCR, MYC, migrationContract, NFT;
  beforeEach(async () => {
    signers = await ethers.getSigners();

    const tokenFactory = await ethers.getContractFactory("TestToken");
    const MYCTokenFactory = await ethers.getContractFactory("MYCToken");
    const NFTFactory = await ethers.getContractFactory("MigrationNFT");

    TCR = await tokenFactory.deploy("Tracer", "TCR");
    MYC = await MYCTokenFactory.deploy(signers[0].address, "Mycelium", "MYC");
    const migrationFactory = await ethers.getContractFactory("TokenMigration");
    migrationContract = await migrationFactory.deploy(
      signers[0].address,
      MYC.address,
      TCR.address
    );

    let baseURI = "google.com";
    NFT = await NFTFactory.deploy("Mycelium Migration NFT", "MM-V1", baseURI);
    await NFT.grantRole(ethers.utils.id("MINTER_ROLE"),  migrationContract.address)

    // link the migration contract and NFT
    await migrationContract.setNFTContract(NFT.address);
  });

  describe("end to end", async () => {
    beforeEach(async () => {
      // mint some sample TCR out
      for (var i = 3; i < 6; i++) {
        // mint TCR to account 3
        await TCR.mint(signers[i].address, ethers.utils.parseEther("100"));
      }
    });

    it("reverts if migration contract is not a minter", async () => {
      await TCR.connect(signers[3]).approve(
        migrationContract.address,
        ethers.utils.parseEther("100")
      );
      await expect(
        migrationContract
          .connect(signers[3])
          .migrate(ethers.utils.parseEther("50"))
      ).to.be.revertedWith("MYC:NOT_MINTER");
    });

    it("reverts if minting is paused on the token", async () => {
      // set the migration contract as a minter
      await MYC.grantRole(
        ethers.utils.id("MINTER_ROLE"),
        migrationContract.address
      );

      await MYC.setMintingPaused(true);

      await TCR.connect(signers[3]).approve(
        migrationContract.address,
        ethers.utils.parseEther("100")
      );
      await expect(
        migrationContract
          .connect(signers[3])
          .migrate(ethers.utils.parseEther("50"))
      ).to.be.revertedWith("MYC:MINTING_PAUSED");
    });

    it("reverts if minting is paused on the migration contract", async () => {});

    it("migrates tokens", async () => {
      // set the migration contract as a minter
      await MYC.grantRole(
        ethers.utils.id("MINTER_ROLE"),
        migrationContract.address
      );

      // perform migration
      let MYCBalBefore = await MYC.balanceOf(signers[3].address);
      let TCRBalBefore = await TCR.balanceOf(signers[3].address);
      await TCR.connect(signers[3]).approve(
        migrationContract.address,
        ethers.utils.parseEther("100")
      );
      await migrationContract
        .connect(signers[3])
        .migrate(ethers.utils.parseEther("50"));
      let MYCBalAfter = await MYC.balanceOf(signers[3].address);
      let TCRBalAfter = await TCR.balanceOf(signers[3].address);
      let diffBal = MYCBalAfter.sub(MYCBalBefore);
      let diffTCRBal = TCRBalBefore.sub(TCRBalAfter);
      expect(diffBal.toString()).to.equal(
        ethers.utils.parseEther("50").toString()
      );
      expect(diffTCRBal.toString()).to.equal(
        ethers.utils.parseEther("50").toString()
      );
    });
  });
});
