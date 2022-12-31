import { ethers } from "ethers";
import TokenSpreaderABI from "./artifacts/tokenSpreaderABI.json";
import { useProvider, useSigner, useAccount, useNetwork } from "wagmi";
import { Framework } from "@superfluid-finance/sdk-core";

const IDA = async () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  console.log("address" + address);
  console.log("chain" + chain);
  const provider = useProvider();
  const { data: signer } = useSigner();
  console.log("provider" + provider);
  console.log("signer" + signer);

  const deployedTokenSpreaderAddress =
    "0x005148eC0D7eB26d7D648B7CD807240FC9AC2eb5";
  // Get signer objects from private key as potential receivers of unit from gainShare
  //   let alice;
  //   let bob;
  //   let carol;
  //   let mallory;
  //   [alice, bob, carol, mallory] = await ethers.getSigners();

  let shareGainer = "0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb"; // SELECT FROM ALICE, BOB, CAROL, OR MALLORY at your discretion

  // Setting up network object - this is set as the goerli url, but can be changed to reflect your RPC URL and network of choice
  //   const url = `${process.env.GOERLI_URL}`;
  //   const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
  //   const network = await customHttpProvider.getNetwork();

  // Getting tokenSpreader contract object
  const tokenSpreader = new ethers.Contract(
    deployedTokenSpreaderAddress,
    TokenSpreaderABI,
    provider
  );

  const sf = await Framework.create({
    chainId: chain,
    provider: provider,
  });

  // Getting the Goerli fDAIx Super Token object from the Framework object
  // This is fDAIx on goerli - you can change this token to suit your network and desired token address
  const daix = await sf.loadSuperToken("fDAIx");

  console.log("Running gainShare() script...");

  // View shares that shareGainer has
  console.log(
    `Original 0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb units held:`,
    (
      await daix.getSubscription({
        publisher: tokenSpreader.address,
        indexId: await tokenSpreader.INDEX_ID(),
        subscriber: shareGainer.address,
        providerOrSigner: signer,
      })
    ).units
  );

  try {
    // shareGainer will subscribe to tokenSpreader's index so that tokens will successfully go through to them
    // NOTE: if an account is not subscribed, but receives a distribution, its tokens will essentially “hang in limbo” until the account subscribes, after which they will go through
    const subscribeOperation = daix.approveSubscription({
      indexId: await tokenSpreader.INDEX_ID(),
      publisher: tokenSpreader.address,
    });
    await subscribeOperation.exec(signer);
  } catch (err) {
    // if shareGainer already approved subscription, carry on past error
    if (
      err.errorObject.errorObject.error.reason ==
      "execution reverted: IDA: E_SUBS_APPROVED"
    ) {
      console.log("shareGainer already approved subscription. moving on ->");
    }
  }

  // Give shareGainer a share
  const gainShareTx = await tokenSpreader
    .connect(signer)
    .gainShare("0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb");
  await gainShareTx.wait();

  // View shares that shareGainer has
  console.log(
    `New 0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb units held:`,
    (
      await daix.getSubscription({
        publisher: tokenSpreader.address,
        indexId: await tokenSpreader.INDEX_ID(),
        subscriber: "0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb",
        providerOrSigner: signer,
      })
    ).units
  );
  return <div>IDA</div>;
};

export default IDA;
