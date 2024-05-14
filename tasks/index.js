const { task } = require("hardhat/config");

task(
  "mintSignature",
  "mints token with a provided signature, tokenId, and nonce",
  require("./mintSignature")
)
  .addParam("signature", "full signature hash")
  .addParam("id", "tokenId used for signature")
  .addParam("nonce", "nonce for signature");

task(
  "setBaseURI",
  "mints token with a provided signature, tokenId, and nonce",
  require("./setBaseURI")
).addParam("uri", "the custom uri to be set for the tokenId");
task(
  "setCustomMetadata",
  "mints token with a provided signature, tokenId, and nonce",
  require("./setCustomMetadata")
)
  .addParam("id", "tokenId to set uri for")
  .addParam("uri", "the custom uri to be set for the tokenId");
task(
  "setMintStart",
  "mints token with a provided signature, tokenId, and nonce",
  require("./setMintStart")
).addParam("set", "true or false");

task("grantMinterRole", "grants the minter role", require("./grantMinterRole"));
