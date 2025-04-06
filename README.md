# ScholarChain

## Overview

ScholarChain is a blockchain-based platform that revolutionizes educational funding through the use of Soul Bound Tokens (SBTs). By leveraging blockchain technology, ScholarChain creates a transparent, efficient, and secure system for disbursing educational funds based on student achievement milestones.

## Core Features

- **Soul Bound Tokens (SBTs)**: Non-transferable tokens representing a student's educational journey and achievements
- **Milestone-Based Funding**: Automated release of funds when students achieve predefined academic milestones
- **Transparent Fund Management**: Clear tracking of disbursements and milestone completion
- **Secure Document Verification**: Tamper-proof storage of academic credentials and achievements
- **Direct Fund Streaming**: Continuous fund distribution to students as milestones are completed

## Technical Architecture

ScholarChain is built on Sui blockchain technology and includes:

1. **StudentSBT**: Soul Bound Token representing a student's identity and progress
2. **Funding Vaults**: Smart contracts that hold and disburse funds according to milestone completion
3. **Milestone Verification System**: On-chain verification of academic achievements
4. **Document Management**: IPFS-backed storage of academic credentials with cryptographic verification

## Getting Started

### Prerequisites

- Sui CLI
- Node.js (v16+)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/scholarchain.git
cd scholarchain

# Install dependencies
npm install

# Build the project
npm run build
```

### Deploying Contracts

```bash
sui client publish --gas-budget 10000000
```

## Usage

### Creating a Student SBT

```move
public fun mint(
    recipient: address,
    vault_id: address,
    metadata_hash: vector<u8>,
    document_uri: String,
    initial_milestones: u64,
    ctx: &mut TxContext
)
```

### Verifying Milestones

```move
public fun verify_milestone(
    student_sbt: &mut StudentSBT,
    milestone_id: u64,
    verification_proof: vector<u8>,
    ctx: &TxContext
)
```

### Checking Fund Distribution

```move
public fun check_funding_status(
    student_sbt: &StudentSBT
): (u64, vector<bool>)
```

## Use Cases

- **Universities**: Streamline scholarship distribution based on academic performance
- **Educational Foundations**: Ensure transparent allocation of funds to recipients
- **Government Grants**: Track usage of educational funding with verified milestone completion
- **Corporate Sponsorships**: Monitor sponsored students' progress through academic programs

## Contributing

We welcome contributions to ScholarChain! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to participate.

## License

ScholarChain is licensed under the [MIT License](LICENSE).
