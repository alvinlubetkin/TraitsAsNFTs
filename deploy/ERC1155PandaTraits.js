const CONFIG = require("../config/config.json");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const deployLog = () => {
    console.log(`>>> your address: ${deployer}`);
    console.log(`hre.network.name: ${hre.network.name}`);
    console.log(
      `
        `
    );
  };
  hre.network.name == "hardhat" ? null : deployLog();
  await deploy("ERC1155PandaTraits", {
    from: deployer,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      owner: deployer,
      viaAdminContract: "ProxyAdmin",
      execute: {
        init: {
          methodName: "initialize",
          args: [CONFIG.BaseTokenURI],
        },
      },
    },
    log: true,
    waitConfirmations: 1,
  });
};

module.exports.tags = ["ERC1155PandaTraits"];
