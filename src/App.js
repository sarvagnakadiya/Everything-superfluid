import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AddNetwork from "./AddNetwork";
import { WagmiConfig, createClient, configureChains, goerli } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { Link } from "react-router-dom";

const { provider, webSocketProvider } = configureChains(
  [goerli],
  [publicProvider()]
);

const client = createClient({
  provider,
  webSocketProvider,
});

function App() {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        {/* <AddNetwork></AddNetwork> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-network" element={<AddNetwork />} />
          </Routes>
        </BrowserRouter>
      </WagmiConfig>
    </div>
  );
}

export default App;
