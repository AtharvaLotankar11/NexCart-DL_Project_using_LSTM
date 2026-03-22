import hre from "hardhat";

async function main() {
  const CONTRACT_ADDRESS = "0xB522085DC92e61aB708EAFf1eEe38447FCA76A07";
  const OrderLedger = await hre.ethers.getContractAt("OrderLedger", CONTRACT_ADDRESS);

  const owner = await OrderLedger.owner();
  console.log("Contract Owner:", owner);

  const testIds = ["order_STdWHjKD16h8RI", "order_STdAZpkNeCdKHj"];
  for (const id of testIds) {
    try {
        const [orderId, statusInt, timestamp] = await OrderLedger.getOrder(id);
        const statusMap = ["Pending", "Shipped", "Arrived"];
        console.log(`Order ${id}: Status = ${statusMap[statusInt]} (${statusInt})`);
    } catch (e) {
        console.log(`Order ${id}: Error checking status - ${e.message}`);
    }
  }
}

main().catch(console.error);
