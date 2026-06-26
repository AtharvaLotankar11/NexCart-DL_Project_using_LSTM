```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│      ⛓️ THE IMMUTABLE LEDGER - BLOCKCHAIN LAYER ⛓️         │
│                                                             │
│    "Where trust is code, and history is unbreakable"       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

[← Back to Main Documentation](../README.md)

---

## 🎭 The Philosophy

Imagine a book written in permanent ink on diamond pages. Every word, once written, cannot be erased, altered, or denied. Every reader, everywhere, sees identical text. That's blockchain.

NexCart doesn't just track orders in a database. It etches them onto the Ethereum blockchain—a global, decentralized, tamper-proof ledger witnessed by thousands of nodes across the planet.

When you claim "Order #12345 was delivered," blockchain doesn't ask you to trust. It **proves** it with cryptographic signatures and network consensus.

---

## 🏗️ Architectural DNA

```
┌──────────────────────────────────────────────────────┐
│  Django Backend (Order Status Changes)               │
│  ↓                                                    │
│  Subprocess Call (Node.js Script)                    │
│  ↓                                                    │
│  Hardhat Framework (JavaScript Ethereum Interface)   │
│  ↓                                                    │
│  Ethers.js (Transaction Constructor)                 │
│  ↓                                                    │
│  Sepolia Testnet (Ethereum Layer 2)                  │
│  ↓                                                    │
│  Smart Contract: OrderLedger.sol                     │
│  ↓                                                    │
│  Permanent On-Chain Record                           │
└──────────────────────────────────────────────────────┘
```

**Network:** Ethereum Sepolia Testnet (layer 2, free test ETH)  
**Smart Contract Language:** Solidity 0.8.28  
**Development Framework:** Hardhat  
**JavaScript Library:** Ethers.js v6  
**Contract Address:** `0xB522085DC92e61aB708EAFf1eEe38447FCA76A07`  

---

## 📁 Directory Topology

```
blockchain/
├── contracts/
│   └── OrderLedger.sol         # Smart contract (order state machine)
│
├── scripts/
│   ├── deploy.js               # Deploy contract to Sepolia
│   ├── createOrder.js          # Create new order on-chain
│   ├── syncOrder.js            # Update order status
│   ├── checkStatus.js          # Query order state
│   └── updateStatus.js         # Manual batch status updater
│
├── artifacts/                  # Compiled contract bytecode + ABI
├── cache/                      # Hardhat compilation cache
├── .env                        # Private key + RPC URL (NEVER commit)
├── hardhat.config.js           # Network configuration
└── package.json                # Node.js dependencies
```

---

## 📜 The Smart Contract: OrderLedger.sol

**Purpose:** An immutable registry of order states on Ethereum.

**Written in:** Solidity (like TypeScript for blockchain)

**Core Concepts:**

### State Machine
```
┌─────────┐      ┌──────────┐      ┌─────────┐
│ Pending │ ---> │ Shipped  │ ---> │ Arrived │
│   (0)   │      │   (1)    │      │   (2)   │
└─────────┘      └──────────┘      └─────────┘
```

### Data Structure
```solidity
struct Order {
    string orderId;       // Razorpay order ID (e.g., "order_ABC123")
    OrderStatus status;   // 0 = Pending, 1 = Shipped, 2 = Arrived
    uint256 timestamp;    // Unix timestamp of last update
}
```

### Key Functions

**1. `createOrder(string orderId)` 🆕**  
- **Who can call:** Anyone (the buyer signs their own order)
- **What it does:** Creates a new order record with status `Pending` (0)
- **Requirements:** Order ID must not already exist
- **Emits event:** `OrderCreated`

**2. `updateOrderStatus(string orderId, OrderStatus newStatus)` 🔄**  
- **Who can call:** Only contract owner (NexCart backend wallet)
- **What it does:** Changes order status (0→1→2)
- **Requirements:** Order must exist
- **Emits event:** `OrderStatusUpdated`

**3. `getOrder(string orderId)` 🔍**  
- **Who can call:** Anyone (public read)
- **What it returns:** Order ID, status, timestamp
- **Requirements:** Order must exist

### Security Model

**Owner Privileges:**  
Only the deployer wallet (NexCart backend) can update order statuses. Prevents malicious actors from changing delivery states.

**Transparency:**  
Anyone can read any order's status. Public verifiability is the essence of blockchain trust.

**Immutability:**  
Once an order is created, its history is permanent. Status updates are append-only (no deletion).

---

## 🔧 The Scripts: Blockchain Automation

### `deploy.js` 🚀
**Purpose:** Deploy OrderLedger contract to Sepolia.

**Usage:**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**Output:** Contract address (save this—it's the permanent location on-chain).

---

### `createOrder.js` 🆕
**Purpose:** Create a new order on blockchain.

**Trigger:** Called by Django signal when payment is verified.

**Environment Variables Required:**
- `ORDER_ID` (Razorpay order ID)

**Execution:**
```bash
ORDER_ID=order_ABC123 npx hardhat run scripts/createOrder.js --network sepolia
```

**What happens:**
1. Connects to Sepolia via RPC
2. Loads deployed contract
3. Calls `createOrder(orderId)`
4. Waits for transaction confirmation (~15 seconds)
5. Returns transaction hash

---

### `syncOrder.js` 🔄
**Purpose:** Update order status on blockchain.

**Trigger:** Called by Django signal when order status changes.

**Environment Variables Required:**
- `ORDER_ID` (Razorpay order ID)
- `ORDER_STATUS` (0 = Pending, 1 = Shipped, 2 = Arrived)

**Execution:**
```bash
ORDER_ID=order_ABC123 ORDER_STATUS=2 npx hardhat run scripts/syncOrder.js --network sepolia
```

**What happens:**
1. Connects to Sepolia
2. Calls `updateOrderStatus(orderId, status)`
3. Waits for confirmation
4. Returns transaction hash

---

### `checkStatus.js` 🔍
**Purpose:** Query current order status (debugging tool).

**Execution:**
```bash
npx hardhat run scripts/checkStatus.js --network sepolia
```

**Output:** Displays status for hardcoded test order IDs.

---

### `updateStatus.js` 🛠️
**Purpose:** Manually update multiple orders (batch operation).

**Use case:** Fixing orders stuck in wrong state.

**Execution:**
```bash
npx hardhat run scripts/updateStatus.js --network sepolia
```

---

## 🔗 How Django Talks to Blockchain

**The Bridge: Subprocess Calls**

Django can't directly execute JavaScript. Solution: Spawn Node.js process from Python.

**Example (from `api/signals.py`):**

```python
import subprocess

