import { Button } from "@/components/ui/button";
import {
  Award,
  CheckCircle,
  GraduationCap,
  Link,
  LucideWallet,
  Shield,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center text-xl font-bold">
            <Shield className="h-6 w-6 text-teal-500" />
            <span>ScholarChain</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                How It Works
              </Link>
              <Link
                href="#faq"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                FAQ
              </Link>
              <Button variant="outline" size="sm" className="ml-4">
                Log In
              </Button>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                Sign Up
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-teal-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Decentralized Scholarships on the SUI Blockchain
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connect students directly with sponsors. Earn scholarships
                    by achieving academic goals and completing tasks.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Apply as Student
                  </Button>
                  <Button variant="outline">Become a Sponsor</Button>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-teal-500" />
                    <span>Transparent</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-teal-500" />
                    <span>Decentralized</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-teal-500" />
                    <span>Secure</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                {/* <Image
                  src="/placeholder.svg?height=400&width=500"
                  width={500}
                  height={400}
                  alt="Student receiving scholarship"
                  className="rounded-lg object-cover"
                /> */}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg p-4">
                <div className="text-3xl font-bold">$2.5M+</div>
                <div className="text-sm text-muted-foreground text-center">
                  Scholarships Awarded
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg p-4">
                <div className="text-3xl font-bold">1,200+</div>
                <div className="text-sm text-muted-foreground text-center">
                  Students Funded
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg p-4">
                <div className="text-3xl font-bold">350+</div>
                <div className="text-sm text-muted-foreground text-center">
                  Active Sponsors
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg p-4">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground text-center">
                  Goal Completion Rate
                </div>
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
                <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">
                  Platform Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Why Choose ScholarChain?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Our platform leverages SUI blockchain technology to create a
                  transparent, efficient, and direct connection between students
                  and sponsors.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-teal-100 p-3">
                  <LucideWallet className="h-6 w-6 text-teal-700" />
                </div>
                <h3 className="text-xl font-bold">Direct P2P Funding</h3>
                <p className="text-center text-muted-foreground">
                  Sponsors can directly fund students without intermediaries,
                  reducing fees and increasing the impact of each contribution.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-teal-100 p-3">
                  <Award className="h-6 w-6 text-teal-700" />
                </div>
                <h3 className="text-xl font-bold">Merit-Based Rewards</h3>
                <p className="text-center text-muted-foreground">
                  Students receive scholarships based on verified achievements
                  like high GPAs, course completion, or leadership positions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-teal-100 p-3">
                  <Shield className="h-6 w-6 text-teal-700" />
                </div>
                <h3 className="text-xl font-bold">Blockchain Security</h3>
                <p className="text-center text-muted-foreground">
                  All transactions and achievements are recorded on the SUI
                  blockchain, ensuring transparency and preventing fraud.
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
                  Our platform makes it easy for students to receive
                  scholarships and for sponsors to support academic excellence.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <GraduationCap className="mr-2 h-6 w-6 text-teal-600" />
                  For Students
                </h3>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-teal-100 p-1 text-teal-700">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold">Create Your Profile</h4>
                      <p className="text-muted-foreground">
                        Sign up and create a detailed profile showcasing your
                        academic goals, achievements, and aspirations.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-teal-100 p-1 text-teal-700">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold">Set Academic Goals</h4>
                      <p className="text-muted-foreground">
                        Define specific, measurable goals like "Maintain a 3.5
                        GPA" or "Become a club officer."
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-teal-100 p-1 text-teal-700">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold">Verify Achievements</h4>
                      <p className="text-muted-foreground">
                        Upload verification of completed goals through our
                        secure verification system.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-teal-100 p-1 text-teal-700">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold">Receive Scholarships</h4>
                      <p className="text-muted-foreground">
                        Get SUI tokens directly to your wallet when sponsors
                        fund your achievements.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <Users className="mr-2 h-6 w-6 text-teal-600" />
                  For Sponsors
                </h3>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-teal-100 p-1 text-teal-700">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold">Create Sponsor Account</h4>
                      <p className="text-muted-foreground">
                        Sign up as a sponsor and set up your SUI wallet for
                        contributions.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-teal-100 p-1 text-teal-700">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold">Browse Student Profiles</h4>
                      <p className="text-muted-foreground">
                        Explore student profiles and their academic goals to
                        find those you want to support.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-teal-100 p-1 text-teal-700">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold">
                        Create Scholarship Contracts
                      </h4>
                      <p className="text-muted-foreground">
                        Set up smart contracts that automatically release funds
                        when students meet specific criteria.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-teal-100 p-1 text-teal-700">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold">Track Impact</h4>
                      <p className="text-muted-foreground">
                        Monitor the progress of students you've sponsored and
                        see the real impact of your contributions.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* SUI Integration Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-teal-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex items-center justify-center">
                <img
                  src="/public/image.png"
                  alt="SUI Blockchain"
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">
                    Powered by SUI
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Why We Use SUI Blockchain
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    SUI provides the perfect foundation for our decentralized
                    scholarship platform with its:
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5" />
                    <span>Fast transaction speeds and low fees</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5" />
                    <span>
                      Smart contract functionality for automated scholarship
                      distribution
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5" />
                    <span>
                      Immutable record-keeping for verified achievements
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5" />
                    <span>
                      Decentralized governance allowing community input
                    </span>
                  </li>
                </ul>
                <div>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Learn More About SUI Integration
                  </Button>
                </div>
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
                  How are student achievements verified?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  We use a combination of official academic records, verified
                  institution emails, and blockchain attestations to ensure all
                  achievements are legitimate.
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-xl font-bold">
                  Do I need a SUI wallet to use the platform?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, both students and sponsors need a SUI wallet. We provide
                  easy setup guides and integration with popular wallet
                  providers.
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-xl font-bold">
                  Can sponsors set specific criteria for scholarships?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Sponsors can create custom smart contracts with specific
                  achievement criteria, funding amounts, and distribution
                  schedules.
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-xl font-bold">
                  How do students convert SUI tokens to fiat currency?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Students can use integrated exchanges or third-party services
                  to convert SUI tokens to their preferred currency for
                  educational expenses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-teal-600">
          <div className="container px-4 md:px-6 text-white">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Join the Decentralized Education Revolution
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed opacity-90">
                  Whether you're a student seeking funding or a sponsor looking
                  to make an impact, ScholarChain connects you directly with
                  opportunities.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-white text-teal-600 hover:bg-gray-100">
                  Apply as Student
                </Button>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-teal-700"
                >
                  Become a Sponsor
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
            <Shield className="h-6 w-6 text-teal-500" />
            <span>ScholarChain</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} ScholarChain. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
