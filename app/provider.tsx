"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import useUserStore from "@/lib/store/user";

// import { AlgorandWalletConnectors } from "@dynamic-labs/algorand";
// import { BloctoEvmWalletConnectors } from "@dynamic-labs/blocto-evm";
// import { CosmosWalletConnectors } from "@dynamic-labs/cosmos";
// import { FlowWalletConnectors } from "@dynamic-labs/flow";
// import { MagicEvmWalletConnectors } from "@dynamic-labs/magic";
// import { SolanaWalletConnectors } from "@dynamic-labs/solana";
// import { StarknetWalletConnectors } from "@dynamic-labs/starknet";


export default function Provider({ children }: any) {
  const setUser = useUserStore((state) => state.setUser);
  const setWallet = useUserStore((state) => state.setWallet);

  const user = useUserStore((state) => state.user);
  const wallet = useUserStore((state) => state.wallet);

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID!,
        // newToWeb3WalletChainMap: {
        //   primary_chain: "evm",
        //   wallets: {},
        // },
        walletConnectors: [
          EthereumWalletConnectors,
          // AlgorandWalletConnectors,
          // BloctoEvmWalletConnectors,
          // CosmosWalletConnectors,
          // FlowWalletConnectors,
          // SolanaWalletConnectors,
          // StarknetWalletConnectors,
          // MagicEvmWalletConnectors,
        ],
        eventsCallbacks: {
          onAuthFlowOpen: () => {
            console.log("Auth flow opened");
          },
          onAuthFlowClose: () => {
            console.log("Auth flow closed");
            // todo here hehe
          },
          onAuthFlowCancel: () => {
            console.log("Auth flow canceled");
          },
          // onConnect: (connector) => {
          //   console.log("Wallet connected", connector);
          // },
          onSignedMessage: ({ messageToSign, signedMessage }) => {
            console.log(
              `onSignedMessage was called: ${messageToSign}, ${signedMessage}`
            );
          },
          onAuthSuccess: async (user) => {
            console.log("User authenticated", user);
            setUser(user);

            // const { data, error } = await supabase
            //   .from("dynamic_xyz_user_info")
            //   .select("*")
            //   .eq("email", user.user.email);

            // if (error) {
            //   console.log(error);
            // } else if (data.length === 0) {
            //   // check if primaryWallet is not null
            //   if (user.primaryWallet) {
            //     const { data, error } = await supabase
            //       .from("dynamic_xyz_user_info")
            //       .insert({
            //         email: user.user.email,
            //         primary_wallet_address: user.primaryWallet.address,
            //       });

            //     if (error) {
            //       console.log(error);
            //     } else {
            //       console.log(data);
            //     }
            //   } else {
            //     const { data, error } = await supabase
            //       .from("dynamic_xyz_user_info")
            //       .insert({
            //         email: user.user.email,
            //       });

            //     if (error) {
            //       console.log(error);
            //     } else {
            //       console.log(data);
            //     }
            //   }
            // } else {
            //   console.log("User already exists");
            // }
          },
          onEmbeddedWalletCreated: async (wallet) => {
            console.log("Embedded wallet created", wallet);
            setWallet(wallet);
            // // insert wallet address in supabase against the user email
            // const { data, error } = await supabase
            //   .from("dynamic_xyz_user_info")
            //   .update({
            //     primary_wallet_address: wallet?.address,
            //   })
            //   .eq("email", user.user.email);

            // if (error) {
            //   console.log(error);
            // } else {
            //   console.log(data);
            // }
          },
          onLogout: () => {
            console.log("User logged out");
          },
        },
        privacyPolicyUrl: "https://www.dynamic.xyz/privacy-policy",
        shadowDOMEnabled: true,
        siweStatement: "Custom message to sign",
        termsOfServiceUrl: "https://www.dynamic.xyz/terms-of-service",
        onboardingImageUrl: "https://i.imgur.com/3g7nmJC.png",
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
