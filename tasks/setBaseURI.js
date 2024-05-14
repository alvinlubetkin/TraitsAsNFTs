module.exports = async function (taskArgs, hre) {
  let contractName = "ERC1155PandaTraits";
  const contract = await hre.ethers.getContract(contractName);

  try {
    console.log(
      ` calling setURI() on ${contractName} {address: ${contract.target}}`
    );
    let tx = await contract.setURI(taskArgs.uri);
    console.log(` tx sent. {txHash: ${tx.hash}}`);
    console.log(`params: {
      uri: ${taskArgs.uri}
    }`);
    console.log(` waiting for tx...`);
    const receipt = await tx.wait();
    // const isSet = await contract.uri(taskArgs.id);
    // console.log(
    //   `✅ [${hre.network.name}] uri(). was set correctly: ${
    //     isSet == taskArgs.uri
    //   }`
    // );
  } catch (e) {
    console.log(`error: ${e}`);
  }
};
