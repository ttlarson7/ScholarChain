import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { TESTNET_SCHOLARSHIP_PACKAGE_ID } from "@/lib/constants";

export function CreateVault({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const fundingVaultPackageId =
  TESTNET_SCHOLARSHIP_PACKAGE_ID;
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const {
    mutate: signAndExecute,
    isSuccess,
    isPending,
  } = useSignAndExecuteTransaction();

  function create() {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [tx.pure.address(currentAccount!.address)],
      target: `${fundingVaultPackageId}::funding_vault::create_vault`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await suiClient.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });


          const vaultId = effects?.created?.[0]?.reference?.objectId;
          if (vaultId) {
            console.log("Funding Vault created:", vaultId);
            onCreated(vaultId);
          }
        },
        onError: (error) => {
          console.error("Error creating vault:", error);
        }
      }
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-lg font-semibold">Create New Funding Vault</h2>

      <Button
        className="w-full"
        onClick={create}
        disabled={isSuccess || isPending || !currentAccount}
      >
        {isSuccess || isPending ? "Loading" : "Create Vault"}
      </Button>
    </div>
  );
}
