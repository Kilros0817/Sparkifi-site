import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi_reward from "../utils/abi_reward.json";
import { rewardcontractAddress } from "../utils/config";

export default function Reward() {
  const [account, setAccount] = useState("");
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi_reward, rewardcontractAddress);
  const [unclaimedReward, setUnclaimedReward] = useState([]);
  const [epochIds, setEpochIds] = useState([]);
  const [sumRewards, setSumRewards] = useState(0);

  useEffect(() => {
    async function init() {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const _account = await web3.eth.getAccounts();
      let _sum = 0;
      setAccount(_account);
      if (_account && (chainId === "0x13" || chainId === 19)) {
        const _epochIds = await contract.methods
          .getEpochsWithUnclaimedRewards(_account[0])
          .call();
        setEpochIds(_epochIds);
        _epochIds.map((ele, idx) => {
          const unclaimedReward = contract.methods
            .getUnclaimedReward(ele, _account[0])
            .call()
            .then((res) => {
              setSumRewards((sum) => sum + Number(res[0]) / 10 ** 18);
              setUnclaimedReward((s = []) => [...s, res]);
            });
        });
      }
    }
    init();
  }, []);
  const claimReward = () => {
    contract.methods
      .claimReward(account[0], epochIds)
      .send({
        from: account[0],
      })
      .then(async (res) => {
        if (res.status === true) {
          setUnclaimedReward(null);
          setSumRewards(0);
        }
      });
  };

  return (
    <>
      <div className="flex flex-col bg-red-100 w-1/2 mx-10 mx-auto my-10 h-auto p-10 mx-10 border-collapse border border-red-100 rounded-md">
        <label className="m-10 md:w-auto  mx-auto text-2xl">Claim Reward</label>
        <table class="table-fixed py-8 text-center">
          <thead className="border-b-4 border-double border-green-900 space-y-5">
            <tr>
              <td>No</td>
              <td>Amount</td>
            </tr>
          </thead>
          <tbody>
            {unclaimedReward
              ? unclaimedReward.map((ele, idx) => {
                  return (
                    <tr>
                      <td>{idx + 1}</td>
                      <td>{(Number(ele["_amount"]) / 10 ** 18).toFixed(2)}</td>
                    </tr>
                  );
                })
              : "No Data"}
          </tbody>
        </table>
        <div className="flex flex-justify px-3">
          <label className="text-xl">
            {sumRewards.toFixed(2) !== 0.0
              ? "Sum : " + sumRewards.toFixed(2)
              : ""}
          </label>
          <label className="text-xl items-center">
            {unclaimedReward !== null ? "" : "Succeeded to Claim"}
          </label>
        </div>

        <button
          className="h-9 w-2/3 mx-auto p-1 border-collapse border border-black rounded-3xl bg-red-100"
          onClick={claimReward}
        >
          Claim All Rewards
        </button>
      </div>
    </>
  );
}
