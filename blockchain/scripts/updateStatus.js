import hre from "hardhat";

async function main() {
  const CONTRACT_ADDRESS = "0xB522085DC92e61aB708EAFf1eEe38447FCA76A07";
  
  // Usage: npx hardhat run scripts/updateStatus.js --network sepolia
  // Marked as Arrived (2) for the specific orders reported by the user
  const OrderLedger = await hre.ethers.getContractAt("OrderLedger", CONTRACT_ADDRESS);

  const orderIds = ["order_STdWHjKD16h8RI", "order_STdAZpkNeCdKHj"];
  const newStatus = 2; // 2 = Arrived

  for (const orderId of orderIds) {
    console.log(`Synchronizing Order ${orderId} to status ${newStatus} on Ledger...`);
    try {
      const tx = await OrderLedger.updateOrderStatus(orderId, newStatus);
      await tx.wait();
      console.log(`Order ${orderId} successfully marked as ARRIVED on block.`);
    } catch (err) {
      console.error(`Failed to update ${orderId}:`, err.message);
    }
  }

  console.log("Remediation complete.");
}

main().catch((error) => {
  console.error("Critical error during blockchain update:", error);
  process.exitCode = 1;
});
