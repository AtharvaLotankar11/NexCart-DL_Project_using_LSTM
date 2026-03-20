import hre from "hardhat";

async function main() {
  const OrderLedger = await hre.ethers.getContractFactory("OrderLedger");
  const orderLedger = await OrderLedger.deploy();

  await orderLedger.waitForDeployment();

  console.log("OrderLedger deployed to:", await orderLedger.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
