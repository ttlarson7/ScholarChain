import React, { useEffect, useState } from "react";
import { Search, Filter, Download, RefreshCcw, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { graphql } from '@mysten/sui/graphql/schemas/latest';
import { TESTNET_SCHOLARSHIP_PACKAGE_ID } from "@/lib/constants";
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { Transaction } from "@mysten/sui/transactions";


const StudentSBTDashboard = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const suiClient = useSuiClient();
  const gqlClient = new SuiGraphQLClient({
    url: "https://sui-testnet.mystenlabs.com/graphql",
  });
  const currentAccount = useCurrentAccount();
  
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const chainObjectsByTypeQuery = graphql(`
    query GetObjectsByType($type: String!, $first: Int!, $after: String) {
      objects(first: $first, after: $after, filter: { type: $type }) {
        nodes {
          address
          version
          digest
        }
      }
    }
  `);

  async function fetchObjectsByType(type: string, first = 10, after: string | null = null) {
    const response = await gqlClient.query({
        query: chainObjectsByTypeQuery,
        variables: { type, first, after },
    });

    console.log("Response:", response);
    if (response.data && response.data.objects) {
      return response;
    } else {
      throw new Error("Failed to fetch objects by type");
    }
  }

  const fetchStudentNFTs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Query for all StudentNFTs
        const response = await fetchObjectsByType(
            TESTNET_SCHOLARSHIP_PACKAGE_ID + "::student_sbt::StudentSBT",
            10
        );

      if (response && response.data) {
        // Process and transform the raw NFT data
        const processedData = await Promise.all(
          response.data.objects.nodes.map(async (nft) => {
            // Fetch more details for each NFT
            const objectData = await suiClient.getObject({
              id: nft.address,
              options: { showContent: true, showOwner: true },
            });
            console.log("Object Data:", objectData);

            // Extract relevant fields from the object data
            const content = objectData.data?.content;
            const fields = content?.fields || {};
            const owner = fields.owner;

            // Map the blockchain data to our component's data structure
            return {
              id: nft.address,
              name: fields.name || "Unknown Student",
              walletAddress: owner || "Unknown Owner",
              sbtId: nft.address,
              program: fields.program || "Unknown Program",
              status: fields.status || "active",
              attributes: fields.metadata?.map((attr) => attr.name) || [],
            };
          })
        );

        setStudents(processedData);
      }
    } catch (err) {
      console.error("Error fetching student NFTs:", err);
      setError("Failed to load student data from the Sui blockchain");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStudentNFTs();
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchStudentNFTs();
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.sbtId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Truncate addresses for display
  const truncateAddress = (address) => {
    if (typeof address !== 'string') return 'Invalid Address';
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleSponsorClick = async (vaultId: string) => {
    
    // Handle the sponsor button click here
    console.log("Sponsor button clicked for vault:", vaultId);

    const coins = await suiClient.getCoins({
      owner: currentAccount!.address,
      coinType: '0x2::sui::SUI',
    });

    const amount = 500_000;

    const mainCoin = coins.data.find((c) => BigInt(c.balance) > BigInt(amount));
    if (!mainCoin) throw new Error('Not enough SUI balance');

    const tx = new Transaction();

    const [splitCoin] = tx.splitCoins(tx.object(mainCoin.coinObjectId), [
      tx.pure.u64(amount),
    ]);

    tx.moveCall({
      arguments: [
        tx.object(vaultId),
        splitCoin,
        tx.pure.u64(0),
      ],
      target: `${TESTNET_SCHOLARSHIP_PACKAGE_ID}::funding_vault::deposit`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          console.log("Deposit transaction sent:", digest);
        },
        onError: (error) => {
          console.error("Error sending deposit transaction:", error);
        }
      }
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b">
        <div className="py-4 px-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Sponsor Dashboard
          </h1>
          <p className="text-gray-500">
            Manage and view students on ScholarChain network
          </p>
        </div>
      </div>

      <div className="p-6 bg-gray-50 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 w-1/2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search by name, wallet or SBT ID"
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Program</DropdownMenuItem>
                <DropdownMenuItem>Status</DropdownMenuItem>
                <DropdownMenuItem>Attributes</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-2">
            {/* <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              <span>Export</span>
            </Button> */}
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCcw size={16} />
              <span>Refresh</span>
            </Button>
            {/* <Button className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Issue New SBT</span>
            </Button> */}
          </div>
        </div>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>All Students</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Show:</span>
                <Select defaultValue="10">
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription>
              {filteredStudents.length} students with SBTs on Sui Network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>SBT ID</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {truncateAddress(student.walletAddress)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {truncateAddress(student.sbtId)}
                    </TableCell>
                    <TableCell>{student.program}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          student.status
                        )}`}
                      >
                        {student.status.charAt(0).toUpperCase() +
                          student.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => handleSponsorClick(student.sbtId)}>
                        Sponsor
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-500">
              Showing {filteredStudents.length} of {students.length} students
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StudentSBTDashboard;