blockchain_dir = '/path/to/blockchain'
env = os.environ.copy()
env["ORDER_ID"] = "order_ABC123"
env["ORDER_STATUS"] = "2"

result = subprocess.run(
    ["npx", "hardhat", "run", "scripts/syncOrder.js", "--network", "sepolia"],
    cwd=blockchain_dir,
    env=env,
    capture_output=True,
    timeout=60
)

if result.returncode == 0:
    print("Blockchain sync successful!")
```

**Why synchronous (`subprocess.run`):**  
Ensures Django waits for blockchain confirmation before proceeding. Prevents state drift.

---

## 🌐 Sepolia Testnet: The Training Ground

**What is Sepolia?**  
An Ethereum test network. Identical to mainnet, but ETH has no real value.

**Why use it?**  
- Free transactions (test ETH from faucets)
- Safe experimentation (no financial risk)
- Public verification (anyone can view transactions on Etherscan)

**Faucet (get free test ETH):**  
[https://sepoliafaucet.com](https://sepoliafaucet.com)

**Explorer (view transactions):**  
[https://sepolia.etherscan.io](https://sepolia.etherscan.io)

**NexCart Contract:**  
`0xB522085DC92e61aB708EAFf1eEe38447FCA76A07`

---

## 🔐 Security: The Private Key

**Location:** `blockchain/.env`

**Format:**
```
SEPOLIA_PRIVATE_KEY=0xabcdef1234567890...
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

**Critical Rules:**
1. **NEVER** commit `.env` to Git
2. **NEVER** share private key
3. **NEVER** use mainnet key on testnet (or vice versa)

**If compromised:**  
Anyone with your private key controls your wallet. Can drain ETH, impersonate you.

**Best practice:**  
Create a dedicated wallet for NexCart backend. Fund with minimal test ETH.

---

## 🎯 The Verification Flow

**User Journey:**

