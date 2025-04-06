

import { TESTNET_SCHOLARSHIP_PACKAGE_ID } from "@/lib/constants";
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";

import { Transaction } from "@mysten/sui/transactions";


export function useSBTMetadataUpdate() {
  const packageId =TESTNET_SCHOLARSHIP_PACKAGE_ID;
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute, isSuccess, isPending } = useSignAndExecuteTransaction();
  
  // Return a function that takes the SBT object ID and metadata
  return {
    updateMetadata: (sbtObjectId: any, metadata: any) => {
      // Create a new transaction
      const tx = new Transaction();
      tx.setGasBudget(10000000);
      // Add the moveCall with proper arguments
      tx.moveCall({
        target: `${packageId}::student_sbt::update_metadata`,
        arguments: [
          tx.object(sbtObjectId),
          tx.pure.vector("string", metadata),
        ],
      });
      
      // Execute the transaction
      return signAndExecute(
        { transaction: tx },
        {
          onSuccess: async ({ digest }) => {
            const { effects } = await suiClient.waitForTransaction({
              digest: digest,
              options: { showEffects: true },
            });
            return effects;
          }
        }
      );
    },
    isSuccess,
    isPending
  };
}
  