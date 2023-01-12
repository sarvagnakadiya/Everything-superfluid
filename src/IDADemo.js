import React, { useState } from "react";
import { useProvider, useSigner, useAccount, useNetwork } from "wagmi";
import { Framework } from "@superfluid-finance/sdk-core";
// import { ethers } from "ethers";

const IDADemo = () => {
  //---------All useStates for IDA
  const [id, setID] = useState("");
  const [subscriberData, setSubscriberData] = useState([]);
  const { address } = useAccount();
  const { chain } = useNetwork();

  //   console.log(address);
  //   console.log(chain);
  const provider = useProvider();
  const { data: signer } = useSigner();

  console.log(subscriberData.subscriberAddress);
  console.log(subscriberData.subscriberUnits);

  //------------------to create Index using superfluid' SDK core------------------
  const createIndexSf = async () => {
    // const id = "3";
    console.log("Index creating");
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const ethx = await sf.loadSuperToken("ETHx");
    try {
      const createIndexOperation = ethx.createIndex({
        indexId: id.toString(),
      });
      console.log("Creating your Index...");

      const sign = await createIndexOperation.exec(signer);
      const receipt = await sign.wait(sign);
      if (receipt) {
        console.log(
          `Congrats - you've just created a new Index!
             Network: Goerli
             Super Token: DAIx
             Index ID: ${id}
          `
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  //------------------to create Index using superfluid' SDK core------------------
  const addSubscriber = async () => {
    console.log("Index creating");
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const ethx = await sf.loadSuperToken("ETHx");
    try {
      const createIndexOperation = ethx.updateSubscriptionUnits({
        indexId: id,
        subscriber: subscriberData.subscriberAddress,
        units: subscriberData.subscriberUnits,
      });
      console.log("Creating your Index...");

      const sign = await createIndexOperation.exec(signer);
      const receipt = await sign.wait(sign);
      if (receipt) {
        console.log(
          `subscriber added : ${subscriberData.subscriberAddress} with ${subscriberData.subscriberUnits} uints at Index ID: ${id}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  //gets the subscription data
  //can be called by publisher to check subscription of a perticular subscriber
  // returns(approved(bool), exists(bool), pendingDistribution(int), units(int))
  const getSubscription = async () => {
    console.log("Getting  subscription data");
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const ethx = await sf.loadSuperToken("ETHx");
    try {
      const createIndexOperation = await ethx.getSubscription({
        publisher: await signer.getAddress(),
        indexId: id,
        subscriber: subscriberData.subscriberAddress,
        providerOrSigner: provider,
      });
      console.log("Getting subscription data...");
      console.log(createIndexOperation);
    } catch (error) {
      console.log(error);
    }
  };

  /* get Index' data
  called by publisher
  returns(
    exists(bool),
    indexValue(int),    //value of index
    totalUnitsApproved(int),        //units approved    
    totalUnitsPending(int)          //units pending to be approved
    )
 */
  const getIndex = async () => {
    console.log("Getting Index data");
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const ethx = await sf.loadSuperToken("ETHx");
    try {
      let res = await ethx.getIndex({
        publisher: await signer.getAddress(),
        indexId: id,
        providerOrSigner: signer,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const updateIndexValue = async () => {
    console.log("Update Index Value");
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const ethx = await sf.loadSuperToken("ETHx");
    try {
      const createIndexOperation = ethx.updateIndexValue({
        indexId: id,
        indexValue: "10000",
      });
      console.log("updateing your Index value...");

      const sign = await createIndexOperation.exec(signer);
      const receipt = await sign.wait(sign);
      if (receipt) {
        console.log(`Value Update for Index ID: ${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const ida = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    //daix token loading
    const ethx = await sf.loadSuperToken("ETHx");
    try {
      //---------------------------approveSubscription
      const subscribeOperation = ethx.approveSubscription({
        indexId: id,
        publisher: "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde",
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
  };

  //-----revokes the approved units, but stays as a subscriber
  const revokeIda = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    //daix token loading
    const ethx = await sf.loadSuperToken("ETHx");
    try {
      //---------------------------revoke Subscription-------------------
      const subscribeOperation = ethx.revokeSubscription({
        indexId: id,
        publisher: "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde",
      });
      const tx = await subscribeOperation.exec(signer);
      const receipt = await tx.wait();
      if (receipt) {
        console.log("Revoked!");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deleteSubscription = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    //daix token loading
    const ethx = await sf.loadSuperToken("ETHx");
    try {
      //---------------------------revoke Subscription-------------------
      const subscribeOperation = ethx.deleteSubscription({
        indexId: id,
        subscriber: subscriberData.subscriberAddress,
        publisher: "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde",
      });
      const tx = await subscribeOperation.exec(signer);
      const receipt = await tx.wait();
      if (receipt) {
        console.log("SUBSCRIBER DELETED!");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const distributeFunds = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    //daix token loading
    const ethx = await sf.loadSuperToken("ETHx");
    try {
      //---------------------------Distribute funds-------------------
      const subscribeOperation = ethx.distribute({
        indexId: id,
        amount: "1000",
      });
      const tx = await subscribeOperation.exec(signer);
      const receipt = await tx.wait();
      if (receipt) {
        console.log("FUNDS DISTRIBUTED");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <input type="text" onChange={(e) => setID(e.target.value)}></input>
      <button onClick={() => createIndexSf()}>Create Index</button>
      <br></br>
      <input
        type="text"
        onChange={(e) =>
          setSubscriberData({
            ...subscriberData,
            subscriberAddress: e.target.value,
          })
        }
      ></input>
      <input
        type="text"
        onChange={(e) =>
          setSubscriberData({
            ...subscriberData,
            subscriberUnits: e.target.value,
          })
        }
      ></input>
      <button onClick={() => addSubscriber()}>Add subscriber</button>
      <button onClick={() => getSubscription()}>get Subscription</button>
      <button onClick={() => getIndex()}>get index</button>
      <button onClick={() => updateIndexValue()}>update value</button>
      <button onClick={() => ida()}>IDA</button>
      <button onClick={() => revokeIda()}>revoke IDA</button>
      <button onClick={() => deleteSubscription()}>Delete subscriber</button>
    </div>
  );
};

export default IDADemo;
