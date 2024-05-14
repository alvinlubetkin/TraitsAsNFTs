module.exports = async function (taskArgs, hre) {
  let contractName = "BackendMinter";
  const minter = await hre.ethers.getContract(contractName);
  let sig = taskArgs.signature;
  let tokenId = taskArgs.id;
  let nonce = taskArgs.nonce;

  try {
    console.log(
      ` calling mint() on ${contractName} {address: ${minter.target}}`
    );
    let tx = await minter.mint(sig, tokenId, nonce);
    console.log(` tx sent. {txHash: ${tx.hash}}`);
    console.log(` waiting for tx...`);
    const receipt = await tx.wait();
    console.log(receipt);
    console.log(`✅ [${hre.network.name}] mint(). tokenId: ${event.tokenId}`);
  } catch (e) {
    console.log(`error: ${e}`);
  }
};
