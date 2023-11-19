import React, { useState, useCallback, useEffect } from 'react';
import { abi } from './abi/abi';
import { BrowserProvider, Contract, parseEther, formatUnits } from "ethers";

export default function Home() {
  const cUsdTokenAddress = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
  const celoAddress = "0x0000000000000000000000000000000000000000";
  const contractAddress = "0x55670abc1948e8e4eaf6fbd3dfdd93066fc085fa";
  const receiverAddress = ""; // Add your receiver address
  const [address, setAddress] = useState<string>('');

  const [depositAmount, setDepositAmount] = useState<string>('');
  const [celoBalance, setCeloBalance] = useState<string>('');
  const [cusdBalance, setCusdBalance] = useState<string>('');
  const [tokenBalance, setTokenBalance] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<string>('CELO');

  const getBalance = useCallback(async () => {
    if (window.ethereum) {
      try {
        // Requesting accounts and getting the user address
        let accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        let userAddress = accounts[0];

        // Setting up the contract
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(userAddress);
        const contract = new Contract(contractAddress, abi, signer);
          // Getting CELO balance
          const balanceStruct = await contract.balances(userAddress);
          if (balanceStruct && balanceStruct.celoBalance !== undefined) {
            const celoBalanceBigInt = formatUnits(balanceStruct.celoBalance, 18);
            const formattedCeloBalance = celoBalanceBigInt.toString();
            setCeloBalance(formattedCeloBalance);

          // Getting cUSD balance
          const cUsdBalance = await contract.getBalance(userAddress, cUsdTokenAddress);
          if (cUsdBalance !== undefined) {
            const cUsdBalanceBigInt = formatUnits(cUsdBalance, 18);
            const formattedCusdBalance = cUsdBalanceBigInt.toString();
            setCusdBalance(formattedCusdBalance);
          }
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  }, [selectedToken]);

  const getTokenBalance = useCallback(async () => {
    if (window.ethereum) {
      try {
        // Requesting accounts and getting the user address
        let accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        let userAddress = accounts[0];

        // Setting up the contract
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(userAddress);
        const contract = new Contract(contractAddress, abi, signer);
        // Getting token balance
        const tokenBalance = await contract.balanceOf(userAddress);
        if (tokenBalance !== undefined) {
          const tokenBalanceBigInt = formatUnits(tokenBalance, 0);
          const formattedTokenBalance = tokenBalanceBigInt.toString();
          setTokenBalance(formattedTokenBalance);

        }
      } catch (error) {
        console.error("Error fetching token balance:", error);
      }
    }
  }, []);



const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setSelectedToken(event.target.value);
}

const handleDeposit = async (event: React.FormEvent, selectedToken: string, depositAmount: string) => {
  event.preventDefault();
  if (!depositAmount || !selectedToken) return;
  if (window.ethereum) {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // The current selected account out of the connected accounts.
    let userAddress = accounts[0];
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(userAddress);
    const contract = new Contract(contractAddress, abi, signer);
    const depositValue = parseEther(depositAmount);
    const gasLimit = parseInt("6000000");

    if (selectedToken === 'CELO') {
      await contract.deposit(celoAddress, depositValue, { gasLimit });
    } else if (selectedToken === 'cUSD') {
      await contract.deposit(cUsdTokenAddress, depositValue, { gasLimit });
    }

    getBalance();
    getTokenBalance();
    setDepositAmount('');
  }
};

const handleWithdraw = async (event: React.FormEvent) => {
  event.preventDefault();
  if (window.ethereum) {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // The current selected account out of the connected accounts.
    let userAddress = accounts[0];
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(userAddress);
    const contract = new Contract(contractAddress, abi, signer);

    if (selectedToken === 'CELO') {
      await contract.withdraw(celoAddress);
    } else if (selectedToken === 'cUSD') {
      await contract.withdraw(cUsdTokenAddress);
    }

    getBalance();
    getTokenBalance();

  }
};

const handleBreakLock = async (event: React.FormEvent) => {
  event.preventDefault();
  if (window.ethereum) {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // The current selected account out of the connected accounts.
    let userAddress = accounts[0];
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(userAddress);
    const contract = new Contract(contractAddress, abi, signer);

    if (selectedToken === 'CELO') {
      await contract.breakTimeLock(celoAddress);
    } else if (selectedToken === 'cUSD') {
      await contract.breakTimeLock(cUsdTokenAddress);
    }

    getBalance();
  }
};

useEffect(() => {
  getBalance();
  getTokenBalance();
}, [getBalance, getTokenBalance]);

return (
  <div className="">
    <div className="bg-gypsum bg-opacity-3 rounded-lg p-8 shadow-lg text-white w-96">
      <div className="flex flex-col items-center justify-center text-4xl font-bold mb-6 items-center text-black uppercase tracking-wider border-b-2 border-black pb-2">START SAVING NOW</div>
      <div className="flex flex-col items-center justify-center">
      <h3 className="text-black text-sm bg-gradient-to-r from-gray-100 to-prosperity-300 rounded-md p-2 mb-1">Your CELO Balance: {celoBalance} CELO</h3>
<h3 className="text-black text-sm bg-gradient-to-r from-gypsum to-blue-50 rounded-md p-2">Your cUSD Balance: {cusdBalance} cUSD</h3>
<h3 className="text-black text-sm bg-gradient-to-r from-green-50 to-gypsum rounded-md p-2 mt-1">Your MiniSafe Bonus: {tokenBalance} MST</h3>

        <select onChange={handleTokenChange} value={selectedToken} className="text-black">
          <option value="CELO">CELO</option>
          <option value="cUSD">cUSD</option>
        </select>
      </div>

      <form onSubmit={(e) => handleDeposit(e, selectedToken, depositAmount)} className="mb-4">
        <input
          type="number"
          step="0.01"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="rounded px-4 py-2 w-full mb-2 text-black"
        />
        <button
          type="submit"
          className="w-full bg-black hover:bg-black rounded py-2"
        >
          Deposit
        </button>
      </form>

      <button
        onClick={handleWithdraw}
        className="w-full bg-black hover:bg-black rounded py-2 mb-2"
      >
        Withdraw
      </button>
      <button
        onClick={handleBreakLock}
        className="w-full  bg-black hover:bg-black rounded py-2 mb-7"
      >
        Break Lock
      </button>
    </div>
  </div>
);
}
