import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "../utils/abi.json";
import { contractAddress } from "../utils/config";

export default function Wrap() {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [account, setAccount] = useState("");
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractAddress);

  useEffect(() => {
    async function init() {
      const chainId = await web3.eth.getChainId();
      console.log(chainId)
      if (chainId === "0x13" || chainId === 19) {
        const _account = await web3.eth.getAccounts();
        setAccount(_account);
        const _balance = await web3.eth.getBalance(_account[0]);
        setBalance(_balance);
      }
    }
    init();
  }, [amount]);

  const wrap = async () => {
    await contract.methods
      .deposit()
      .send({
        from: account[0],
        value: amount * 10 ** 18,
      })
      .then(async (res) => {
        if (res.status === true) {
          const _balance = await web3.eth.getBalance(account[0]);
          setBalance(_balance);
        } else {
        }
      });
  };
  return (
    <>
      <div className="flex flex-col bg-red-100 w-1/2 mx-10 mx-auto my-10 h-auto p-10 mx-10 border-collapse border border-red-100 rounded-md">
        <label className="m-10 md:w-auto  mx-auto text-2xl">Wrap</label>
        <div className="flex justify-between w-2/3 p-1 pl-3 mb-5 bg-white border-collapse border border-red-100 rounded-md mx-auto">
          <input
            className="focus:outline-none md:w-auto"
            type="text"
            name="amount_wrap"
            placeholder="Amount wrap"
            onChange={(e) => setAmount(e.target.value)}
          ></input>
          {/* <button className="mr-3">Max</button> */}
        </div>
        <label className="md:w-auto mx-auto">
          Available : {balance / 10 ** 18} SGB
        </label>
        <button
          className="h-9 w-2/3 mx-auto p-1 border-collapse border border-black rounded-3xl bg-red-100"
          onClick={wrap}
        >
          Wrap
        </button>
      </div>
    </>
  );
}
