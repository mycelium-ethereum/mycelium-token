import { expect, use } from "chai";
import { Contract } from "ethers";
import { deployContract, MockProvider, solidity } from "ethereum-waffle";
import MexNFTContract from "../build/MexNFT.json";
import MigrateContract from "../build/MexMigration.json";

use(solidity);

export const MigrateContractAddress =
	"0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
describe("MexNFT", function () {
	const [owner, _to] = new MockProvider().getWallets();
	let MexNFT: Contract;
	let Migrate: Contract;

	before("setup signers", async () => {
		Migrate = await deployContract(owner, MigrateContract, [
			owner.address,
			MigrateContractAddress,
			MigrateContractAddress,
		]);

		MexNFT = await deployContract(owner, MexNFTContract, [Migrate.address]);
	});

	describe("Mint Function", () => {
		it("Reverts as only migrate contract can call mint function", async () => {
			await expect(MexNFT.mintNFT(_to.address)).to.be.ok;
		});

		it("Reverts as only migrate contract can call mint function", async () => {
			await expect(MexNFT.mintNFT(ZERO_ADDRESS)).to.be.reverted;
		});
	});
});
