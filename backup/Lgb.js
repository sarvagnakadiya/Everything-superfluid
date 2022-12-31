import React from "react";
import { ethers } from "ethers";
import quickPay_abi from "../artifacts/fluidpay.json";
import "../styles/single.scss";
import background from "../assets/hero.webp";
import ethlogo from "../assets/eth-logo.webp";
import orgs from "../DynamicComponentsData";

function Lbg() {
  const CONTRACT_ADDRESS = "0x25f4e7912eDbA1C47C63B6BA4Ac14Eb7dB876954";

  const startStream = async () => {
    console.log("getting");
    const platform = "0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8";
    const user = "0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb";
    if (window.ethereum) {
      handleEthereum();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("inside id");
      console.log(quickPay_abi);

      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        quickPay_abi,
        signer
      );
      console.log("wait...");
      let tx = await connectedContract.createStream(user, platform, {
        gasLimit: 500000,
      });
      console.log(tx);
    }
  };

  function handleEthereum() {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      console.log("Ethereum successfully detected!");
    } else {
      console.log("Please install MetaMask!");
    }
  }

  return (
    <div className="single-orgs-page">
      <hr />
      <div className="orgs-name">
        <h1>{orgs[2].name}</h1>
      </div>
      <hr />
      <img className="orgs-image" src={orgs[2].image} alt="imageofthatorgs" />
      <hr />
      <div className="orgs-details">
        <h4>Address</h4>
        <p className="orgs-address">{orgs[2].address}</p>
        <h4>Description</h4>
        <p className="orgs-desc">{orgs[2].description}</p>
        <h4>
          Charges - <span className="orgs-charges">{orgs[2].charges}</span> DAIx
          / sec
        </h4>
        <button className="paynow" onClick={() => startStream()}>
          Pay Now
        </button>
      </div>
      {/* <div className="orgs-qr-code">
        <img src="" alt="qr-code" />
      </div> */}
      {/* <div className="orgs-last-section">
        <img className="background-image" src={background} alt="orgs_image" />
        <img className="ethlogo-image" src={ethlogo} alt="eth_logo" />
      </div> */}
    </div>
  );
}

export default Lbg;
