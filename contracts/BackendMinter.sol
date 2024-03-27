import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
interface IERC1155 {
    function mint(address to, uint tokenId, uint quantity) external virtual;
}

contract BackendMinter is AccessControl, EIP712 {
    using Strings for uint;

    bytes32 public constant MINTER_TYPEHASH = keccak256("Mint(uint256 tokenId,address user,uint256 nonce)");

    //must use different signerAddress per chain
    address public signerAddress;
    bool public mintStarted;
    IERC1155 public erc1155;

    mapping(bytes32 => bool) public signatureUsed;

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Must have admin role.");
        _;
    }

    modifier requiresSignature(
        bytes calldata signature,
        uint tokenId,  
        uint nonce
    ) {
        // Verify EIP-712 signature by recreating the data structure
        // that we signed on the client side, and then using that to recover
        // the address that signed the signature for this data.
        bytes32 structHash = keccak256(abi.encode(MINTER_TYPEHASH, tokenId, msg.sender, nonce));
        bytes32 digest = _hashTypedDataV4(structHash); /*Calculate EIP712 digest*/
        require(!signatureUsed[digest], "signature used");
        signatureUsed[digest] = true;
        // Use the recover method to see what address was used to create
        // the signature on this data.
        // Note that if the digest doesn't exactly match what was signed we'll
        // get a random recovered address.
        address recoveredAddress = ECDSA.recover(digest, signature);
        require(signerAddress == recoveredAddress, "Invalid Signature");
        _;
    }

    /// @param _nftAddress the address of the erc1155 contract that will be minted
    /// @param _signerAddress the address that will be used to verify mint eligibility
    constructor(IERC1155 _nftAddress, address _signerAddress) EIP712("BackendMinter", "1") {
        signerAddress = _signerAddress;
        erc1155 = _nftAddress;

        mintStarted = false;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

/// @param _sig signature from developer address allowing this tokenId to be minted
/// @param _tokenId tokenId that will be minted
    function mint(bytes calldata _sig, uint _tokenId, uint _nonce) external requiresSignature(_sig, _tokenId, _nonce ) {
        require(mintStarted, "Mint has not begun");
        erc1155.mint(msg.sender, _tokenId, 1);
    }

    ///@param _signerAddress update with new developer address for signatures
    function setSignerAddress(address _signerAddress) public onlyOwner {
        signerAddress = _signerAddress;
    }

    ///@param _isStarted used to pause and unpause minting 
    function setMintStarted(bool _isStarted) public onlyOwner {
        mintStarted = _isStarted;
    }


}
