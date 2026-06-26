import hre from "hardhat";

async function main() {
  const CONTRACT_ADDRESS = "0xB522085DC92e61aB708EAFf1eEe38447FCA76A07";
  const OrderLedger = await hre.ethers.getContractAt("OrderLedger", CONTRACT_ADDRESS);

  const orderId = process.env.ORDER_ID;

  if (!orderId) {
    console.error("Missing ORDER_ID environment variable.");
    process.exit(1);
  }

  console.log(`[Blockchain Create] Creating Order ${orderId} on ledger...`);
  try {
    const tx = await OrderLedger.createOrder(orderId);
    await tx.wait();
    console.log(`[Blockchain Create] Order ${orderId} successfully created. TX: ${tx.hash}`);
  } catch (err) {
    console.error(`[Blockchain Create] Failed for ${orderId}:`, err.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[Blockchain Create] Critical error:", error);
  process.exitCode = 1;
});
