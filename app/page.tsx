/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DynamicConnectButton,
  DynamicNav,
  DynamicUserProfile,
  useDynamicContext,
  useFunding,
} from "@dynamic-labs/sdk-react-core";
import { useState } from "react";
import { getChain } from "@dynamic-labs/utils";


export default function Home() {
  const [signature, setSignature] = useState<string | null>(null);

  const { primaryWallet, walletConnector } = useDynamicContext();

  const { openFunding } = useFunding();

  const PRIMARY_CHAIN_ID = 80002;

  const signMessage = async () => {
    setSignature(null);

    try {
      if (!primaryWallet) return;

      const signer: any = await primaryWallet.connector.getSigner();

      if (!signer) return;

      console.log(signer);
      console.log(primaryWallet);

      const signature = await signer.signMessage({
        account: primaryWallet.address,
        message: "Sign this message to prove your identity.",
      });

      console.log("signature", signature);
      setSignature(signature);
    } catch (e) {
      console.log(e);
    }
  };
  function isInsufficientFundsError(error: any) {
    // Check if it's a TransactionExecutionError
    if (error.name === 'TransactionExecutionError') {
      // Check for InsufficientFundsError
      if (error.cause && error.cause.name === 'InsufficientFundsError') {
        return true;
      }

      // Check for specific phrases in the error message
      const errorMessage = error.message.toLowerCase();
      if (
        errorMessage.includes('insufficient funds') ||
        errorMessage.includes('exceeds the balance of the account')
      ) {
        return true;
      }
    }

    return false;
  }

  const handlePurchase = async () => {
    try {
      if (!primaryWallet && !walletConnector) return;

      console.log("primaryWallet", primaryWallet);

      if (walletConnector?.supportsNetworkSwitching()) {
        await walletConnector?.switchNetwork({ networkChainId: PRIMARY_CHAIN_ID });
        console.log("Success, Network switched");
      }
      console.log("primaryWallet fields", primaryWallet?.chain);

      const provider: any = await primaryWallet?.connector.getSigner();

      if (!provider) {
        console.log("Provider not found");
        return;
      }

      console.log(provider);

      const txHash = await provider.sendTransaction({
        chain: getChain(PRIMARY_CHAIN_ID),
        account: primaryWallet?.address,
      });

      console.log("Transaction hash", txHash);
    } catch (e) {
      console.log("low funds: ", isInsufficientFundsError(e))
      if (isInsufficientFundsError(e)) {
        console.log("Insufficient funds");
        openFunding().then(() => {
          console.log("Funding modal opened");
        });
      }
    }
  };


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex w-full justify-between">
        <DynamicConnectButton buttonClassName="py-2 px-4 bg-neutral-800 flex text-white items-center justify-center rounded-xl hover:bg-slate-600">
          Connect via Dynamic
        </DynamicConnectButton>
        {primaryWallet ? (
          <>
            <div className="p-2 ">
              <DynamicUserProfile />
            </div>
            <div className="p-2 ">
              <DynamicNav />
            </div>
          </>
        ) : null}

        {primaryWallet ? (
          <>
            <button
              className="px-4 bg-neutral-800 flex items-center text-white justify-center rounded-xl hover:bg-slate-600"
              onClick={signMessage}
            >
              Sign a Message By Primary Wallet
            </button>
            <button
              className="px-4 bg-neutral-800 flex items-center text-white justify-center rounded-xl hover:bg-slate-600"
              onClick={handlePurchase}
            >
              Purchase
            </button>
          </>
        ) : null}
      </div>
      <div className="flex w-full justify-between">
        {signature ? (
          <div className="px-4 max-w-[600px] text-wrap whitespace-pre-wrap">
            <h2>Signature To Your Identity Prove</h2>
            <p>{signature}</p>
          </div>
        ) : null}
      </div>
    </div >
  );
}
