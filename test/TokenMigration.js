const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Migration Contract", function () {
  let signers;

  it("Should initialise correctly", async function () {
    signers = await ethers.getSigners();

    const tokenFactory = await ethers.getContractFactory("TestToken");
    const TCR = await tokenFactory.deploy("Tracer", "TCR");
    const MYC = await tokenFactory.deploy("Mycelium", "MYC");

    const migrationFactory = await ethers.getContractFactory("TokenMigration");
    const migrationContract = await migrationFactory.deploy(
      signers[2].address,
      MYC.address,
      TCR.address,
      signers[1].address
    );

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
