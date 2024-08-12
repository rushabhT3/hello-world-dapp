const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance));

  // Deploy your contract here
  const MyContract = await hre.ethers.getContractFactory("MyContract");
  const initialMessage = "Hello, World!"; // You can change this initial message
  const myContract = await MyContract.deploy(initialMessage);

  // Wait for the contract to be mined
  await myContract.waitForDeployment();

  console.log("Contract deployed to:", await myContract.getAddress());
  console.log("Initial message:", initialMessage);

  // Optionally, you can interact with your contract here
  const deployedMessage = await myContract.message();
  console.log("Deployed message:", deployedMessage);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
