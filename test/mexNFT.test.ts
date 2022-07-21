import { expect, use } from "chai";
import { Contract } from "ethers";
import { solidityKeccak256 } from "ethers/lib/utils";
import { deployContract, MockProvider, solidity } from "ethereum-waffle";
import MexNFTContract from "../build/MexNFT.json";
import MigrateContract from "../build/MexMigration.json";
import MexTokenContract from "../build/MexToken.json";

use(solidity);

const DEFAULT_ADMIN_ROLE =
	"0x0000000000000000000000000000000000000000000000000000000000000000";
const MINTER_ROLE = solidityKeccak256(["string"], ["MINTER_ROLE"]);

export const MigrateContractAddress =
	"0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
describe("MexNFT", function () {
	const [owner, _to] = new MockProvider().getWallets();
	let MexNFT: Contract;
	let Migrate: Contract;
	let MexToken: Contract;

	before("setup signers", async () => {
		MexToken = await deployContract(owner, MexTokenContract, [
			owner.address,
			"Mycelium Token",
			"MEX",
		]);

		MexNFT = await deployContract(owner, MexNFTContract, []);

		Migrate = await deployContract(owner, MigrateContract, [
			owner.address,
			MexToken.address,
			MigrateContractAddress,
			MexNFT.address,
		]);
	});

	describe("Mint Function", () => {
		it("Reverts as only migrate contract can call mint function", async () => {
			await expect(MexNFT.mintNFT(_to.address)).to.be.reverted;
		});

		it("Minter Address not set", async () => {
			await expect(Migrate.mintMyceliumNFT(_to.address)).to.be.reverted;
		});

		it("Migrate Contract Shouldn't be able to mint as balance < 0.", async () => {
			await MexNFT.setMinterAddress(Migrate.address);
			await expect(Migrate.mintMyceliumNFT(_to.address)).to.be.reverted;
		});

		it("Migrate Contract Should be able to mint ", async () => {
			//Will need to add mex balance to make sure this works.
			// add mex token.
			await MexToken.connect(owner).grantRole(MINTER_ROLE, _to.address);
			await MexToken.mint(_to.address, 1000);
			await MexNFT.setMinterAddress(Migrate.address);
			await expect(Migrate.mintMyceliumNFT(_to.address)).to.be.ok;
		});
	});
});
