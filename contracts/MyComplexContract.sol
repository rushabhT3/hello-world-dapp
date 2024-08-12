// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyComplexContract {
    // State variables
    address public owner;
    string public defaultMessage;

    // Mapping to store messages for each address
    mapping(address => string) private userMessages;

    // Event to log when a message is updated
    event MessageUpdated(address indexed user, string newMessage);

    // Modifier to restrict access to certain functions to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // Constructor to set the initial owner and default message
    constructor(string memory _defaultMessage) {
        owner = msg.sender;
        defaultMessage = _defaultMessage;
    }

    // Function to set a message, accessible by anyone
    function setMessage(string memory _message) public {
        userMessages[msg.sender] = _message;
        emit MessageUpdated(msg.sender, _message); // Log the message update
    }

    // Function to retrieve a message for a specific user
    function getMessage(address _user) public view returns (string memory) {
        return bytes(userMessages[_user]).length > 0 ? userMessages[_user] : defaultMessage;
    }

    // Function to retrieve all messages (this is just a demonstration, not efficient for large mappings)
    function getAllMessages() public view onlyOwner returns (address[] memory, string[] memory) {
        uint count = 0;
        for (uint i = 0; i < block.number; i++) {
            if (bytes(userMessages[address(uint160(i))]).length > 0) {
                count++;
            }
        }
        address[] memory users = new address[](count);
        string[] memory messages = new string[](count);
        uint index = 0;
        for (uint i = 0; i < block.number; i++) {
            address user = address(uint160(i));
            if (bytes(userMessages[user]).length > 0) {
                users[index] = user;
                messages[index] = userMessages[user];
                index++;
            }
        }
        return (users, messages);
    }

    // Function to withdraw Ether from the contract, accessible only by the owner
    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
