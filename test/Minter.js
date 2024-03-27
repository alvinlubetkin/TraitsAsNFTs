const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");
const { signMint } = require("../utils/signature");

describe("BackendMinter", function () {
  let accounts, nft, minter, deployer, user, invalidUser, signer;
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  beforeEach(async function () {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    user = accounts[1];
    invalidUser = accounts[9];
    signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY_HARDHAT);
    const fixture = await deployments.fixture(["Minter"]);
    nft = new ethers.Contract(
      fixture.ERC1155PandaTraits_Proxy.address,
      fixture.ERC1155PandaTraits_Implementation.abi,
      deployer
    );
    minter = new ethers.Contract(
      fixture.BackendMinter.address,
      fixture.BackendMinter.abi,
      deployer
    );
    let minterRole = await nft.MINTER_ROLE();
    await nft.connect(deployer).grantRole(minterRole, minter.target);
  });

  describe("Deployment", function () {
    it("Should initialize properly", async function () {
      expect(await minter.erc1155()).to.be.equal(nft.target);
      expect(await minter.mintStarted()).to.be.equal(false);
      expect(await minter.signerAddress()).to.be.equal(signer.address);
    });
  });
  describe("Update Functions", () => {
    it("setMintStarted() should function correctly", async () => {
      expect(await minter.connect(deployer).mintStarted()).to.be.equal(false);
      await minter.setMintStarted(true);
      expect(await minter.connect(deployer).mintStarted()).to.be.equal(true);
      await minter.setMintStarted(false);
      expect(await minter.connect(deployer).mintStarted()).to.be.equal(false);
    });
    it("setSignerAddress() should function correctly", async () => {
      expect(await minter.signerAddress()).to.not.be.equal(user.address);
      await minter.connect(deployer).setSignerAddress(user.address);
      expect(await minter.signerAddress()).to.be.equal(user.address);
    });
  });
  describe("Minting", () => {
    beforeEach(async () => {
      await minter.setMintStarted(true);
    });
    describe("Mint Functions", () => {
      it("mint() should revert with invalid signature", async () => {
        let nonce = Math.floor(Date.now() / 1000);
        let tokenId = 1;
        let network = await ethers.provider.getNetwork();
        let signature = await signMint(
          signer,
          minter.target,
          network.chainId,
          tokenId,
          user.address,
          nonce
        );
        await expect(
          minter.connect(invalidUser).mint(signature, tokenId, nonce)
        ).to.be.revertedWith("Invalid Signature");
      });
      it("mint() should revert if mint not started", async () => {
        let nonce = Math.floor(Date.now() / 1000);
        let tokenId = 1;
        let network = await ethers.provider.getNetwork();

        let signature = await signMint(
          signer,
          minter.target,
          network.chainId,
          tokenId,
          user.address,
          nonce
        );
        await minter.connect(deployer).setMintStarted(false);
        await expect(
          minter.connect(user).mint(signature, tokenId, nonce)
        ).to.be.revertedWith("Mint has not begun");
      });

      it("mint() should revert if signature already used", async () => {
        let nonce = Math.floor(Date.now() / 1000);
        let tokenId = 1;
        let network = await ethers.provider.getNetwork();
        let signature = await signMint(
          signer,
          minter.target,
          network.chainId,
          tokenId,
          user.address,
          nonce
        );
        await minter.connect(user).mint(signature, tokenId, nonce);
        await expect(
          minter.connect(user).mint(signature, tokenId, nonce)
        ).to.be.revertedWith("signature used");
      });
      it("mint() should revert if valid signature but invalid minter", async () => {
        let nonce = Math.floor(Date.now() / 1000);
        let tokenId = 1;
        let network = await ethers.provider.getNetwork();
        let signature = await signMint(
          signer,
          minter.target,
          network.chainId,
          tokenId,
          user.address,
          nonce
        );
        await expect(
          minter.connect(invalidUser).mint(signature, tokenId, nonce)
        ).to.be.revertedWith("Invalid Signature");
      });

      it("mint() should revert if valid signature but invalid tokenId", async () => {
        let nonce = Math.floor(Date.now() / 1000);
        let tokenId = 1;
        let network = await ethers.provider.getNetwork();
        let signature = await signMint(
          signer,
          minter.target,
          network.chainId,
          tokenId,
          user.address,
          nonce
        );
        await expect(
          minter.connect(user).mint(signature, tokenId + 1, nonce)
        ).to.be.revertedWith("Invalid Signature");
      });
      it("mint() should be succesful", async () => {
        let nonce = Math.floor(Date.now() / 1000);
        let tokenId = 1;
        let network = await ethers.provider.getNetwork();
        let signature = await signMint(
          signer,
          minter.target,
          network.chainId,
          tokenId,
          user.address,
          nonce
        );
        await minter.connect(user).mint(signature, tokenId, nonce);
        expect(await nft.balanceOf(user.address, tokenId)).to.be.equal(1);
      });
      it("mint() should be succesful for same tokenId second time", async () => {
        let nonce = Math.floor(Date.now() / 1000);
        let tokenId = 1;
        let network = await ethers.provider.getNetwork();
        let signature = await signMint(
          signer,
          minter.target,
          network.chainId,
          tokenId,
          user.address,
          nonce
        );
        await minter.connect(user).mint(signature, tokenId, nonce);
        nonce = nonce + 1;
        let sig2 = await signMint(
          signer,
          minter.target,
          network.chainId,
          tokenId,
          user.address,
          nonce
        );
        await minter.connect(user).mint(sig2, tokenId, nonce);
        expect(await nft.balanceOf(user.address, tokenId)).to.be.equal(2);
      });
    });
  });
});
