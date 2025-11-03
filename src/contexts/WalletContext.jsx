import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAuth } from "./AuthContext";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);

      window.ethereum.on &&
        window.ethereum.on("accountsChanged", (accounts) => {
          setAddress(accounts && accounts[0] ? accounts[0] : null);
        });
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      disconnectWallet();
    }
  }, [currentUser]);

  async function getEthBalance(addr) {
    if (!provider || !addr) return 0;
    try {
      const balanceWei = await provider.getBalance(addr);
      const balanceEth = Number(ethers.formatEther(balanceWei));
      return balanceEth;
    } catch (err) {
      console.error("Failed to fetch ETH balance:", err);
      return 0;
    }
  }

  async function connectMetaMask() {
    if (!currentUser) {
      alert("Please login first to connect your wallet.");
      return;
    }

    if (typeof window === "undefined") return;

    if (!window.ethereum) {
      alert("MetaMask not found!");
      window.open("https://metamask.io/download.html", "_blank");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts[0]) {
        setAddress(accounts[0]);
        const bal = await getEthBalance(accounts[0]);
        setBalance(bal);
        return accounts[0];
      }
    } catch (err) {
      console.error("MetaMask connection failed:", err);
      alert(err.message);
    }
  }

  function disconnectWallet() {
    setAddress(null);
    setProvider(null);
    setHoldings({});
    setBalance(0);
  }

  function credit(amount) {
    setBalance((b) => Number((Number(b) + Number(amount)).toFixed(8)));
  }

  function debit(amount) {
    setBalance((b) => Number((Number(b) - Number(amount)).toFixed(8)));
  }

  function updateHoldings(symbol, qtyChange) {
    setHoldings((prev) => {
      const copy = { ...prev };
      copy[symbol] = (copy[symbol] || 0) + Number(qtyChange);
      if (Math.abs(copy[symbol]) < 1e-12) delete copy[symbol];
      return copy;
    });
  }

  return (
    <WalletContext.Provider
      value={{
        provider,
        address,
        connectMetaMask,
        disconnectWallet,
        balance,
        credit,
        debit,
        holdings,
        updateHoldings,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
