pragma solidity ^0.8;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";

contract ERC1155PandaTraits is Initializable, ERC1155BurnableUpgradeable, AccessControlUpgradeable {
    using Strings for uint;
    address payable public owner;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string public baseTokenURI;
    mapping(uint => bool) public isCustomMetadata;
    mapping(uint => string) public customMetadata;

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "Must have minter role.");
        _;
    }
    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Must have admin role.");
        _;
    }

    function initialize(string memory _baseTokenURI) public initializer{
        ERC1155BurnableUpgradeable.__ERC1155Burnable_init();
        _setURI(_baseTokenURI);
        baseTokenURI= _baseTokenURI;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address _to, uint _id, uint _quantity) public onlyMinter{
        _mint(_to, _id, _quantity, "");
    }
    function mintBatch(address _to, uint[] memory _ids, uint[] memory _quantities) public onlyMinter{
        _mintBatch(_to, _ids, _quantities, "");
    }

    function uri(uint _tokenId) public view override returns(string memory){
        if(isCustomMetadata[_tokenId]){
            return customMetadata[_tokenId];
        }
        return string(abi.encodePacked(baseTokenURI, _tokenId.toString()));

    }
    function _setCustomMetadata(uint _tokenId, string memory _uri) internal {
        isCustomMetadata[_tokenId] = true;
        customMetadata[_tokenId] = _uri;
    }

    function setCustomMetadata(uint _tokenId, string memory _uri) public onlyOwner{
        _setCustomMetadata(_tokenId, _uri);
    }

    function setCustomMetadataBatch(uint[] memory _tokenIds, string[] memory _uris) public onlyOwner {
        require(_tokenIds.length == _uris.length, "Invalid array sizes");

        for(uint i =0; i<_tokenIds.length;i++){
            _setCustomMetadata(_tokenIds[i], _uris[i]);
        }
    }

    function _unsetCustomMetadata(uint _tokenId) internal {
        isCustomMetadata[_tokenId] = false;
    }

    function unsetCustomMetadata(uint _tokenId ) public onlyOwner{
        _unsetCustomMetadata(_tokenId);
    }

    function unsetCustomMetadataBatch(uint[] memory _tokenIds) public onlyOwner {
        for(uint i =0; i<_tokenIds.length;i++){
            _unsetCustomMetadata(_tokenIds[i]);
        }
    }


    function supportsInterface(bytes4 interfaceId) public view override(AccessControlUpgradeable,ERC1155Upgradeable) returns(bool) {
         return
            interfaceId == type(ERC1155BurnableUpgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
