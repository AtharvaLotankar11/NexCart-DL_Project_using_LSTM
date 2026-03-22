import hre from "hardhat";

async function main() {
  const CONTRACT_ADDRESS = "0xB522085DC92e61aB708EAFf1eEe38447FCA76A07";
  const OrderLedger = await hre.ethers.getContractAt("OrderLedger", CONTRACT_ADDRESS);

  // Get order ID and status from command line
  // Example: npx hardhat run scripts/syncOrder.js --network sepolia <orderId> <status>
  // However, Hardhat doesn't pass extra arguments to the script easily via 'run'.
  // We'll use process.env or just a simple argument parser if possible.

  const args = process.argv.slice(2);
  // Hardhat 'run' puts the script name as an argument.
  // We need the arguments after it.
  
  const orderId = process.env.ORDER_ID;
  const statusInt = parseInt(process.env.ORDER_STATUS);

  if (!orderId || isNaN(statusInt)) {
    console.error("Missing ORDER_ID or ORDER_STATUS environment variables.");
    process.exit(1);
  }

  console.log(`[Blockchain Sync] Updating Order ${orderId} to status ${statusInt}...`);
  try {
    const tx = await OrderLedger.updateOrderStatus(orderId, statusInt);
    await tx.wait();
    console.log(`[Blockchain Sync] Order ${orderId} successfully updated. TX: ${tx.hash}`);
  } catch (err) {
    console.error(`[Blockchain Sync] Failed for ${orderId}:`, err.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[Blockchain Sync] Critical error:", error);
  process.exitCode = 1;
});
