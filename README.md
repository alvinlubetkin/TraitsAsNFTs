# Panda Traits as NFTS

## Basic Description

This contract will act as an on chain version of the traits held by Kanpai Pandas. Currently holders are able to manage their traits off chain at ppdex.io. Using these contracts holders will be able to remove a trait from their NFT and transfer it on chain to be sold/traded on marketplaces. Holders will also be able to move the traits back on to their NFTs by burning the tokenized version of the trait.

## Contracts

ERC1155PandaTraits.sol extends ERC1155UpgradeableBurnable. minting can only be performed if granted access

BackendMinter.sol uses EIP712 to allow minting of tokens on ERC1155PandaTraits only with approval from our backend.

TransparentUpgradeableProxy is used along with ProxyAdmin to make ERC1155PandaTraits upgradeable in the future if neccessary

## Utility

- `yarn hardhat test` to run basic tests

- `yarn hardhat deploy --network hardhat` to run test deployment
