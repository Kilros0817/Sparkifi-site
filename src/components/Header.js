import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../logo.svg";

let address;
export default function Header() {

  async function switchSongBird() {
    await window.ethereum
    .request({
      method: "wallet_switchEthereumChain",
      params: [{chainId: "0x13"}]
    });
    
  }
  useEffect(() => { 
    window.ethereum.on('networkChanged', function () {
      const _chainId = window.ethereum.request({method: "eth_chainId"});
      if (_chainId !== 13){
        switchSongBird();
      }
    })
  }, []);

  const [connectedWallet, setConnectedWallet] = useState(null);
  const connectMetamask = async () => {
    const connected_wallet = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (connected_wallet) {
      address =
        connected_wallet[0].substr(0, 7) +
        "..." +
        connected_wallet[0].substr(
          connected_wallet[0].length - 7,
          connected_wallet[0].length
        );
      if (chainId !== "0x13") {
        switchSongBird();
        address = address + " | Wrong Network";
      }
      setConnectedWallet(address);
    }
  };

  window.ethereum.on("connect", (info) => {
    connectMetamask();
  });

  return (
    <div className="flex justify-between bg-red-50 pt-7 text-black">
      <img src={logo} className="w-24 ml-7" alt="logo" />
      <div className="flex">
        <p className="md:text-lg pt-9 w-24">
          <NavLink to="/">Home</NavLink>
        </p>
        <p className="md:text-lg pt-9 p-3 w-24">
          <NavLink to="/wrap">Wrap</NavLink>
        </p>
        <p className="md:text-lg pt-9 p-3 w-24">
          <NavLink to="/unwrap">Unwrap</NavLink>
        </p>
        <p className="md:text-lg pt-9 p-3 w-24">
          <NavLink to="/delegate">Delegate</NavLink>
        </p>
        <p className="md:text-lg pt-9 p-3 w-27">
          <NavLink to="/undelegate">Your Delegation</NavLink>
        </p>
        <p className="md:text-lg pt-9 p-3 w-27">
          <NavLink to="/reward">Claim Reward</NavLink>
        </p>
      </div>
      <div className="flex justify-between md:text-lg mr-5">
        <button
          className="m-10 pr-5 pl-5 border-collapse border border-black rounded-3xl"
          onClick={connectMetamask}
        >
          {connectedWallet ? connectedWallet : "Connect Metamask"}
        </button>
      </div>
    </div>
  );
}
