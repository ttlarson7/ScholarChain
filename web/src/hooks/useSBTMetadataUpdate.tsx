

import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";

import { Transaction } from "@mysten/sui/transactions";


export function useSBTMetadataUpdate() {
  const packageId = "0x73c635e8402efdf07f1c1d3f7862f97cb4953d025ce690b95de8ba1a33407fc4";
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute, isSuccess, isPending } = useSignAndExecuteTransaction();
  
  // Return a function that takes the SBT object ID and metadata
  return {
    updateMetadata: (sbtObjectId: any, metadata: any) => {
      // Create a new transaction
      const tx = new Transaction();
      
      // Add the moveCall with proper arguments
      tx.moveCall({
        target: `${packageId}::student_sbt::update_metadata`,
        arguments: [
          tx.object(sbtObjectId),
          tx.pure.vector("vector<String>",metadata.map((item:any) => tx.pure.string(item))),
          tx.pure.address(currentAccount?.address || "")
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
  