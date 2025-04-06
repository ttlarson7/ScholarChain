import { useSuiClientQuery } from '@mysten/dapp-kit';
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect } from 'react';

// Change from export function to const + export
const useStudentSBT = () => {
  const packageId = "0x73c635e8402efdf07f1c1d3f7862f97cb4953d025ce690b95de8ba1a33407fc4";
  const currentAccount = useCurrentAccount();
  
  // Debug: Log the current account address
  useEffect(() => {
    console.log("Current account address:", currentAccount?.address);
  }, [currentAccount]);
  
//   const {
//     data,
//     isPending,
//     isError,
//     error,
//     refetch
//   } = useSuiClientQuery(
//     'getOwnedObjects',
//     {
//       owner: currentAccount?.address || "",
//       options: {
//         showContent: true,
//         showType: true,
//       },
//       filter: {
//         StructType: `${packageId}::student_sbt::StudentSBT`
//       }
//     },
//     {
//       enabled: !!currentAccount?.address,
//     }
    //   );
    
    const { data, isPending, isError, error, refetch } = useSuiClientQuery(
		'getOwnedObjects',
		{ owner: '0x123' },
		{
			gcTime: 10000,
		},
      );

  // Debug: Log the query results
  useEffect(() => {


      console.log(data);
    // Log the raw response data to see its full structure
    console.log("Raw query response:", JSON.stringify(data, null, 2));
    
    if (data) {
      // Log all objects owned by the account
      console.log("All owned objects:", data.data);
      console.log("Total objects found:", data.data?.length || 0);
      
      // Print details of each object
      data.data?.forEach((obj, index) => {
        console.log(`Object ${index + 1}:`, {
          objectId: obj.data?.objectId,
          type: obj.data?.type,

          owner: obj.data?.owner
        });
      });
      
      // Check specifically for the StudentSBT
      const studentSBTs = data.data?.filter(obj => 
        obj.data?.type?.includes("student_sbt::StudentSBT")
      );
      
      if (studentSBTs?.length > 0) {
        console.log(`Found ${studentSBTs.length} StudentSBT objects:`, studentSBTs);
      } else if (!isPending) {
        console.log("No StudentSBT found for this address");
      }
    }
  }, [data, isPending, isError, error]);

  // Extract the StudentSBT from the response
  const studentSBT = data?.data?.[0]?.data;
  
  return {
    studentSBT: studentSBT ? {
      objectId: studentSBT.objectId,
      content: studentSBT.content,
      type: studentSBT.type
    } : null,
    loading: isPending,
    error,
    refetch
  };
};

// Export the hook after defining it
export { useStudentSBT };