import hre from "hardhat";

async function main() {
  const CONTRACT_ADDRESS = "0xB522085DC92e61aB708EAFf1eEe38447FCA76A07";
  
  // Usage: npx hardhat run scripts/updateStatus.js --network sepolia
  // It simulates a Store Admin marking an Order as Shipped (1) or Arrived (2)
  const OrderLedger = await hre.ethers.getContractAt("OrderLedger", CONTRACT_ADDRESS);

  // For demonstration, let's say the admin updates an order ID below
  // Replace "12" with the Order ID you want to update
  const orderId = "24"; // Example order ID
  const newStatus = 1; // 1 = Shipped, 2 = Arrived

  console.log(`Updating Order ${orderId} to status ${newStatus} on Ledger...`);

  // This will fail if the transaction is not sent by the Owner (Admin)
  const tx = await OrderLedger.updateOrderStatus(orderId, newStatus);
  await tx.wait();

  console.log(`Order ${orderId} status has been updated securely on-chain!`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
