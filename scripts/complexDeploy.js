const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance));

  // Deploy the contract with an initial default message
  const MyComplexContract = await hre.ethers.getContractFactory(
    "MyComplexContract"
  );
  const initialMessage = "Welcome to MyComplexContract!";
  const myComplexContract = await MyComplexContract.deploy(initialMessage);

  // Wait for the contract to be mined
  await myComplexContract.waitForDeployment();

  console.log("Contract deployed to:", await myComplexContract.getAddress());
  console.log("Initial default message:", initialMessage);

  // Interact with the contract
  let currentMessage = await myComplexContract.getMessage(deployer.address);
  console.log("Current message for deployer:", currentMessage);

  const newMessage = "Hello, Blockchain!";
  const tx = await myComplexContract.setMessage(newMessage);
  await tx.wait(); // Wait for the transaction to be confirmed
  console.log("Message set to:", newMessage);

  currentMessage = await myComplexContract.getMessage(deployer.address);
  console.log("Updated message for deployer:", currentMessage);

  // Optionally, demonstrate sending Ether to the contract
  const sendTx = await deployer.sendTransaction({
    to: await myComplexContract.getAddress(),
    value: hre.ethers.parseEther("0.1"),
  });
  await sendTx.wait();
  console.log("Sent 0.1 Ether to the contract");

  // Check the contract's balance
  const contractBalance = await hre.ethers.provider.getBalance(
    await myComplexContract.getAddress()
  );
  console.log(
    "Contract balance after receiving Ether:",
    hre.ethers.formatEther(contractBalance)
  );

  // Withdraw Ether from the contract
  const withdrawTx = await myComplexContract.withdraw();
  await withdrawTx.wait();
  console.log("Withdrawn contract balance to owner");

  // Final contract balance check
  const finalContractBalance = await hre.ethers.provider.getBalance(
    await myComplexContract.getAddress()
  );
  console.log(
    "Contract balance after withdrawal:",
    hre.ethers.formatEther(finalContractBalance)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
