import { Wallet } from "ethers";
import "dotenv/config";

try {
    const wallet = new Wallet(process.env.PRIVATE_KEY);
    console.log("Wallet OK. Address:", wallet.address);
} catch (e) {
    console.error("Critical Wallet Error:", e.message);
}
