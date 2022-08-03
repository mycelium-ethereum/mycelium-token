const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mycelium Token Contract", function () {
  let signers, MYC;
  beforeEach(async () => {
    signers = await ethers.getSigners();

    const tokenFactory = await ethers.getContractFactory("MYCToken");
    MYC = await tokenFactory.deploy(signers[2].address, "Mycelium", "MYC");
  });

  describe("initialise", async () => {
    it("Should initialise correctly", async function () {
      const isDefaultAdmin = await MYC.hasRole(
        ethers.constants.HashZero,
        signers[2].address
      );
      const isMinter = await MYC.hasRole(
        ethers.utils.id("MINTER_ROLE"),
        signers[2].address
      );
      const isMinterPauser = await MYC.hasRole(
        ethers.utils.id("MINTING_PAUSER"),
        signers[2].address
      );

      expect(isDefaultAdmin).to.be.true;
      expect(isMinter).to.be.true;
      expect(isMinterPauser).to.be.true;
    });
  });

  describe("minting", async () => {
    it("allows minter role to mint if minting is NOT paused", async () => {
      let balBefore = await MYC.balanceOf(signers[5].address);
      let supplyBefore = await MYC.totalSupply();
      await MYC.connect(signers[2]).mint(
        signers[5].address,
        ethers.utils.parseEther("100")
      );
      let balAfter = await MYC.balanceOf(signers[5].address);
      let supplyAfter = await MYC.totalSupply();

      expect(balAfter.sub(balBefore).toString()).to.equal(
        ethers.utils.parseEther("100").toString()
      );
      expect(supplyAfter.sub(supplyBefore).toString()).to.equal(
        ethers.utils.parseEther("100").toString()
      );
    });

    it("reverts if minting is paused", async () => {
      await MYC.connect(signers[2]).setMintingPaused(true);
      await expect(
        MYC.connect(signers[2]).mint(
          signers[5].address,
          ethers.utils.parseEther("100")
        )
      ).to.be.revertedWith("MYC:MINTING_PAUSED");
    });

    it("reverts if non minter role", async () => {
      await expect(
        MYC.connect(signers[3]).mint(
          signers[5].address,
          ethers.utils.parseEther("100")
        )
      ).to.be.revertedWith("MYC:NOT_MINTER");
    });
  });

  describe("setMintingPaused", async () => {
    it("allows the default admin to pause minting", async () => {
      let isMintingPaused = await MYC.mintingPaused();
      await MYC.connect(signers[2]).setMintingPaused(true);
      let isMintingPausedAfter = await MYC.mintingPaused();
      expect(isMintingPaused).to.be.false;
      expect(isMintingPausedAfter).to.be.true;
    });

    it("allows the minting pauser to pause minting", async () => {
      await MYC.connect(signers[2]).grantRole(
        ethers.utils.id("MINTING_PAUSER"),
        signers[5].address
      );
      let isMintingPaused = await MYC.mintingPaused();
      await MYC.connect(signers[5]).setMintingPaused(true);
      let isMintingPausedAfter = await MYC.mintingPaused();
      expect(isMintingPaused).to.be.false;
      expect(isMintingPausedAfter).to.be.true;
    });

    it("reverts if non minting pauser or default admin", async () => {
      expect(MYC.connect(signers[7]).setMintingPaused(true)).to.be.revertedWith(
        "MYC:NOT_PAUSER"
      );
    });
  });
});