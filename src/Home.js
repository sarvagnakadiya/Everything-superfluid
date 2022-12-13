import React from "react";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";

function Home() {
  const { address, connector, isConnected } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ address });
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { chains, pendingChainId, switchNetwork } = useSwitchNetwork();

  const addChain = async () => {
    console.log("inside");
    if (window.ethereum) {
      console.log("inside if");
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

  // if (isConnected) {
  //   console.log(chain);
  //   console.log(chain.id);
  //   console.log(chain.name);
  //   return (
  //     <div>
  //       <img src={ensAvatar} alt="ENS Avatar" />
  //       <div>{ensName ? `${ensName} (${address})` : address}</div>
  //       <div>Connected to {connector.name}</div>
  //       <button onClick={disconnect}>Disconnect</button>
  //     </div>
  //   );
  // }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && " (unsupported)"}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            " (connecting)"}
        </button>
      ))}

      {/* network change */}
      {chain && <div>Connected to {chain.name}</div>}

      {/* this code to switch between 2 chains eth/goerli */}

      {/* {chains.map((x) => (
        <button
          disabled={!switchNetwork || x.id === chain?.id}
          key={x.id}
          onClick={() => switchNetwork?.(x.id)}
        >
          {x.name}
          {isLoading && pendingChainId === x.id && " (switching)"}
        </button>
      ))} */}

      {/* just mention the chainId in parameter to switch at that network  */}
      <button onClick={() => switchNetwork?.(80001)}>switch to polygon</button>
      <button onClick={() => switchNetwork?.(5)}>switch to goerli</button>
      <button onClick={() => switchNetwork?.(338)}>switch to cronos</button>
      <button onClick={() => addChain()}>add network</button>

      {error && <div>{error.message}</div>}
    </div>
  );
}

export default Home;
