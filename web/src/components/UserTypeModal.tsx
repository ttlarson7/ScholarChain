import React from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit";
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

  const handleContinue = () => {
    if (isLoggedIn) {
      // If already logged in, proceed with user type setting
      setUserType(selectedType);
      onClose();

      // Redirect to appropriate dashboard
      switch (selectedType) {
        case "student":
          navigate("/student/dashboard");
          break;
        case "validator":
          navigate("/validator/dashboard");
          break;
        case "sponsor":
          navigate("/sponsor/dashboard");
          break;
      }
    }
    // If not logged in, the ConnectButton will handle the wallet connection
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
