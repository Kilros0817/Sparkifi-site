import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "../utils/abi.json";
import { contractAddress } from "../utils/config";
import { RangeStepInput } from "react-range-step-input";
import BigNumber from "bignumber.js";
import { Link } from "react-router-dom";

export default function Delegate() {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [delegatesPercent, setDelegatesPercent] = useState(0);
  const [delegationInfo, setDelegationInfo] = useState(null);
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractAddress);
  useEffect(() => {
    async function init() {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const _account = await web3.eth.getAccounts();
      setAccount(_account);
      if (_account && (chainId === "0x13" || chainId === 19)) {
        setAmount(await contract.methods.balanceOf(_account[0]).call());
        const delegate_info = await contract.methods
          .delegatesOf(_account[0])
          .call();
        setDelegationInfo(delegate_info);
      }
    }
    init();
  }, [amount]);

  const delegate = async () => {
    const amount_delegate = BigNumber((amount * delegatesPercent) / 10000);
    await contract.methods
      .delegate(
        "0x153aD30381b11DCE62f349c97a54c2a58956B992",
        delegatesPercent * 100
      )
      .send({
        from: account[0],
      });
  };
  const onChangeSlider = (e) => {
    const newVal = Number(e.target.value);
    setDelegatesPercent(newVal);
  };
  return (
    <>
      <div className="flex flex-col bg-red-100 w-1/2 mx-10 mx-auto my-10 h-auto p-10 mx-10 border-collapse border border-red-100 rounded-md">
        <label className="m-10 md:w-auto  mx-auto text-2xl">Delegate</label>
        {(delegationInfo && Number(delegationInfo["_count"]) > 1) ||
        (delegationInfo &&
          delegationInfo["_bips"][0] + delegationInfo["_bips"][1] === 10000) ? (
          <label className="mx-auto text-sm text-pink-700 mb-7">
            Max Delegation detected.
            <Link to="/undelegate"> Please undelegate click here...</Link>
          </label>
        ) : (
          <>
            <label className="mx-auto text-6xl text-pink-700 mb-7">
              {delegatesPercent ? delegatesPercent : 0}%
            </label>
            <div className="flex justify-between w-2/3 p-1 pl-3 mb-5 bg-white border-collapse border border-red-100 rounded-md mx-auto">
              <RangeStepInput
                className="mx-auto w-full bg-opacity-100"
                min={0}
                max={100}
                value={delegatesPercent ? delegatesPercent : 0}
                step={1}
                onChange={onChangeSlider}
              />
            </div>
            <label className="md:w-auto mx-auto mb-3">
              Delegate Address : 0x029290c564Ef921c56a784AA16C97E930dAF7372
            </label>
            <button
              className="h-9 w-2/3 mx-auto p-1 border-collapse border border-black rounded-3xl bg-red-100"
              onClick={delegate}
            >
              Delegate{" "}
              {Number(BigNumber((amount * delegatesPercent) / 100)) / 10 ** 18}{" "}
              WSGB to SparkiFi
            </button>
          </>
        )}
      </div>
    </>
  );
}
