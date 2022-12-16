import React from "react";
// import { useProvider, useSigner, useAccount, useNetwork } from "wagmi";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
// import { hre } from "hardhat";

function CreateFlow() {
  // const { address, isConnecting, isDisconnected } = useAccount();
  // const { chain, chains } = useNetwork();

  // console.log(address);
  // console.log(chain);
  // const provider = useProvider();
  // const { data: signer, isError, isLoading } = useSigner();
  const custom = async () => {
    console.log("provider being created...");
    const customHttpProvider = new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.g.alchemy.com/v2/zfWv3pEito9Wi7gDUSLsand11To5VEjN"
    );
    console.log(customHttpProvider);
    const sf = await Framework.create({
      chainId: 5,
      provider: customHttpProvider,
    });

    console.log("signer being created...");
    // const signer = await ethers.getSigners();
    const signer = sf.createSigner({
      privateKey:
        "Private key here (If you need I can share you the private key on discord)",
      provider: customHttpProvider,
    });
    console.log(signer);

    const ETHx = "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947";

    try {
      const createFlowOperation = sf.cfaV1.createFlow({
        flowRate: "1000",
        receiver: "0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8",
        superToken: ETHx,
        // userData?: string
      });

      console.log("Creating your stream...");

      const result = await createFlowOperation.exec(signer);
      console.log(result);

      console.log(
        `Congrats - you've just created a money stream!
        View Your Stream At: https://app.superfluid.finance/dashboard/0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8
        Network: Goerli
        Super Token: DAIx
        Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
        
        FlowRate: 100
        `
      );
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  };
  return (
    <div>
      calling custom function:
      <button onClick={() => custom()}>Start the stream</button>
    </div>
  );
}

export default CreateFlow;
