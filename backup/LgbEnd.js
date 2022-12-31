import React from "react";
import "../styles/single.scss";
import { ethers } from "ethers";
import quickPay_abi from "../artifacts/fluidpay.json";
import { useEffect, useState, useRef } from "react";

function LbgEnd() {
  const CONTRACT_ADDRESS = "0x25f4e7912eDbA1C47C63B6BA4Ac14Eb7dB876954";
  const [streamDuration, setDuration] = useState("");
  const dataFetchedRef = useRef(false);
  const [data, setData] = useState("Ending your stream...");

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const endStream = async () => {
      console.log("getting");
      const platform = "0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8";
      const user = "0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb";
      if (typeof window.ethereum !== "undefined") {
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
        let tx = await connectedContract.deleteStream(user, platform, {
          gasLimit: 500000,
        });
        console.log(tx);
        setData("Your stream is ended. Have a nice day");
        timeBeenStreamed();
      }
    };
    endStream();
  }, []);

  const timeBeenStreamed = async () => {
    console.log("getting");
    const platform = "0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8";
    const user = "0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb";
    if (typeof window.ethereum !== "undefined") {
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
      let tx = await connectedContract.timeBeenStreamed(user, platform);
      console.log(tx);
      setDuration(tx);
    }
  };
  return (
    <div className="single-orgs-page">
      <hr />
      <div className="orgs-name">
        <h1>{data}</h1>
      </div>
      <hr />
      {streamDuration ? <h2>{parseInt(streamDuration._hex)} seconds</h2> : null}
      {streamDuration ? (
        <h2>{parseInt(streamDuration._hex) * 0.00001} DAIx transfered</h2>
      ) : null}
    </div>
  );
}

export default LbgEnd;
