import React from "react";
import {
  useProvider,
  useSigner,
  useAccount,
  useNetwork,
  useContract,
} from "wagmi";

function CreatePlatform() {
  const CONTRACT_ADDRESS = "0xAF19845bca64C04988C3817939E2Cf4Aada351B7";
  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const connectedContract = useContract({
    address: CONTRACT_ADDRESS,
    abi: fluidPay_api,
    signerOrProvider: signer,
  });

  const registerPlatform = async (e) => {
    console.log(platformData);
    const registerPlatformTx = await connectedContract.addPlatform(
      address,
      platformData.platformName,
      platformData.platformImage,
      platformData.platformDescription,
      platformData.platformPhysicalAddress,
      platformData.platformChargesPerSecond
    );
    const receipt = await registerPlatformTx.wait();
    console.log(receipt);
  };

  return (
    <div>
      <button>register</button>
    </div>
  );
}

export default CreatePlatform;
