import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Award,
  CheckCircle,
  GraduationCap,
  LucideWallet,
  Shield,
  Users,
  FileCheck,
} from "lucide-react";
import { UserType } from "@/contexts/UserTypeContext";
import UserTypeModal from "@/components/UserTypeModal";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { CreateVault } from "@/components/VaultComponent";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<UserType>(null);

  const handleJoinClick = (type: UserType) => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const currentAccount = useCurrentAccount();
  const [vaultId, setVaultId] = useState(() => {
    const hash = window.location.hash.slice(1);
    return hash;
  });
  const [inputVaultId, setInputVaultId] = useState(vaultId);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center text-xl font-bold">
            <img
              src="/logo_nameless.png"
              alt="ScholarChain Logo Nameless"
              className="h-8 w-auto"
            />
            <span>ScholarChain</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4 mr-6">
            <nav className="flex items-center space-x-5">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                How It Works
              </a>
              <a
                href="#faq"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                FAQ
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Decentralized Scholarships on the SUI Blockchain
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connect students with sponsors through trusted verification.
                    Earn scholarships through academic achievements and secure
                    funding with blockchain technology.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleJoinClick("student")}
                  >
                    Join as Student
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleJoinClick("validator")}
                  >
                    Join as Validator
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleJoinClick("sponsor")}
                  >
                    Join as Sponsor
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span>Transparent</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span>Decentralized</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span>Secure</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="ScholarChain"
                  className="rounded-lg object-cover max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* User Roles Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700">
                  Platform Roles
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Find Your Role in Our Ecosystem
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Our platform connects three key participants to create a
                  trusted scholarship ecosystem powered by blockchain
                  technology.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-center gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 hover:shadow-md transition-shadow h-full">
                <div className="rounded-full bg-blue-100 p-3">
                  <GraduationCap className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold">Student</h3>
                <p className="text-center text-muted-foreground flex-grow">
                  Create a profile, share your academic journey, and get funded
                  directly for achieving educational goals. Your achievements
                  become verifiable NFTs.
                </p>
                <Button
                  className="mt-2 bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => handleJoinClick("student")}
                >
                  Join as Student
                </Button>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 hover:shadow-md transition-shadow h-full">
                <div className="rounded-full bg-green-100 p-3">
                  <FileCheck className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="text-xl font-bold">Validator</h3>
                <p className="text-center text-muted-foreground flex-grow">
                  Universities, schools, and trusted institutions verify student
                  credentials and achievements, ensuring the integrity of the
                  platform.
                </p>
                <Button
                  className="mt-2 bg-green-600 hover:bg-green-700 w-full"
                  onClick={() => handleJoinClick("validator")}
                >
                  Join as Validator
                </Button>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 hover:shadow-md transition-shadow h-full">
                <div className="rounded-full bg-purple-100 p-3">
                  <Users className="h-6 w-6 text-purple-700" />
                </div>
                <h3 className="text-xl font-bold">Sponsor</h3>
                <p className="text-center text-muted-foreground flex-grow">
                  Provide scholarships with custom conditions, ensuring your
                  funds go directly to deserving students who meet your specific
                  criteria.
                </p>
                <Button
                  className="mt-2 bg-purple-600 hover:bg-purple-700 w-full"
                  onClick={() => handleJoinClick("sponsor")}
                >
                  Join as Sponsor
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700">
                  Platform Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Why Choose ScholarChain?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Our platform leverages SUI blockchain technology to create a
                  transparent, efficient, and secure connection between
                  students, validators, and sponsors.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-blue-100 p-3">
                  <LucideWallet className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold">Secure Blockchain NFTs</h3>
                <p className="text-center text-muted-foreground">
                  Student profiles are secure NFTs on the SUI blockchain,
                  ensuring data integrity and ownership of academic
                  achievements.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-blue-100 p-3">
                  <Award className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold">Conditional Scholarships</h3>
                <p className="text-center text-muted-foreground">
                  Smart contracts automatically release funds when verified
                  conditions are met, such as maintaining a specific GPA or
                  completing courses.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-blue-100 p-3">
                  <Shield className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold">Trusted Verification</h3>
                <p className="text-center text-muted-foreground">
                  Validators ensure all student claims are legitimate, creating
                  a trustworthy ecosystem for sponsors to confidently provide
                  funding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-white"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Our decentralized platform connects students, validators, and
                  sponsors through blockchain technology.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl gap-6 py-12 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <GraduationCap className="mr-2 h-6 w-6 text-blue-600" />
                  For Students
                </h3>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-blue-100 p-1 text-blue-700">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold">Create Your NFT Profile</h4>
                      <p className="text-muted-foreground">
                        Sign up with zkLogin and create your student NFT profile
                        with your academic details.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-blue-100 p-1 text-blue-700">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold">Upload Documents</h4>
                      <p className="text-muted-foreground">
                        Upload your academic documents to Walrus storage for
                        validator verification.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-blue-100 p-1 text-blue-700">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold">Apply for Scholarships</h4>
                      <p className="text-muted-foreground">
                        Browse and apply for scholarships that match your
                        academic profile and goals.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-blue-100 p-1 text-blue-700">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold">Receive Funding</h4>
                      <p className="text-muted-foreground">
                        Get funds automatically when you meet scholarship
                        conditions, verified by trusted validators.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <FileCheck className="mr-2 h-6 w-6 text-green-600" />
                  For Validators
                </h3>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-green-100 p-1 text-green-700">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold">Register as Validator</h4>
                      <p className="text-muted-foreground">
                        Educational institutions sign up with zkLogin and verify
                        their authority credentials.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-green-100 p-1 text-green-700">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold">Access Documents</h4>
                      <p className="text-muted-foreground">
                        Review student documents securely through Seal's access
                        control system.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-green-100 p-1 text-green-700">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold">Verify Achievements</h4>
                      <p className="text-muted-foreground">
                        Confirm student claims and create blockchain
                        verification attestations.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-green-100 p-1 text-green-700">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold">Monitor Progress</h4>
                      <p className="text-muted-foreground">
                        Track student achievements and provide ongoing
                        verification for conditional scholarships.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <Users className="mr-2 h-6 w-6 text-purple-600" />
                  For Sponsors
                </h3>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-purple-100 p-1 text-purple-700">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold">Create Sponsor Account</h4>
                      <p className="text-muted-foreground">
                        Sign up with zkLogin and set up your SUI wallet for
                        scholarship funding.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-purple-100 p-1 text-purple-700">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold">Browse Verified Students</h4>
                      <p className="text-muted-foreground">
                        Explore student profiles with validated achievements and
                        academic credentials.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-purple-100 p-1 text-purple-700">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold">Create Smart Contracts</h4>
                      <p className="text-muted-foreground">
                        Set up conditional funding with specific requirements
                        using our scholarship vault system.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-purple-100 p-1 text-purple-700">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold">Track Impact</h4>
                      <p className="text-muted-foreground">
                        Monitor your scholarships and see the direct impact of
                        your contributions on student success.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex items-center justify-center">
                <img
                  src="/image.png"
                  alt="Sui Blockchain Technology"
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    Our Technology
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Powered by SUI Ecosystem
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    We leverage powerful blockchain technologies to create a
                    seamless, secure scholarship platform:
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <span>
                      <b>SUI Blockchain:</b> Fast, low-cost transactions with
                      smart contract capabilities
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <span>
                      <b>Walrus:</b> Secure, decentralized document storage for
                      student credentials
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <span>
                      <b>Seal:</b> Advanced access control for document
                      verification and privacy
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <span>
                      <b>zkLogin:</b> Simplified, secure authentication for all
                      platform users
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Get answers to common questions about our platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <div className="rounded-lg border p-6">
                <h3 className="text-xl font-bold">
                  How are student documents verified?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Documents are securely stored using Walrus and accessed by
                  authorized validators through Seal's access control.
                  Validators create on-chain attestations that confirm the
                  authenticity of student claims.
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-xl font-bold">
                  What happens if a student doesn't meet scholarship conditions?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Smart contracts monitor condition fulfillment. If conditions
                  aren't met by a specified deadline, funds are automatically
                  returned to the sponsor's wallet, protecting sponsor
                  investments.
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-xl font-bold">
                  Who can become a validator?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Educational institutions, academic departments, and other
                  trusted organizations can apply to become validators. We
                  verify their credentials before granting validator status on
                  the platform.
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-xl font-bold">
                  How do I set up conditional scholarships?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Sponsors can create custom smart contracts with specific
                  requirements like GPA thresholds, course completion, or
                  advancement to the next academic year. Our platform makes this
                  process intuitive and flexible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600">
          <div className="container px-4 md:px-6 text-white">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Join the Decentralized Education Revolution
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed opacity-90">
                  Whether you're a student seeking funding, a validator ensuring
                  trust, or a sponsor looking to make an impact, ScholarChain
                  connects you with opportunities on the blockchain.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-3">
                <Button
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => handleJoinClick("student")}
                >
                  Join as Student
                </Button>
                <Button
                  className="bg-white text-green-600 hover:bg-gray-100"
                  onClick={() => handleJoinClick("validator")}
                >
                  Join as Validator
                </Button>
                <Button
                  className="bg-white text-purple-600 hover:bg-gray-100"
                  onClick={() => handleJoinClick("sponsor")}
                >
                  Join as Sponsor
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <div className="flex gap-2 items-center text-xl font-bold">
            <img
              src="/logo_nameless.png"
              alt="ScholarChain Logo Nameless"
              className="h-8 w-auto"
            />
            <span>ScholarChain</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} ScholarChain. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>

      {/* User Type Modal */}
      <UserTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedType={selectedType}
      />
    </div>
  );
}
