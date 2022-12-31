import React from "react";
import { useState } from "react";
import { useProvider, useSigner, useAccount, useNetwork } from "wagmi";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import ethxABI from "./artifacts/Abi_ETHx.json";
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import tokenAddressAbi from "./artifacts/tokenSpreaderABI.json";
import TestTokenJSON from "@superfluid-finance/ethereum-contracts/build/contracts/TestToken.json";
import multi from "./artifacts/multi.json";
const TestTokenABI = TestTokenJSON.abi;

function CreateFlow() {
  const { address } = useAccount();
  const { chain } = useNetwork();

  console.log(address);
  console.log(chain);
  const provider = useProvider();
  const { data: signer } = useSigner();
  const ETHx = "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947";

  // const [startTime, setStartTime] = useState("");
  // const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");

  const CONTRACT_ADDRESS = "0x1A9237DD4ef8D1Dcc0D09De89d0D00082e2CbFBb";
  const MULTI_ADDRESS = "0x9D57fF14E65C6610BED567c103C222715BaFC399";
  const connectedContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    tokenAddressAbi,
    provider
  );
  const connectedMulti = new ethers.Contract(MULTI_ADDRESS, multi, provider);
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

      const receipt = await result.wait();
      console.log("transaction completed" + receipt);
      // getflowData();
      console.log(
        `Congrats - you've just created a money stream!
        View Your Stream At: https://app.superfluid.finance/dashboard/0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8
        Network: Goerli
        Super Token: DAIx
        Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
        
        FlowRate: 1000
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
      //call to get stream start date
      const start = await sf.cfaV1.getFlow({
        superToken: "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947",
        sender: await signer.getAddress(),
        receiver: "0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8",
        providerOrSigner: signer,
      });
      console.log(start);
      console.log("starttime:" + Date.parse(start.timestamp));
      // setStartTime(Date.parse(start.timestamp));
      const startTime = Date.parse(start.timestamp);

      if (start) {
        //to delete stream
        const deleteFlowOperation = sf.cfaV1.deleteFlow({
          flowRate: "10000",
          sender: "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde",
          receiver: "0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8",
          superToken: ETHx,
          // userData?: string
        });

        console.log("Deleting your stream...");

        const result = await deleteFlowOperation.exec(signer);
        const receipt = await result.wait();
        console.log("transaction completed" + receipt);

        console.log(
          `Congrats - you've just deleted your money stream!
           Network: Kovan
           Super Token: DAIx
           Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
           Receiver: 0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8
        `
        );
        if (receipt) {
          let end = await sf.cfaV1.getAccountFlowInfo({
            superToken: "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947",
            account: await signer.getAddress(),
            providerOrSigner: signer,
          });
          console.log(end);
          // console.log("end time:" + Date.parse(end.timestamp));
          // setEndTime(Date.parse(end.timestamp));
          const endTime = Date.parse(end.timestamp);
          console.log("startTime: " + startTime);
          console.log("endtime: " + endTime);
          const totalDuration = (endTime - startTime) / 1000;

          console.log("---------------------------------");
          console.log(totalDuration);
          setDuration(totalDuration);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const upgradEthx = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });

    let options = {
      activeNetworkId: ChainId.GOERLI,
      supportedNetworksIds: [
        ChainId.GOERLI,
        ChainId.POLYGON_MAINNET,
        ChainId.POLYGON_MUMBAI,
      ],
      networkConfig: [
        {
          chainId: ChainId.GOERLI,
          dappAPIKey: "gUv-7Xh-M.aa270a76-a1aa-4e79-bab5-8d857161c561",
        },
        {
          chainId: ChainId.POLYGON_MUMBAI,
          // Optional dappAPIKey (only required if you're using Gasless)
          dappAPIKey: "59fRCMXvk.8a1652f0-b522-4ea7-b296-98628499aee3",
          // if need to override Rpc you can add providerUrl:
        },
        {
          chainId: ChainId.BNB_TESTNET,
          // Optional dappAPIKey (only required if you're using Gasless)
          dappAPIKey: "xIogoMZ7n.65cb71d2-afbe-4792-b68f-f653bd65765b",
          providerUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        },
      ],
    };
    const walletProvider = new ethers.providers.Web3Provider(provider);
    let smartAccount = new SmartAccount(walletProvider, options);
    smartAccount = await smartAccount.init();
    const address = smartAccount.address;
    console.log("address", address);
    const tx = await smartAccount.deployWalletUsingPaymaster();

    //ETHx address on kovan
    //the below code will work on MATICx on mumbai/polygon as well
    const ETHxAddress = "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947";

    const ETHx = new ethers.Contract(ETHxAddress, ethxABI, provider);

    try {
      console.log(`upgrading 0.001 ETH to ETHx`);
      const amt = 0.001;
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
  };

  const downgradeEthx = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const ethx = await sf.loadSuperToken("ETHx");
    const amt = 0.002;
    try {
      console.log(`Downgrading $${amt} fDAIx...`);
      const amtToDowngrade = ethers.utils.parseEther(amt.toString());
      // const downgradeOperation = ETHx.downgrade({
      //   amount: amtToDowngrade.toString(),
      // });
      const downgradeOp = ethx.downgrade({
        amount: amtToDowngrade,
      });

      const downgradeTxn = await downgradeOp.exec(signer);
      await downgradeTxn.wait().then(function (tx) {
        console.log(
          `
          Congrats - you've just downgraded DAIx to DAI!
          You can see this tx at https://goerli.etherscan.io/tx/${tx.transactionHash}
          Network: Goerli
          NOTE: you downgraded the dai of 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721.
          You can use this code to allow your users to do it in your project.
          Or you can downgrade tokens at app.superfluid.finance/dashboard.
        `
        );
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getflowData = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const ethx = await sf.loadSuperToken("ETHx");
    console.log(ethx);
    console.log(typeof ethx);
    console.log(signer.getAddress());
    try {
      let res = await sf.cfaV1.getFlow({
        superToken: "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947",
        sender: await signer.getAddress(),
        receiver: "0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8",
        providerOrSigner: signer,
      });
      console.log(res);
      console.log(res.timestamp);
      console.log(Date.parse(res.timestamp));
      // return res;

      let res2 = await sf.cfaV1.getNetFlow({
        superToken: "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947",
        account: await signer.getAddress(),
        providerOrSigner: signer,
      });

      let res3 = await sf.cfaV1.getAccountFlowInfo({
        superToken: "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947",
        account: await signer.getAddress(),
        providerOrSigner: signer,
      });
      console.log(res);
      console.log(res2);
      console.log(res3);
    } catch (error) {
      console.error(error);
    }
  };

  //----------------------------------------------------------------------------------------------------------IDA

  //function to mind daix
  const mindDaix = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const daix = await sf.loadSuperToken("fDAIx");
    console.log("Minting DAIx to contract address...");
    try {
      const daixBalance = await daix.balanceOf({
        account: connectedContract.address,
        providerOrSigner: signer,
      });
      console.log(daixBalance);
      const transferInAmount = ethers.utils.parseEther("1000");
      const fdai = new ethers.Contract(
        daix.underlyingToken.address,
        TestTokenABI,
        signer
      );

      console.log("minting fdai...");
      const mintFdaix = await fdai.mint(signer.getAddress(), transferInAmount);
      console.log(mintFdaix);
      const receipMint = await mintFdaix.wait();
      console.log("MINTING DONE");

      console.log("approving fdai...");
      const approveFdaix = await fdai.approve(
        daix.address,
        transferInAmount.add(transferInAmount)
      );
      const receiptApprove = await approveFdaix.wait();
      console.log(approveFdaix);
      console.log("approved!");

      console.log("upgrading fdai to fdaix...");
      // const daiXUpgradeOperation = await daix.upgrade({
      //   amount: transferInAmount,
      // });
      const daiXUpgradeOperation = await daix.upgrade({
        amount: transferInAmount,
      });
      const upgradeTx = await daiXUpgradeOperation.exec(signer);
      await upgradeTx.wait();
      console.log("fdai upgraded!");

      console.log("transferring to contract address...");
      const daiXTransferOperation = daix.transfer({
        receiver: connectedContract.address,
        amount: transferInAmount,
      });

      const transferTx = await daiXTransferOperation.exec(signer);
      await transferTx.wait(); // Waiting for the transfer transaction to mine so we can correctly view the balance change below
      console.log("transferred");

      console.log(
        "New TokenSpreader SpreaderToken Balance:",
        await daix.balanceOf({
          account: connectedContract.address,
          providerOrSigner: signer,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const transferDaix = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const daix = await sf.loadSuperToken("fDAIx");
    console.log("transferring to contract address...");
    // const ethValue = ethers.utils.parseEther("1");
    // console.log(parseInt(ethValue._hex));
    // console.log(typeof ethValue);
    const transferInAmount = ethers.utils.parseEther("1000");
    const daiXTransferOperation = daix.transfer({
      receiver: connectedContract.address,
      amount: transferInAmount,
    });

    const transferTx = await daiXTransferOperation.exec(signer);
    await transferTx.wait(); // Waiting for the transfer transaction to mine so we can correctly view the balance change below
    console.log("transferred");

    console.log(
      "New TokenSpreader SpreaderToken Balance:",
      await daix.balanceOf({
        account: connectedContract.address,
        providerOrSigner: signer,
      })
    );
    // } catch (err) {
  };
  const distribute = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const daix = await sf.loadSuperToken("fDAIx");
    const tx = await connectedContract.distribute(1);
    console.log(tx);
    const receipt = await tx.wait();
  };

  const ida = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    //daix token loading
    const daix = await sf.loadSuperToken("fDAIx");

    //get subscription data
    const getSub = await daix.getSubscription({
      publisher: connectedContract.address,
      indexId: 1,
      subscriber: "0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb",
      providerOrSigner: signer,
    });
    console.log(getSub);

    try {
      //---------------------------approveSubscription
      const subscribeOperation = daix.approveSubscription({
        indexId: 1,
        publisher: connectedContract.address,
      });
      const tx = await subscribeOperation.exec(signer);
      const receipt = await tx.wait();
      if (receipt) {
        console.log("approved!");
      }
    } catch (err) {
      if (
        err.errorObject.errorObject.error.reason ==
        "execution reverted: IDA: E_SUBS_APPROVED"
      ) {
        console.log("shareGainer already approved subscription. moving on ->");
      }
    }
    const gainShareTx = await connectedContract
      .connect(signer)
      .gainShare("0xcc920c851327AF767b4bf770e3b2C2ea50B90fde");
    const receipt_gainShare = await gainShareTx.wait();

    console.log(
      `New 0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb units held:`,
      (
        await daix.getSubscription({
          publisher: connectedContract.address,
          indexId: 1,
          subscriber: "0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb",
          providerOrSigner: signer,
        })
      ).units
    );
  };
  const getIndexData = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const daix = await sf.loadSuperToken("fDAIx");
    try {
      let res = await daix.getIndex({
        publisher: connectedContract.address,
        indexId: 1,
        providerOrSigner: signer,
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const getMultiData = async () => {
    let arr = [];
    const getTotalValue = await connectedMulti.viewTotalValue(
      "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde"
    );
    console.log("total values: " + getTotalValue);
    if (getTotalValue) {
      const get_tx = await connectedMulti.ViewData(
        "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde"
      );
      for (let i = 0; i < getTotalValue; i++) {
        console.log("index");
        console.log(parseInt(get_tx[i][0]));
        console.log(parseInt(get_tx[i][1]));
        if (parseInt(get_tx[i][1]) === 1) {
          arr.push([parseInt(get_tx[i][0]), parseInt(get_tx[i][1])]);
        }
        // console.log(get_tx[i][0]);
      }
      console.log("active index");
      console.log(arr);
    }
  };
  return (
    <div>
      calling custom function:
      <button onClick={() => custom()}>Start the stream</button>
      <button onClick={() => updateStream()}>Update the stream</button>
      <button onClick={() => deleteStream()}>Deleta the stream</button>
      <button onClick={() => upgradEthx()}>Upgrade eth to ethx</button>
      <button onClick={() => downgradeEthx()}>downgeade eth to ethx</button>
      <button onClick={() => getflowData()}>get flow data</button>
      <button onClick={() => ida()}>IDA</button>
      <button onClick={() => mindDaix()}>mint DAIx</button>
      <button onClick={() => getIndexData()}>get index data</button>
      <button onClick={() => getMultiData()}>get multi data</button>
      <button onClick={() => transferDaix()}>
        transfer to contract address
      </button>
      <button onClick={() => distribute()}>distribute</button>
    </div>
  );
}

export default CreateFlow;
