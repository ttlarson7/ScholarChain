module scholarship::student_nft {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};
    use sui::transfer;
    use sui::event;
    use std::string::{Self, String};
    use std::vector;
    
    // Import the funding_vault module
    use scholarship::funding_vault;

    const ENotAuthorized: u64 = 0;
    const EInvalidMilestoneStatus: u64 = 1;

    public struct StudentNFT has key, store {
        id: UID,
        owner: address,
        vault_id: address,
        funds_received: u64,
        milestone_status: vector<bool>,
        metadata_hash: vector<u8>,
        document_uri: Url,
        created_at: u64,
    }

    public struct StudentNFTCreated has copy, drop {
        student_id: address,
        vault_id: address,
        timestamp: u64,
    }

    public struct FundsReceived has copy, drop {
        student_id: address,
        vault_id: address,
        amount: u64,
        timestamp: u64,
    }

    public struct MilestoneUpdated has copy, drop {
        student_id: address,
        milestone_index: u64,
        status: bool,
        timestamp: u64,
    }

    // Mint a new student_nft
    public fun mint(
        owner: address,
        vault_id: address,
        metadata_hash: vector<u8>,
        document_uri: String,
        initial_milestones: u64,
        ctx: &mut TxContext
    ) {
        let student_nft = StudentNFT {
            id: object::new(ctx),
            owner,
            vault_id,
            funds_received: 0,
            milestone_status: init_milestones(initial_milestones),
            metadata_hash,
            document_uri: url::new_unsafe(string::to_ascii(document_uri)),
            created_at: tx_context::epoch(ctx),
        };

        event::emit(StudentNFTCreated {
            student_id: tx_context::sender(ctx),
            vault_id,
            timestamp: tx_context::epoch(ctx),
        });

        transfer::transfer(student_nft, owner);
    }

    // Initialize milestone statuses
    fun init_milestones(count: u64): vector<bool> {
        let mut milestones = vector::empty<bool>();
        let mut i = 0u64;
        while (i < count) {
            vector::push_back(&mut milestones, false);
            i = i + 1;
        };
        milestones
    }

    // Update milestone status and automatically check for fund release
    public fun update_milestone_status(
        nft: &mut StudentNFT,
        vault: &mut funding_vault::FundingVault,
        milestone_index: u64,
        status: bool,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, ENotAuthorized);
        assert!(milestone_index < vector::length(&nft.milestone_status), EInvalidMilestoneStatus);
        
        *vector::borrow_mut(&mut nft.milestone_status, milestone_index) = status;

        event::emit(MilestoneUpdated {
            student_id: nft.owner,
            milestone_index,
            status,
            timestamp: tx_context::epoch(ctx),
        });
        
        // If the milestone is being marked as completed, automatically check and release funds
        if (status == true) {
            let released_amount = funding_vault::check_and_release_funds(
                vault, 
                nft.owner, 
                milestone_index, 
                status, 
                ctx
            );
            
            // If funds were released, update the NFT's funds received
            if (released_amount > 0) {
                update_funds_received(nft, released_amount, ctx);
            };
        }
    }

    public fun update_funds_received(nft: &mut StudentNFT, amount: u64, ctx: &mut TxContext) {
        nft.funds_received = nft.funds_received + amount;

        event::emit(FundsReceived {
            student_id: nft.owner,
            vault_id: nft.vault_id,
            amount,
            timestamp: tx_context::epoch(ctx),
        });
    }

    public fun owner(nft: &StudentNFT): address { nft.owner }
    public fun vault_id(nft: &StudentNFT): address { nft.vault_id }
    public fun funds_received(nft: &StudentNFT): u64 { nft.funds_received }
    public fun metadata_hash(nft: &StudentNFT): &vector<u8> { &nft.metadata_hash }
    public fun document_uri(nft: &StudentNFT): &Url { &nft.document_uri }
    public fun created_at(nft: &StudentNFT): u64 { nft.created_at }

    public fun milestone_status(nft: &StudentNFT, index: u64): bool {
        assert!(index < vector::length(&nft.milestone_status), EInvalidMilestoneStatus);
        *vector::borrow(&nft.milestone_status, index)
    }

    public fun all_milestone_statuses(nft: &StudentNFT): &vector<bool> {
        &nft.milestone_status
    }
}