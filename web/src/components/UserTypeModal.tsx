import React from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserType, useUserType } from "@/contexts/UserTypeContext";
import { GraduationCap, FileCheck, Users } from "lucide-react";
import { Transaction } from "@mysten/sui/transactions";
import { TESTNET_SCHOLARSHIP_PACKAGE_ID } from "@/lib/constants";

type UserTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedType: UserType;
};

const UserTypeModal: React.FC<UserTypeModalProps> = ({
  isOpen,
  onClose,
  selectedType,
}) => {
  const { setUserType, isLoggedIn } = useUserType();
  const navigate = useNavigate();

    const suiClient = useSuiClient();
    const currentAccount = useCurrentAccount();
    const {
      mutate: signAndExecute,
      isSuccess,
      isPending,
    } = useSignAndExecuteTransaction();

  const handleContinue = async () => {
    if (isLoggedIn) {
      // If already logged in, proceed with user type setting
      setUserType(selectedType);
      onClose();

      // Redirect to appropriate dashboard
      switch (selectedType) {
        case "student":
          if (await isExistingUser(currentAccount!.address)) {
            console.log("User is already registered as a student.");
            navigate("/student/dashboard");
          } else {
            console.log("User is not registered as a student. Creating vault and token...");
            InitStudent();
          }

          break;
        case "validator":
          navigate("/validator/dashboard");
          break;
        case "sponsor":
          navigate("/sponsor/dashboard");
          break;
      }
    }

    function InitStudent() {
      const tx = new Transaction();

      tx.moveCall({
        arguments: [tx.pure.address(currentAccount!.address)],
        target: `${TESTNET_SCHOLARSHIP_PACKAGE_ID}::funding_vault::create_vault`,
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


            console.log("effects:", effects);
            const vaultId = effects?.created?.[0]?.reference?.objectId;
            if (vaultId) {
              console.log("Funding Vault created:", vaultId);
              console.log("Minting Student NFT...");

              const tx = new Transaction();
              tx.moveCall({
                arguments: [
                  tx.pure.address(currentAccount!.address),
                  tx.pure.address(vaultId),
                  tx.pure.vector('u8', []),
                  tx.pure.string(""),
                  tx.pure.u64(0),
                ],
                target: `${TESTNET_SCHOLARSHIP_PACKAGE_ID}::student_sbt::mint`,
              });

              signAndExecute(
                {
                  transaction: tx,
                },
                {
                  onSuccess: async ({ digest }) => {
                    console.log("Student NFT minted:", digest);
                    navigate("/student/dashboard");
                  },
                  onError: (error) => {
                    console.error("Error minting Student NFT:", error);
                  }
                }
              );
            }
          },
          onError: (error) => {
            console.error("Error creating vault:", error);
          }
        }
      );
    }

    async function isExistingUser(walletAddress: string): Promise<boolean> {    
      try {
        // Get all objects owned by the wallet
        const objectsResponse = await suiClient.getOwnedObjects({
          owner: walletAddress,
          // Optional: Use filters to narrow down results
          options: {
            showType: true,
            showContent: true,
          },
        });
    
        // Filter objects by the specific NFT type
        const nftsOfType = objectsResponse.data.filter(obj => 
          obj.data?.type && obj.data.type === `${TESTNET_SCHOLARSHIP_PACKAGE_ID}::student_sbt::StudentSBT`
        );
    
        // Return true if any matching NFTs were found
        return nftsOfType.length > 0;
      } catch (error) {
        console.error('Error checking NFT ownership:', error);
        throw error;
      }
    }
  };

  const getTypeDetails = () => {
    switch (selectedType) {
      case "student":
        return {
          title: "Join as Student",
          description:
            "Create your academic profile, get verified, and apply for scholarships.",
          icon: <GraduationCap className="h-12 w-12 text-blue-600" />,
          color: "bg-blue-600 hover:bg-blue-700",
        };
      case "validator":
        return {
          title: "Join as Validator",
          description:
            "Verify student credentials and ensure trust in the platform.",
          icon: <FileCheck className="h-12 w-12 text-green-600" />,
          color: "bg-green-600 hover:bg-green-700",
        };
      case "sponsor":
        return {
          title: "Join as Sponsor",
          description: "Create scholarships and support deserving students.",
          icon: <Users className="h-12 w-12 text-purple-600" />,
          color: "bg-purple-600 hover:bg-purple-700",
        };
      default:
        return {
          title: "",
          description: "",
          icon: null,
          color: "",
        };
    }
  };

  const { title, description, icon, color } = getTypeDetails();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">{icon}</div>
          <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <p className="text-center text-sm text-muted-foreground">
            {isLoggedIn
              ? "Continue with your connected wallet to set up your profile."
              : "Connect your SUI wallet to continue. If you don't have a wallet, you'll be directed to install one."}
          </p>
          <div className="flex justify-center">
            {isLoggedIn ? (
              <Button className={`w-full ${color}`} onClick={handleContinue}>
                Continue
              </Button>
            ) : (
              <div className="w-full">
                <ConnectButton
                  connectText="Connect Wallet"
                  className={`w-full ${color}`}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserTypeModal;
