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

  const provider = useProvider();
  const { data: signer } = useSigner();

  //   console.log(address);
  //   console.log(chain);
  //   console.log(subscriberData.subscriberAddress);
  //   console.log(subscriberData.subscriberUnits);

  //------------------Function to create Index---------------------------
  /*
  Must be call by publisher
  params:
    indexID(int)       //choise of your own (must be unique)
    and signer to sign the transaction

  returns:
    log(indexId)
   */
  const createIndex = async () => {
    console.log("Inside createIndex() function");
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const daix = await sf.loadSuperToken("fDAIx");
    try {
      const createIndexOperation = daix.createIndex({
        indexId: id.toString(),
      });
      console.log(`Creating index ID:${id}...`);

      const sign = await createIndexOperation.exec(signer);
      const receipt = await sign.wait(sign);
      if (receipt) {
        console.log(
          `Congrats - you've just created a new Index!
             Network: Goerli
             Super Token: fDAIx
             Index ID: ${id}
          `
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  //------------------Function to add subscriber to the given Index------------------
  /*
    Must be called by publisher
    params:
        indexID(int)       //already created
        subscriber(address)   //address of thr subscriber which you want to add
        units(int)
        and signer to sign the transaction

    returns:
        log(subscriber address,uints & indexId which its subscribing to)
    */
  const addSubscriber = async () => {
    console.log("Inside addSubscriber() function");

    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const daix = await sf.loadSuperToken("fDAIx");
    try {
      const createIndexOperation = daix.updateSubscriptionUnits({
        indexId: id,
        subscriber: subscriberData.subscriberAddress,
        units: subscriberData.subscriberUnits,
      });
      console.log(
        `Adding ${subscriberData.subscriberAddress} as subscriber...`
      );

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

  //------------------Function to get subscription details of a perticular subscriber------------------
  /*
    Must be called by publisher
    params:
        publisher(address)      //address of publisher(who created the IndexId)
        indexID(int)       //already created
        subscriber(address)   //address of thr subscriber which you want to add
        procider/signer

    returns:
        approved(bool), 
        exists(bool), 
        pendingDistribution(int), 
        units(int)
    */
  const getSubscription = async () => {
    console.log("Getting  subscription data");
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const daix = await sf.loadSuperToken("fDAIx");
    try {
      const createIndexOperation = await daix.getSubscription({
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
    indexValue(int),                //value of index
    totalUnitsApproved(int),        //units approved    
    totalUnitsPending(int)          //units pending to be approved
    )
 */

  //------------------Function to get indexId details of a perticular indexId------------------
  /*
        Must be called by publisher
        params:
            publisher(address)      //address of publisher(who created the IndexId)
            indexID(int)       //already created
            procider/signer

        returns
            exists(bool),
            indexValue(int),                //value of index
            totalUnitsApproved(int),        //units approved    
            totalUnitsPending(int)          //units pending to be approved
    
    */
  const getIndex = async () => {
    console.log("Getting Index data");
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const daix = await sf.loadSuperToken("fDAIx");
    try {
      let res = await daix.getIndex({
        publisher: await signer.getAddress(),
        indexId: id,
        providerOrSigner: signer,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  //------------------Function to update Index value of any perticular IndexId------------------
  /*
    Must be called by publisher
    params:
        indexID(string)       //already created
        value(string)       //value you want to send for a distribution(Adds the previous value with given value)
        and signer to sign the transaction

    returns:
        log(indexId to which value updated)
    */
  const updateIndexValue = async () => {
    console.log("Inside updateIndexValue() function");

    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const daix = await sf.loadSuperToken("fDAIx");
    try {
      const createIndexOperation = daix.updateIndexValue({
        indexId: id,
        indexValue: "100000000000000000000",
      });
      console.log("updateing your Index value...");

      const sign = await createIndexOperation.exec(signer);
      const receipt = await sign.wait(sign);
      if (receipt) {
        console.log(`Value is Updated for the Index ID: ${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //------------------Function to Approve subscription------------------
  /*
    Must be called by subscriber
    params:
        indexID(string)       //already created
        publisher(address)      //address of publisher(who created the IndexId)

    returns:
        log(Confirmation)
    */
  const approveSubscription = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });

    const daix = await sf.loadSuperToken("fDAIx");
    try {
      const subscribeOperation = daix.approveSubscription({
        indexId: id,
        publisher: "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde",
      });
      const tx = await subscribeOperation.exec(signer);
      const receipt = await tx.wait();
      if (receipt) {
        console.log("approved!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //------------------Function to revoke subscription------------------
  /*
    Must be called by subscriber
    params:
        indexID(string)       //already created
        publisher(address)      //address of publisher(who created the IndexId)

    returns:
        log(Confirmation)
    */
  const revokeSubscription = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    //daix token loading
    const daix = await sf.loadSuperToken("fDAIx");
    try {
      //---------------------------revoke Subscription-------------------
      const subscribeOperation = daix.revokeSubscription({
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

  //------------------Function to delete subscriber------------------
  /*
    Must be called by publisher
    params:
        indexID(string)       //already created
        subscriber(address)   //address of the subscriber which you want to delete
        publisher(address)      //address of publisher(who created the IndexId)

    returns:
        log(Confirmation)
    */
  const deleteSubscription = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });

    const daix = await sf.loadSuperToken("fDAIx");
    try {
      const subscribeOperation = daix.deleteSubscription({
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

  //------------------Function to Distribute Funds------------------
  /*
    Must be called by publisher
    params:
        indexID(string)       //already created
        amount(string)         //amount which you want to distribute while calling this function
        require -> amount < index Value

    returns:
        log(Confirmation)
    */
  const distributeFunds = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });

    const daix = await sf.loadSuperToken("fDAIx");
    try {
      const subscribeOperation = daix.distribute({
        indexId: id,
        amount: "100000000000000000000",
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

  //------------------Function to Claim Funds(it works like approveSubscription function, but it can directly claim it)------------------
  /*
    Must be called by subscriber
    cant be used if subscriber has already done approve the IndexId
    params:
        indexID(string)       //already created
        subscriber(address)   //Your address
        publisher(address)      //address of publisher(who created the IndexId)

    returns:
        log(Confirmation)
    */
  const claimFunds = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });

    const daix = await sf.loadSuperToken("fDAIx");
    try {
      console.log("claiming funds");
      const subscribeOperation = daix.claim({
        indexId: id,
        subscriber: await signer.getAddress(),
        publisher: "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde",
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
      <button onClick={() => createIndex()}>Create Index</button>
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
      <button onClick={() => approveSubscription()}>IDA</button>
      <button onClick={() => revokeSubscription()}>revoke IDA</button>
      <button onClick={() => deleteSubscription()}>Delete subscriber</button>
      <button onClick={() => distributeFunds()}>Distribute funds</button>
      <button onClick={() => claimFunds()}>claim funds</button>
    </div>
  );
};

export default IDADemo;
