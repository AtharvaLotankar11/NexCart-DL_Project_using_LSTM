import { Wallet } from "ethers";
import "dotenv/config";

const wallet = new Wallet(process.env.PRIVATE_KEY);
console.log("Wallet Address:", wallet.address);
