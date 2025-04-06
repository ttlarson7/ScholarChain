import React, { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  User,
  Upload,
  FilePlus,
  Save,
  BookOpen,
  Award,
  ChevronRight,
} from "lucide-react";
import { SuiClient } from "@mysten/sui/client";
// import { fetchStudentSBTByOwner } from "@/hooks/useStudentSBT";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { TESTNET_SCHOLARSHIP_PACKAGE_ID } from "@/lib/constants";
import { Transaction } from "@mysten/sui/transactions";
import { useSBTMetadataUpdate } from "@/hooks/useSBTMetadataUpdate";


const StudentDashboard: React.FC = () => {
  // Helper function to get initials from name
  const { updateMetadata, isSuccess, isPending } = useSBTMetadataUpdate();
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  const [studentSBT, setStudentSBT] = useState<any>(null);
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  useEffect(() => {
    const fetchStudentSBT = async () => {
      if (!currentAccount?.address) {

        return;
      }
      
      try {

        const objectsResponse = await suiClient.getOwnedObjects({
          owner: currentAccount.address,
          options: {
            showType: true,
            showContent: true,
          },
        });
        
        // Filter objects by the specific NFT type
        const nftsOfType = objectsResponse.data.filter(obj => 
          obj.data?.type && obj.data.type === `${TESTNET_SCHOLARSHIP_PACKAGE_ID}::student_sbt::StudentSBT`
        );
        
        if (nftsOfType.length > 0) {
          const objectData = await suiClient.getObject({
            id: nftsOfType[0].data!.objectId,
            options: { showContent: true, showOwner: true },
          });
          
          console.log("Student SBT loaded:", objectData);
          setStudentSBT(nftsOfType[0].data!.objectId);
          console.log(`Object Id set: ${nftsOfType[0].data!.objectId}`)
        } else {
          console.log("No StudentSBT found for this account");
        }
      } catch (error) {
        console.error("Error fetching StudentSBT:", error);
      } finally {

      }
    };
    
    fetchStudentSBT();
  }, [currentAccount, suiClient]);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    university: "",
    gradeLevel: "",
    major: "",
    gpa: "",
  });

  // Initials state
  const [initials, setInitials] = useState(getInitials(profileData.name));

  // Handle profile data changes
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };

      // Update initials when name changes
      if (name === "name") {
        setInitials(getInitials(value));
      }

      return newData;
    });
  };

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile data submitted:", profileData);
    // Here you would eventually send data to smart contract / backend
  };

  // File upload state and handlers
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    transcript: null,
    resume: null,
    other: null,
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({
        ...prev,
        [fileType]: e.target.files![0],
      }));
    }
  };

  const handleFileUpload = (fileType: string) => {
    console.log(`Uploading ${fileType}:`, files[fileType]);
    // Here you would eventually upload to Walrus or another storage solution
  };

  // Placeholder for currently selected file
  const renderSelectedFile = (fileType: string) => {
    if (files[fileType]) {
      return (
        <div className="text-sm text-blue-600 mt-1 flex items-center">
          <FileText className="h-3 w-3 mr-1" />
          Selected: {files[fileType]?.name}
        </div>
      );
    }
    return null;
  };

  // Mock data for upcoming scholarships
  const upcomingScholarships = [
    {
      name: "STEM Excellence Award",
      deadline: "May 15, 2025",
      amount: "$5,000",
      matches: "High match",
      matchColor: "bg-green-500",
    },
    {
      name: "Future Tech Leaders",
      deadline: "June 2, 2025",
      amount: "$3,500",
      matches: "Good match",
      matchColor: "bg-blue-500",
    },
    {
      name: "Women in Computing",
      deadline: "June 10, 2025",
      amount: "$7,500",
      matches: "Medium match",
      matchColor: "bg-yellow-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="p-6 border-b mb-10">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-blue-600">
              <AvatarImage src="/avatar-placeholder.png" alt="Profile" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold leading-tight">
                {profileData.name}
              </h2>
              <p className="text-xs text-gray-500">Student</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile">
          <nav className="flex-1 p-4 space-y-1">
            <TabsList className="flex flex-col w-full bg-transparent p-0">
              <TabsTrigger
                value="profile"
                className="flex items-center w-full justify-start text-left p-2 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="flex items-center w-full justify-start text-left p-2 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="flex items-center w-full justify-start text-left p-2 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="scholarships"
                className="flex items-center w-full justify-start text-left p-2 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                <Award className="h-5 w-5 mr-2 text-blue-600" />
                Scholarships
              </TabsTrigger>
            </TabsList>

            <Separator className="my-8" />
            <Button
              variant="ghost"
              className="flex items-center w-full justify-start text-left p-2 rounded-lg text-gray-500"
            >
              <span>Settings</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center w-full justify-start text-left p-2 rounded-lg text-gray-500"
            >
              <span>Help & Support</span>
            </Button>
          </nav>
        </Tabs>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 md:p-10 overflow-auto pb-20">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Student Dashboard
          </h1>
          <p className="text-gray-500 max-w-lg">
            Welcome back, {profileData.name}! Manage your academic profile and
            documents, and explore matching scholarships.
          </p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-lg overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Profile Status
                  </p>
                  <h3 className="text-2xl font-bold text-blue-900">Active</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 rounded-lg overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">
                    Verified Documents
                  </p>
                  <h3 className="text-2xl font-bold text-purple-900">2 / 3</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 rounded-lg overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">
                    Scholarship Matches
                  </p>
                  <h3 className="text-2xl font-bold text-green-900">5</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funding Summary */}
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-8 overflow-hidden">
          <h2 className="text-lg font-bold mb-4">Funding Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Received
                </p>
                <h3 className="text-3xl font-bold text-gray-900">$7,500</h3>
                <p className="text-xs text-gray-500 mt-1">
                  From 2 scholarships
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                <FileText className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Applications
                </p>
                <h3 className="text-3xl font-bold text-gray-900">$12,500</h3>
                <p className="text-xs text-gray-500 mt-1">
                  From 3 scholarships
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white border w-full p-1 rounded-lg flex flex-wrap">
            <TabsTrigger
              value="profile"
              className="rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center flex-grow basis-1/4"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center flex-grow basis-1/4"
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center flex-grow basis-1/4"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger
              value="scholarships"
              className="rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center flex-grow basis-1/4"
            >
              <Award className="h-4 w-4 mr-2" />
              Scholarships
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="shadow-sm rounded-lg overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Academic Profile
                    </CardTitle>
                    <CardDescription>
                      Enter your academic information to be verified by your
                      institution
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleProfileSubmit}>
                    <CardContent className="space-y-4 pt-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="university">University/College</Label>
                          <Input
                            id="university"
                            name="university"
                            placeholder="Stanford University"
                            value={profileData.university}
                            onChange={handleProfileChange}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gradeLevel">Grade Level</Label>
                          <Select
                            name="gradeLevel"
                            value={profileData.gradeLevel}
                            onValueChange={(value) =>
                              setProfileData((prev) => {
                                const newData = {
                                  ...prev,
                                  gradeLevel: value,
                                };
                                return newData;
                              })
                            }
                          >
                            <SelectTrigger
                              id="gradeLevel"
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            >
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem
                                value="freshman"
                                className="hover:bg-blue-100"
                              >
                                Freshman
                              </SelectItem>
                              <SelectItem
                                value="sophomore"
                                className="hover:bg-blue-100"
                              >
                                Sophomore
                              </SelectItem>
                              <SelectItem
                                value="junior"
                                className="hover:bg-blue-100"
                              >
                                Junior
                              </SelectItem>
                              <SelectItem
                                value="senior"
                                className="hover:bg-blue-100"
                              >
                                Senior
                              </SelectItem>
                              <SelectItem
                                value="graduate"
                                className="hover:bg-blue-100"
                              >
                                Graduate
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="major">Major/Field of Study</Label>
                          <Input
                            id="major"
                            name="major"
                            placeholder="Computer Science"
                            value={profileData.major}
                            onChange={handleProfileChange}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gpa">GPA</Label>
                          <Input
                            id="gpa"
                            name="gpa"
                            placeholder="4.0"
                            value={profileData.gpa}
                            onChange={handleProfileChange}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 flex items-center justify-end gap-3 py-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={async () => {
                          
                          await updateMetadata(studentSBT, Object.values(profileData));
                          
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Profile
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </div>

              <div>
                <Card className="shadow-sm rounded-lg overflow-hidden h-full">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-blue-600" />
                      Profile Status
                    </CardTitle>
                    <CardDescription>
                      Your verification and completion status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">
                          Verification Status
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 flex items-center"
                          >
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                            Academic Info Verified
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center"
                          >
                            <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
                            Documents Pending
                          </Badge>
                        </div>
                      </div>

                      <div className="pt-3">
                        <h4 className="text-sm font-medium mb-2">Next Steps</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 mr-1 flex-shrink-0" />
                            <span className="text-sm">
                              Upload your transcript
                            </span>
                          </li>
                          <li className="flex items-start">
                            <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 mr-1 flex-shrink-0" />
                            <span className="text-sm">
                              Complete your academic achievements
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Document Uploads
                </CardTitle>
                <CardDescription>
                  Upload your academic documents for verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Transcript Upload */}
                <div className="border rounded-lg p-5 hover:border-blue-300 transition-colors bg-white overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Academic Transcript</h3>
                        <p className="text-xs text-gray-500">
                          Required for verification
                        </p>
                      </div>
                    </div>
                    <div>
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        Pending
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Upload your official transcript issued by your university
                      registrar's office.
                    </div>
                    <div className="flex items-center">
                      <Input
                        id="transcript"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, "transcript")}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {renderSelectedFile("transcript")}
                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={() => handleFileUpload("transcript")}
                        disabled={!files.transcript}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="border rounded-lg p-5 hover:border-blue-300 transition-colors bg-white overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Resume/CV</h3>
                        <p className="text-xs text-gray-500">
                          Helps match with scholarships
                        </p>
                      </div>
                    </div>
                    <div>
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-700 border-gray-200"
                      >
                        Optional
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Upload your current resume to help match you with relevant
                      scholarships and opportunities.
                    </div>
                    <div className="flex items-center">
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, "resume")}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {renderSelectedFile("resume")}
                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={() => handleFileUpload("resume")}
                        disabled={!files.resume}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Other Documents Upload */}
                <div className="border rounded-lg p-5 hover:border-blue-300 transition-colors bg-white overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <FilePlus className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Additional Documents</h3>
                        <p className="text-xs text-gray-500">
                          Letters of recommendation, certificates, etc.
                        </p>
                      </div>
                    </div>
                    <div>
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-700 border-gray-200"
                      >
                        Optional
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Upload any additional documents that strengthen your
                      academic profile and scholarship applications.
                    </div>
                    <div className="flex items-center">
                      <Input
                        id="other"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, "other")}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {renderSelectedFile("other")}
                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={() => handleFileUpload("other")}
                        disabled={!files.other}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50">
                <p className="text-sm text-gray-500">
                  All documents will be securely stored on the blockchain using
                  Walrus and only accessible to authorized validators.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
  <Card className="shadow-sm rounded-lg overflow-hidden">
    <CardHeader className="bg-gray-50 border-b">
      <CardTitle className="flex items-center">
        Academic Achievements
      </CardTitle>
      <CardDescription>
        Track and update your academic accomplishments
      </CardDescription>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="space-y-6">
        {/* GPA Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Academic Progress</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current-gpa">Current GPA</Label>
              <Select>
                <SelectTrigger id="current-gpa" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select your GPA" />
                </SelectTrigger>
                          <SelectContent className="bg-white">
                          <SelectItem value="4.0" className="hover:bg-gray-100">Select your GPA</SelectItem>          
                  <SelectItem value="4.0" className="hover:bg-gray-100">4.0</SelectItem>
                  <SelectItem value="3.9" className="hover:bg-gray-100"> Greater than 3.5</SelectItem>
                  <SelectItem value="3.8" className="hover:bg-gray-100">Greater than 3.0</SelectItem>
                  <SelectItem value="3.7" className="hover:bg-gray-100">Greater than 2.5</SelectItem>
                  <SelectItem value="3.6" className="hover:bg-gray-100">Greater than 2.0</SelectItem>
                  <SelectItem value="3.5" className="hover:bg-gray-100">Less than 2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="years-completed">Years Completed</Label>
              <Select>
                <SelectTrigger id="years-completed" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select years completed" />
                </SelectTrigger>
                          <SelectContent className="bg-white">
                          <SelectItem value="freshman" className="hover:bg-gray-100">Select years completed</SelectItem>
                  <SelectItem value="freshman" className="hover:bg-gray-100">Freshman (1st year)</SelectItem>
                  <SelectItem value="sophomore" className="hover:bg-gray-100">Sophomore (2nd year)</SelectItem>
                  <SelectItem value="junior" className="hover:bg-gray-100">Junior (3rd year)</SelectItem>
                  <SelectItem value="senior" className="hover:bg-gray-100">Senior (4th year)</SelectItem>
                  <SelectItem value="5plus" className="hover:bg-gray-100">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        

        {/* Add Achievement Form */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Add New Achievement or Award</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="award-title">Award Title</Label>
                <Input
                  id="award-title"
                  placeholder="e.g., Scholarship, Award, Honor"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-date">Date Received</Label>
                <Input
                  id="award-date"
                  type="date"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-issuer">Issued By</Label>
                <Input
                  id="award-issuer"
                  placeholder="e.g., Department, College, University"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-type">Award Type</Label>
                <Select>
                  <SelectTrigger id="award-type" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select award type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="scholarship" className="hover:bg-gray-100">Scholarship</SelectItem>
                    <SelectItem value="academic-honor" className="hover:bg-gray-100">Academic Honor</SelectItem>
                    <SelectItem value="research" className="hover:bg-gray-100">Research Award</SelectItem>
                    <SelectItem value="competition" className="hover:bg-gray-100">Competition</SelectItem>
                    <SelectItem value="recognition" className="hover:bg-gray-100">Recognition</SelectItem>
                    <SelectItem value="other" className="hover:bg-gray-100">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="award-description">Description</Label>
                <Textarea
                  id="award-description"
                  placeholder="Brief description of your achievement or award"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="award-document">Supporting Document (Optional)</Label>
                <Input
                  id="award-document"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
                    </div>

        </div>
      </div>
              </CardContent>
              
              <CardFooter className="border-t bg-gray-50 flex justify-between items-center p-4">
  <p className="text-sm text-gray-500 max-w-2xl">
    All achievements require verification by your academic institution before they appear publicly on your profile.
  </p>
  <Button className="bg-blue-600 hover:bg-blue-700 text-white ml-4">
    Update Achievements
  </Button>
</CardFooter>
              
  </Card>
</TabsContent>

          {/* Scholarships Tab */}
          <TabsContent value="scholarships">
            <Card className="shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-600" />
                  Matching Scholarships
                </CardTitle>
                <CardDescription>
                  Scholarships that match your academic profile
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {upcomingScholarships.map((scholarship, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:border-blue-300 transition-colors bg-white overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-lg">
                            {scholarship.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={`${scholarship.matchColor} text-white border-0`}
                            >
                              {scholarship.matches}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              Deadline: {scholarship.deadline}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="font-bold text-lg">
                            {scholarship.amount}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50">
                <p className="text-sm text-gray-500">
                  Complete your profile to improve scholarship matching and
                  increase your chances of receiving funding.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
