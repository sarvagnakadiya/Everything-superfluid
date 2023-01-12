import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";

import AddNetwork from "./AddNetwork";
import CreateFlow from "./CreateFlow";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { goerli, polygon, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import IDADemo from "./IDADemo";

// const { chains, provider, webSocketProvider } = configureChains(
//   [chain.polygon],
//   [publicProvider()]
// );

// const client = createClient({
//   provider,
//   webSocketProvider,
// });

function App() {
  const { chains, provider } = configureChains(
    [mainnet, polygon, goerli],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "projectone",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <div className="App">
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          {/* <CreateFlow></CreateFlow> */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add-network" element={<AddNetwork />} />
              <Route path="/create-flow" element={<CreateFlow />} />
              <Route path="/create-index" element={<IDADemo />} />

              {/* <Route path="/create-platform" element={<CreatePlatform />} /> */}
            </Routes>
          </BrowserRouter>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
