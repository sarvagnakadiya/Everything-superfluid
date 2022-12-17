import React from "react";
import { useProvider, useSigner, useAccount, useNetwork } from "wagmi";
import { Framework } from "@superfluid-finance/sdk-core";
// import { ethers } from "ethers";

function CreateFlow() {
  const { address } = useAccount();
  const { chain } = useNetwork();

  console.log(address);
  console.log(chain);
  const provider = useProvider();
  const { data: signer } = useSigner();
  const ETHx = "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947";
  const custom = async () => {
    console.log("provider being created...");
    // const customHttpProvider = new ethers.providers.JsonRpcProvider(
    //   "https://eth-goerli.g.alchemy.com/v2/zfWv3pEito9Wi7gDUSLsand11To5VEjN"
    // );
    // console.log(customHttpProvider);
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });

    console.log("signer being created...");
    // const signer = await ethers.getSigners();
    // const signer = sf.createSigner({
    //   privateKey:
    //     "",
    //   provider: customHttpProvider,
    // });
    // console.log(signer);

    try {
      const createFlowOperation = sf.cfaV1.createFlow({
        flowRate: "1000",
        sender: "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde",
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
  const updateStream = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    try {
      const updateFlowOperation = sf.cfaV1.updateFlow({
        flowRate: "10000",
        sender: "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde",
        receiver: "0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8",
        superToken: ETHx,
        // userData?: string
      });

      console.log("Updating your stream...");

      const result = await updateFlowOperation.exec(signer);
      console.log(result);

      console.log(
        `Congrats - you've just updated a money stream!
      View Your Stream At: https://app.superfluid.finance/dashboard/0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8
      Network: Goerli
      Super Token: DAIx
      Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
      Receiver: 0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8
      New FlowRate: 10000
      `
      );
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  };
  const deleteStream = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    try {
      const deleteFlowOperation = sf.cfaV1.deleteFlow({
        flowRate: "10000",
        sender: "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde",
        receiver: "0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8",
        superToken: ETHx,
        // userData?: string
      });

      console.log("Deleting your stream...");

      await deleteFlowOperation.exec(signer);

      console.log(
        `Congrats - you've just deleted your money stream!
         Network: Kovan
         Super Token: DAIx
         Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
         Receiver: 0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8
      `
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      calling custom function:
      <button onClick={() => custom()}>Start the stream</button>
      <button onClick={() => updateStream()}>Update the stream</button>
      <button onClick={() => deleteStream()}>Deleta the stream</button>
    </div>
  );
}

export default CreateFlow;
