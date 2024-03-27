require("dotenv").config({ path: "./.env" });
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");
require("@openzeppelin/hardhat-upgrades");
// require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

function accounts(chainKey) {
  if (chainKey == 1) {
    return [process.env.PRIVATE_KEY];
  } else {
    return [process.env.PRIVATE_KEY_RINKEBY];
  }
}
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false,
  },

  namedAccounts: {
    deployer: {
      default: 0, // wallet address 0, of the mnemonic in .env
    },
  },

  etherscan: {
    // apiKey: "BE2S5CGR2C35TKRQP3NUA3JV46XYCBQIGG",
    // eth,
    // apiKey: "EKIQVVD96BA5K7H4A4KW2YP4H4F2DTZD4T", //avax
    apiKey: "7MS9QB3V5D52ZUX8VMZ6667UZA8K9IZI8G", //fantom
    // apiKey: "EK9EU3XX4WQHVGAGAQS9EADV42Z8VPDE1T", //bsc
    // apiKey: "1WBRWETBD931KRDVNV22EYVE3T75BTKPAQ", //optimism
    // apiKey: "67HQUVZ7JZIVYJNYFFQF3VKKYAW5RNH982", // arbitrum
    // apiKey: "QKET9AHGG7URAKCN915ASU9429M5ABZ9B8", //polygon
  },
  networks: {
    ethereum: {
      url: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      chainId: 1,
      accounts: accounts(1),
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org",
      chainId: 56,
      accounts: accounts(1),
    },
    avalanche: {
      url: `https://api.avax.network/ext/bc/C/rpc`, //`https://speedy-nodes-nyc.moralis.io/ef1e54cd268c13ddf785f6bf/avalanche/mainnet`,
      chainId: 43114,
      accounts: accounts(1),
    },
    polygon: {
      url: "https://polygon-rpc.com",
      chainId: 137,
      accounts: accounts(1),
    },
    arbitrum: {
      url: `https://arb1.arbitrum.io/rpc`,
      chainId: 42161,
      accounts: accounts(1),
    },
    optimism: {
      url: `https://mainnet.optimism.io`,
      chainId: 10,
      accounts: accounts(1),
    },
    fantom: {
      url: `https://rpc.ftm.tools/`,
      chainId: 250,
      accounts: accounts(1),
    },
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com	",
      chainId: 11155111,
      accounts: accounts(4),
    },
    "bsc-testnet": {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: accounts(),
    },
    fuji: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      chainId: 43113,
      accounts: accounts(),
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      chainId: 80001,
      accounts: accounts(4),
    },
    "arbitrum-rinkeby": {
      url: `https://rinkeby.arbitrum.io/rpc`,
      chainId: 421611,
      accounts: accounts(),
    },
    "optimism-kovan": {
      url: `https://kovan.optimism.io/`,
      chainId: 69,
      accounts: accounts(),
    },
    "fantom-testnet": {
      url: `https://rpc.testnet.fantom.network/`,
      chainId: 4002,
      accounts: accounts(),
    },
  },
};
