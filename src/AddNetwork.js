import React from "react";

function AddNetwork() {
  const addChain = async () => {
    if (window.ethereum) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x4E454153", //1313161555
            chainName: "Aurora Testnet",
            rpcUrls: ["https://testnet.aurora.dev/"],
            blockExplorerUrls: ["https://testnet.aurorascan.dev/"],
            nativeCurrency: {
              symbol: "ETH",
              decimals: 18,
            },
          },
        ],
      });
    } else {
      alert("Please Install a wallet to proceed.");
    }
  };
  return (
    <div>
      <button onClick={addChain}>Add Aurora testnet</button>
    </div>
  );
}

export default AddNetwork;
