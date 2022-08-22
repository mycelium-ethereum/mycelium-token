const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Arbitrum Migration Contract", function () {
  let signers, TCR, MYC, migrationContract;
  beforeEach(async () => {
    signers = await ethers.getSigners();

    const tokenFactory = await ethers.getContractFactory("TestToken");
    TCR = await tokenFactory.deploy("Tracer", "TCR");
    MYC = await tokenFactory.deploy("Mycelium", "MYC");
    const NFTFactory = await ethers.getContractFactory("MigrationNFT");

    const migrationFactory = await ethers.getContractFactory(
      "ArbitrumTokenMigration"
    );
    migrationContract = await migrationFactory.deploy(
      signers[2].address,
      MYC.address,
      TCR.address
    );

    // deploy and link NFT
    let baseURI = "google.com";
    NFT = await NFTFactory.deploy("Mycelium Migration NFT", "MM-V1", baseURI);
    await NFT.grantRole(
      ethers.utils.id("MINTER_ROLE"),
      migrationContract.address
    );
    await migrationContract.connect(signers[2]).setNFTContract(NFT.address);
  });

  describe("initialise", async () => {
    it("Should initialise correctly", async function () {
      const myc = await migrationContract.myc();
      const tcr = await migrationContract.tcr();
      const isAdmin = await migrationContract.hasRole(
        ethers.constants.HashZero,
        signers[2].address
      );
      expect(myc).to.equal(MYC.address);
      expect(tcr).to.equal(TCR.address);
      expect(isAdmin).to.be.true;
    });
  });

  describe("migration", async () => {
    beforeEach(async () => {
      // mint TCR to account 3
      await TCR.mint(signers[3].address, ethers.utils.parseEther("100"));

      // supply tokens to the arbitrum contract
      await MYC.mint(migrationContract.address, ethers.utils.parseEther("100"));
    });

    it("migrates to msg.sender if no to address provided", async () => {
      let MYCBalBefore = await MYC.balanceOf(signers[3].address);
      await TCR.connect(signers[3]).approve(
        migrationContract.address,
        ethers.utils.parseEther("100")
      );
      await migrationContract
        .connect(signers[3])
        .migrate(ethers.utils.parseEther("100"));
      let MYCBalAfter = await MYC.balanceOf(signers[3].address);
      let diffBal = MYCBalAfter.sub(MYCBalBefore);
      expect(diffBal.toString()).to.equal(
        ethers.utils.parseEther("100").toString()
      );
    });

    it("migrates to the to address", async () => {
      let MYCBalBefore = await MYC.balanceOf(signers[4].address);
      await TCR.connect(signers[3]).approve(
        migrationContract.address,
        ethers.utils.parseEther("100")
      );
      await migrationContract
        .connect(signers[3])
        .migrateTo(ethers.utils.parseEther("100"), signers[4].address);
      let MYCBalAfter = await MYC.balanceOf(signers[4].address);
      let diffBal = MYCBalAfter.sub(MYCBalBefore);
      expect(diffBal.toString()).to.equal(
        ethers.utils.parseEther("100").toString()
      );
    });

    it("reverts if no approval", async () => {
      await expect(
        migrationContract
          .connect(signers[3])
          .migrateTo(ethers.utils.parseEther("100"), signers[4].address)
      ).to.be.reverted;
    });

    it("reverts if amount < 0", async () => {
      await expect(
        migrationContract
          .connect(signers[3])
          .migrateTo(ethers.utils.parseEther("0"), signers[4].address)
      ).to.be.revertedWith("INVALID_AMOUNT");
    });

    it("reverts if there is insufficient MYC balance", async () => {
      await TCR.mint(signers[3].address, ethers.utils.parseEther("250"));
      await TCR.connect(signers[3]).approve(
        migrationContract.address,
        ethers.utils.parseEther("250")
      );
      await expect(
        migrationContract
          .connect(signers[3])
          .migrate(ethers.utils.parseEther("250"))
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("mints an NFT", async () => {
      // migrate
      await TCR.connect(signers[3]).approve(
        migrationContract.address,
        ethers.utils.parseEther("100")
      );
      await migrationContract
        .connect(signers[3])
        .migrate(ethers.utils.parseEther("100"));

      // signer 3 has 1 token
      let balOf = await NFT.balanceOf(signers[3].address);
      expect(balOf.toString()).to.equal("1");

      let ownerOfAfter = await NFT.ownerOf(0);
      expect(ownerOfAfter).to.equal(signers[3].address);
    });
  });

  describe("setNFTContract", async () => {
    it("sets the NFT contract", async () => {
      await migrationContract
        .connect(signers[2])
        .setNFTContract(signers[5].address);
      let nftContract = await migrationContract.nft();
      expect(nftContract).to.equal(signers[5].address);
    });

    it("reverts if not admin", async () => {
      await expect(
        migrationContract.connect(signers[3]).setNFTContract(signers[4].address)
      ).to.be.revertedWith("NOT_ADMIN");
    });
  });

  describe("withdrawTokens", async () => {
    it("supports withdrawing excess MYC", async () => {
      // supply tokens to the arbitrum contract
      await MYC.mint(migrationContract.address, ethers.utils.parseEther("100"));
      let balanceBefore = await MYC.balanceOf(migrationContract.address);
      await migrationContract.connect(signers[2]).withdrawTokens(MYC.address);
      let balanceAfter = await MYC.balanceOf(migrationContract.address);
      let diff = balanceBefore.sub(balanceAfter);
      expect(balanceAfter.toString()).to.equal(
        ethers.utils.parseEther("0").toString()
      );
      expect(diff.toString()).to.equal(
        ethers.utils.parseEther("100").toString()
      );
    });
  });
});
