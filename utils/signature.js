async function signMint(
  signingKey,
  contractAddress,
  chainId,
  tokenId,
  userAddress,
  nonce
) {
  const domain = {
    name: "BackendMinter",
    version: "1",
    chainId: parseInt(chainId),
    verifyingContract: contractAddress,
  };

  const types = {
    Mint: [
      { name: "tokenId", type: "uint256" },
      { name: "user", type: "address" },
      { name: "nonce", type: "uint256" },
    ],
  };

  const sig = await signingKey.signTypedData(domain, types, {
    tokenId: tokenId,
    user: userAddress,
    nonce: nonce,
  });

  return sig;
}

exports.signMint = signMint;
