import { getFullnodeUrl } from "@mysten/sui/client";
import {
  DEVNET_SCHOLARSHIP_PACKAGE_ID,
  TESTNET_SCHOLARSHIP_PACKAGE_ID,
  MAINNET_SCHOLARSHIP_PACKAGE_ID,
} from "./constants.ts";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
  	devnet: {
  		url: getFullnodeUrl("devnet"),
  		variables: {
  			scholarshipPackageId: DEVNET_SCHOLARSHIP_PACKAGE_ID,
  		},
  	},
  	testnet: {
  		url: getFullnodeUrl("testnet"),
  		variables: {
            scholarshipPackageId: TESTNET_SCHOLARSHIP_PACKAGE_ID,
  		},
  	},
  	mainnet: {
  		url: getFullnodeUrl("mainnet"),
  		variables: {
            scholarshipPackageId: MAINNET_SCHOLARSHIP_PACKAGE_ID,
  		},
  	},
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };