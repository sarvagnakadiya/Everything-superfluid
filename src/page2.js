import React from "react";

function page2() {
  const addChain = () => {
    console.log("inside");
    if (window.ethereum) {
      window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x405",
            rpcUrls: ["https://pre-rpc.bittorrentchain.io/"],
            chainName: "BitTorrent Chain Donau",
            blockExplorerUrls: ["https://testscan.bittorrentchain.io/"],
          },
        ],
      });
    } else {
      alert("Please Install a wallet to proceed.");
    }
  };
  return (
    <div>
      <button onClick={addChain()}></button>
    </div>
  );
}

export default page2;
