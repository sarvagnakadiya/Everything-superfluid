import "./App.css";
import Home from "./Home";
import { WagmiConfig, createClient, configureChains, goerli } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

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
        <Home></Home>
      </WagmiConfig>
    </div>
  );
}

export default App;
