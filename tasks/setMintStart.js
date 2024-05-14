module.exports = async function (taskArgs, hre) {
  let contractName = "BackendMinter";
  const minter = await hre.ethers.getContract(contractName);
  const toSet = taskArgs.set == 0 || taskArgs.set == "false" ? false : true;

  try {
    console.log(
      ` calling setMintStarted() on ${contractName} {address: ${minter.target}}`
    );
    let tx = await minter.setMintStarted(toSet);
    console.log(` tx sent. {txHash: ${tx.hash}}`);
    console.log(` waiting for tx...`);
    const receipt = await tx.wait();
    const isSet = await minter.mintStarted();
    console.log(
      `✅ [${hre.network.name}] setMintStarted(). was set correctly: ${
        isSet == toSet
      }`
    );
  } catch (e) {
    console.log(`error: ${e}`);
  }
};
