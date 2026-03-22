"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

// Address is the one derived from our deployment
const CONTRACT_ADDRESS = "0xB522085DC92e61aB708EAFf1eEe38447FCA76A07";
const CONTRACT_ABI = [
  "event OrderCreated(string indexed orderId, uint8 status, uint256 timestamp)",
  "event OrderStatusUpdated(string indexed orderId, uint8 status, uint256 timestamp)",
  "function createOrder(string memory _orderId) public",
  "function updateOrderStatus(string memory _orderId, uint8 _status) public",
  "function getOrder(string memory _orderId) public view returns (string memory, uint8, uint256)",
  "function owner() public view returns (address)",
  "function orderExists(string) public view returns (bool)"
];

const SEPOLIA_CHAIN_ID = "0xaa36a7";

const switchToSepolia = async (setNetworkError) => {
  if (typeof window === "undefined" || !window.ethereum) return false;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
    return true;
  } catch (switchError) {
    // 4902 error code means the network isn't added yet
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia Test Network",
              rpcUrls: ["https://rpc.sepolia.org"],
              nativeCurrency: { name: "Sepolia ETH", symbol: "SEPETH", decimals: 18 },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
        return true;
      } catch (addError) {
        setNetworkError("Failed to add Sepolia network to MetaMask.");
        return false;
      }
    } else {
      setNetworkError("Failed to switch to Sepolia network. Please switch manually.");
      return false;
    }
  }
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [isMetaMaskLocked, setIsMetaMaskLocked] = useState(false);

  // Global Rejection Handler - Failsafe for Extension Glitches
  useEffect(() => {
    const handleRejection = (event) => {
      if (event.reason?.message?.includes("MetaMask") || event.reason?.stack?.includes("nkbihfbeogaeaoehlefnkodbefgpgknn")) {
        console.warn("Caught MetaMask background rejection. Handling gracefully...");
        setIsMetaMaskLocked(true);
        event.preventDefault(); // Silence the console error
      }
    };
    window.addEventListener("unhandledrejection", handleRejection);
    return () => window.removeEventListener("unhandledrejection", handleRejection);
  }, []);

  // Initialize connection
  const initWeb3 = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsMetaMaskLocked(false);
          } else {
            setAccount(null);
            setIsMetaMaskLocked(true);
          }
        });

        // Listen for chain changes
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

      } catch (error) {
        console.warn("Web3 silence init");
      }
    }
  };

  useEffect(() => {
    initWeb3();

    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsMetaMaskLocked(false);
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            if (chainId === SEPOLIA_CHAIN_ID) {
              setupContract();
            } else {
              setNetworkError("Please switch MetaMask to Sepolia network.");
            }
          } else {
            // Extension is present but no accounts authorized (likely locked)
            setIsMetaMaskLocked(true);
          }
        } catch (error) {
           console.warn("Check connection handled");
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setNetworkError(null);
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        if (chainId !== SEPOLIA_CHAIN_ID) {
          const switched = await switchToSepolia(setNetworkError);
          if (!switched) {
            setIsConnecting(false);
            return;
          }
        }

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        setIsMetaMaskLocked(false);
        setupContract();
      } catch (error) {
        console.error("User rejecting connection or error", error);
        setNetworkError("Failed to connect wallet.");
      }
    } else {
      setNetworkError("Please install MetaMask!");
    }
    setIsConnecting(false);
  };

  const setupContract = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const orderContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(orderContract);
      } catch (e) {
        console.warn("Contract setup on deck");
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        contract,
        isConnecting,
        networkError,
        isMetaMaskLocked,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
