import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "../utils/abi.json";
import { contractAddress } from "../utils/config";
import BigNumber from "bignumber.js";

export default function Unwrap() {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [notify, setNotify] = useState("");
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractAddress);
  useEffect(() => {
    async function init() {
      const _account = await web3.eth.getAccounts();
      setNotify("")
      setAccount(_account);
      if (_account[0]) {
        const _balance = await contract.methods.balanceOf(_account[0]).call()
        setBalance(_balance)
      }
    }
    init();
  }, [amount]);

  const unwrap = async () => {
    const amount_withdraw = new BigNumber(amount * 10 ** 18);
    await contract.methods.withdraw(amount_withdraw.toFixed()).send({
      from: account[0],
    })
    .then(async (res) => {
      if (res.status === true) {
        const _balance = await contract.methods.balanceOf(account[0]).call()
        setBalance(_balance)
      }
      else {
        setNotify("Transaction Failed.")
      }
    });
  };
  return (
    <>
      <div className="flex flex-col bg-red-100 w-1/2 mx-10 mx-auto my-10 h-auto p-10 mx-10 border-collapse border border-red-100 rounded-md">
        <label className="m-10 md:w-auto  mx-auto text-2xl">Unwrap</label>
        <div className="flex justify-between w-2/3 p-1 pl-3 mb-5 bg-white border-collapse border border-red-100 rounded-md mx-auto">
          <input
            className="focus:outline-none md:w-auto"
            type="text"
            name="amount_wrap"
            placeholder="Amount Unwrap"
            onChange={(e) => setAmount(e.target.value)}
          ></input>
        </div>
        <label className="md:w-auto mx-auto">Available : {balance / 10 ** 18} WSGB</label>
        <button
          className="h-9 w-2/3 mx-auto p-1 border-collapse border border-black rounded-3xl bg-red-100"
          onClick={unwrap}
        >
          Unwrap
        </button>
        <label className="md:w-auto mx-auto">{notify}</label>
      </div>
    </>
  );
}
