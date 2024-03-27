const CONFIG = require("../config/config.json");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  let signer = CONFIG[hre.network.name]?.signerAddress
    ? CONFIG[hre.network.name].signerAddress
    : CONFIG["sepolia"].signerAddress;
  let nft = await deployments.get("ERC1155PandaTraits");
  const deployLog = () => {
    console.log(`>>> your address: ${deployer}`);
    console.log(`hre.network.name: ${hre.network.name}`);
    console.log(
      `params: {
          nftAddress: ${nft.address},
          signerAddress: ${signer}
      }
        `
    );
  };
  hre.network.name == "hardhat" ? null : deployLog();
  await deploy("BackendMinter", {
    from: deployer,
    args: [nft.address, signer],
    log: true,
    waitConfirmations: 1,
  });
};

module.exports.tags = ["Minter"];
module.exports.dependencies = ["ERC1155PandaTraits"];