1. **User views order on frontend**
2. **Clicks "Verify on Blockchain" button**
3. **Frontend queries contract via Ethers.js:**
   ```javascript
   const order = await OrderLedger.getOrder("order_ABC123")
   console.log(order.status) // 0, 1, or 2
   ```
4. **Displays status badge:**
   - 0 → "Pending" (yellow)
   - 1 → "Shipped" (blue)
   - 2 → "Arrived" (green)
5. **Shows transaction link:**  
   `https://sepolia.etherscan.io/tx/0xTRANSACTION_HASH`

**Result:** User has cryptographic proof that NexCart cannot falsify.

---

## 🛠️ Development Commands

**Install dependencies:**
```bash
npm install
```

**Compile contract:**
```bash
npx hardhat compile
```

**Deploy to Sepolia:**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**Test contract locally:**
```bash
npx hardhat test
```

**Create order (manual test):**
```bash
ORDER_ID=test_order_001 npx hardhat run scripts/createOrder.js --network sepolia
```

**Update order status (manual test):**
```bash
ORDER_ID=test_order_001 ORDER_STATUS=2 npx hardhat run scripts/syncOrder.js --network sepolia
```

**Check contract owner:**
```bash
npx hardhat run scripts/checkStatus.js --network sepolia
```

---

## 🎓 Blockchain Concepts for Humans

### Gas Fees 💰
**Metaphor:** Paying toll booths on a highway.

Every transaction costs "gas" (measured in ETH). Miners prioritize higher gas fees.

**On Sepolia:** Free (test ETH has no value).

---

### Transactions ✍️
**Metaphor:** Sending a registered letter with signature confirmation.

- Sender signs with private key (proves identity)
- Transaction broadcasts to network
- Miners validate and include in block
- Confirmation takes ~15 seconds

---

### Smart Contracts 📜
**Metaphor:** Vending machines. Insert coin (transaction) → Get product (code executes).

Unlike servers, contracts can't be shut down. Code runs exactly as written, forever.

---

### Immutability 🗿
**Metaphor:** Writing in permanent marker on concrete.

Once a block is mined (confirmed), its contents are permanent. Editing requires consensus from majority of network (virtually impossible).

---

### Decentralization 🌍
**Metaphor:** A thousand librarians each holding identical copies of every book.

If one library burns, 999 remain. No single point of failure.

---

## 🚨 Common Issues & Solutions

**Issue:** Transaction fails with "Order already exists"  
**Solution:** Order was already created. Safe to ignore or use `syncOrder.js` instead.

**Issue:** Transaction fails with "Order does not exist"  
**Solution:** Must call `createOrder.js` before `syncOrder.js`.

**Issue:** Transaction hangs/times out  
**Solution:** Sepolia network congestion. Wait 60 seconds and retry.

**Issue:** "Insufficient funds for gas"  
**Solution:** Get test ETH from Sepolia faucet. Need ~0.01 ETH for 100+ transactions.

**Issue:** "Only owner can perform this action"  
**Solution:** Ensure `.env` contains correct deployer private key.

---

## 🔮 Future Enhancements

- **Multi-Signature Wallet:** Require 2+ keys to update orders (enhanced security)
- **Event Indexing:** Build database of all blockchain events (faster queries)
- **Layer 2 Migration:** Move to Arbitrum/Optimism (cheaper gas fees)
- **IPFS Integration:** Store order metadata off-chain, hash on-chain
- **NFT Receipts:** Mint each order as an NFT (collectible proof of purchase)
- **Cross-Chain:** Deploy to Polygon, Binance Smart Chain (multi-network support)

---

## 🎯 The Blockchain's Sacred Promise

**Promise 1: Transparency**  
Every order state visible to anyone, anywhere, anytime.

**Promise 2: Immutability**  
History cannot be rewritten. Once shipped, forever shipped.

**Promise 3: Decentralization**  
No single server holds truth. Thousands of nodes validate.

**Promise 4: Verification**  
Users don't trust NexCart's word. They verify cryptographic proof.

**Promise 5: Permanence**  
Even if NexCart shuts down, order records persist on-chain.

---

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  "In blockchain we trust, for trust is what blockchain      │
│   replaces with math, consensus, and code."                 │
│                                                             │
│                  — The Cryptographic Architects             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

[← Back to Main Documentation](../README.md)
