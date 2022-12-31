import React, { useState } from "react";
import { customHttpProvider } from "./config";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { ethxABI } from "./config";
import { Button, Form, FormGroup, FormControl, Spinner } from "react-bootstrap";
import "./upgradeDAI.css";

//where the Superfluid logic takes place
async function ethUpgrade(amt) {
  const sf = await Framework.create({
    chainId: 5,
    provider: customHttpProvider,
  });

  const signer = sf.createSigner({
    privateKey:
      "0xd2ebfb1517ee73c4bd3d209530a7e1c25352542843077109ae77a2c0213375f1",
    provider: customHttpProvider,
  });

  //ETHx address on kovan
  //the below code will work on MATICx on mumbai/polygon as well
  const ETHxAddress = "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947";

  const ETHx = new ethers.Contract(ETHxAddress, ethxABI, customHttpProvider);

  try {
    console.log(`upgrading ${amt} ETH to ETHx`);

    const amtToUpgrade = ethers.utils.parseEther(amt.toString());
    const reciept = await ETHx.connect(signer).upgradeByETH({
      value: amtToUpgrade,
    });
    await reciept.wait().then(function (tx) {
      console.log(
        `
        Congrats - you've just upgraded ETH to ETHx!
      `
      );
    });
  } catch (error) {
    console.error(error);
  }
}

export const UpgradeETH = () => {
  const [amount, setAmount] = useState("");
  const [isUpgradeButtonLoading, setIsUpgradeButtonLoading] = useState(false);
  const [isApproveButtonLoading, setIsApproveButtonLoading] = useState(false);

  function UpgradeButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isUpgradeButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  function ApproveButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isApproveButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleAmountChange = (e) => {
    setAmount(() => ([e.target.name] = e.target.value));
  };

  return (
    <div>
      <h2>Upgrade ETH to ETHx</h2>
      <Form>
        <FormGroup className="mb-3">
          <FormControl
            name="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter the eth amount you'd like to upgrade in whole eth"
          ></FormControl>
        </FormGroup>
        <UpgradeButton
          onClick={() => {
            setIsUpgradeButtonLoading(true);
            ethUpgrade(amount);
            setTimeout(() => {
              setIsUpgradeButtonLoading(false);
            }, 1000);
          }}
        >
          Click to Upgrade Your Tokens
        </UpgradeButton>
      </Form>

      <div className="description">
        <p>
          Go to the UpgradeETH.js component and look at the <b>upgradeETH() </b>
          function to see under the hood
        </p>
      </div>
    </div>
  );
};
