module.exports = async function (taskArgs, hre) {
  let contractName = "ERC1155PandaTraits";
  const contract = await hre.ethers.getContract(contractName);
  const minter = await hre.ethers.getContract("BackendMinter");

  try {
    let role = await contract.MINTER_ROLE();
    let check = await contract.hasRole(role, minter.target);
    if (!check) {
      console.log(
        ` calling grantRole on ${contractName} {address: ${contract.target}}`
      );
      let tx = await contract.grantRole(role, minter.target);
      console.log(` tx sent with params: {
            role: (MINTER_ROLE) ${role},
            user: ${minter.target}
        } `);
      console.log(` waiting for tx... {txHash: ${tx.hash}}`);
      await tx.wait();
      console.log(`✅ [${hre.network.name}] grantRole()`);
      check = await contract.hasRole(role, minter.target);
      check ? console.log("succesful.") : console.log("failed.");
    } else {
      console.log("role already set.");
    }
  } catch (e) {
    console.log(`error: ${e}`);
  }
};
