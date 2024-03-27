const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");

describe("ERC1155PandaTraits", function () {
  let accounts, nft, deployer, user, invalidUser;
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  beforeEach(async function () {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    user = accounts[1];
    invalidUser = accounts[9];
    const fixture = await deployments.fixture(["ERC1155PandaTraits"]);
    nft = new ethers.Contract(
      fixture.ERC1155PandaTraits.address,
      fixture.ERC1155PandaTraits.abi,
      deployer
    );
  });

  describe("Deployment", function () {
    it("Should initialize properly", async function () {
      expect(await nft.baseTokenURI()).to.be.equal("ipfs://");
    });

    it("Should assign deployer admin and minter roles", async () => {
      let adminRole = await nft.DEFAULT_ADMIN_ROLE();
      let mintRole = await nft.MINTER_ROLE();
      expect(await nft.hasRole(adminRole, deployer)).to.be.equal(
        true,
        "Admin role not set"
      );
      expect(await nft.hasRole(mintRole, deployer)).to.be.equal(
        true,
        "Minter role not set"
      );
    });
  });
  describe("Functions", () => {
    describe("View Functions", () => {
      it("uri() should return baseTokenURI appended with tokenId", async () => {
        expect(await nft.uri(99)).to.be.equal(`ipfs://${99}`);
      });
      it("uri() should return customMetadata if exists", async () => {
        let tokenId = 99;
        let testUri = "ipfs://testing";
        await nft.setCustomMetadata(tokenId, testUri);
        expect(await nft.uri(tokenId)).to.be.equal(testUri);
      });
    });
    describe("Update Functions", () => {
      it("setCustomMetadata() should function correctly", async () => {
        let customUri = "ifps://custom";
        let tokenId = 99;
        expect(await nft.uri(tokenId)).to.not.be.equal(
          customUri,
          "custom uri is already set"
        );

        await nft.setCustomMetadata(tokenId, customUri);

        expect(await nft.uri(tokenId)).to.be.equal(customUri);
      });
      it("setCustomMetadataBatch() should function correctly", async () => {
        let tokenIds = [99, 100, 101];
        let customUris = ["ipfs://custom", "ipfs://custom2", "ipfs://custom3"];
        await nft.setCustomMetadataBatch(tokenIds, customUris);
        for (let index = 0; index < tokenIds.length; index++) {
          let tokenId = tokenIds[index];
          let customUri = customUris[index];
          expect(await nft.uri(tokenId)).to.be.equal(
            customUri,
            "error testing setCustomMetadataBatch()"
          );
        }
      });

      it("unsetCustomMetadata() should function correctly", async () => {
        let customUri = "ifps://custom";
        let tokenId = 99;
        await nft.setCustomMetadata(tokenId, customUri);

        expect(await nft.uri(tokenId)).to.be.equal(customUri);
        await nft.unsetCustomMetadata(tokenId);
        expect(await nft.uri(tokenId)).to.be.not.equal(customUri);
      });
      it("setCustomMetadataBatch() should function correctly", async () => {
        let tokenIds = [99, 100, 101];
        let customUris = ["ipfs://custom", "ipfs://custom2", "ipfs://custom3"];
        await nft.setCustomMetadataBatch(tokenIds, customUris);
        for (let index = 0; index < tokenIds.length; index++) {
          let tokenId = tokenIds[index];
          let customUri = customUris[index];
          expect(await nft.uri(tokenId)).to.be.equal(
            customUri,
            "error testing setCustomMetadataBatch()"
          );
        }
        await nft.unsetCustomMetadataBatch(tokenIds);
        for (let index = 0; index < tokenIds.length; index++) {
          let tokenId = tokenIds[index];
          let customUri = customUris[index];
          expect(await nft.uri(tokenId)).to.be.not.equal(
            customUri,
            "error testing setCustomMetadataBatch()"
          );
        }
      });
    });
    describe("Mint Functions", () => {
      it("mint() should revert if not minter", async () => {
        await expect(
          nft.connect(invalidUser).mint(invalidUser.address, 1, 1)
        ).to.be.revertedWith("Must have minter role.");
      });

      it("mintBatch() should revert if not minter", async () => {
        await expect(
          nft.connect(invalidUser).mintBatch(invalidUser.address, [1], [1])
        ).to.be.revertedWith("Must have minter role.");
      });

      it("mint() should be succesful", async () => {
        let tokenId = 1;
        let quantity = 1;
        let tx = await nft
          .connect(deployer)
          .mint(deployer.address, tokenId, quantity);
        expect(await nft.balanceOf(deployer.address, tokenId)).to.be.equal(
          quantity
        );
      });
      it("mintBatch() should be succesful", async () => {
        let tokenIds = [1, 3, 9];
        let quantities = [1, 1, 4];
        let tx = await nft
          .connect(deployer)
          .mintBatch(user.address, tokenIds, quantities);
        for (let i = 0; i < tokenIds.length; i++) {
          let tokenId = tokenIds[i];
          let quantity = quantities[i];
          expect(await nft.balanceOf(user.address, tokenId)).to.be.equal(
            quantity
          );
        }
      });
      it("burn() should be succesful", async () => {
        let tokenId = 1;
        let quantity = 1;
        let tx = await nft
          .connect(deployer)
          .mint(deployer.address, tokenId, quantity);
        expect(await nft.balanceOf(deployer.address, tokenId)).to.be.equal(
          quantity
        );
        await nft.connect(deployer).burn(deployer.address, tokenId, quantity);
        expect(await nft.balanceOf(deployer.address, tokenId)).to.be.equal(0);
      });
      it("burnBatch() should be succesful", async () => {
        let tokenIds = [1, 3, 9];
        let quantities = [1, 1, 4];
        let tx = await nft
          .connect(deployer)
          .mintBatch(deployer.address, tokenIds, quantities);
        for (let i = 0; i < tokenIds.length; i++) {
          let tokenId = tokenIds[i];
          let quantity = quantities[i];
          expect(await nft.balanceOf(deployer.address, tokenId)).to.be.equal(
            quantity
          );
        }
        await nft
          .connect(deployer)
          .burnBatch(deployer.address, tokenIds, quantities);
        for (let i = 0; i < tokenIds.length; i++) {
          let tokenId = tokenIds[i];
          expect(await nft.balanceOf(deployer.address, tokenId)).to.be.equal(0);
        }
      });
    });
  });
});
