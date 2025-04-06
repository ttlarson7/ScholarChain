module scholarship::student_sbt {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};
    use sui::transfer;
    use sui::event;
    use std::string::{Self, String};
    use std::vector;
    
    // Import the funding_vault module
    use scholarship::funding_vault;
    use scholarship::stream_manager;

    const ENotAuthorized: u64 = 0;
    const EInvalidMilestoneStatus: u64 = 1;
    const ETransferNotAllowed: u64 = 2;

    // Changed struct name from StudentNFT to StudentSBT
    public struct StudentSBT has key {
        id: UID,
        owner: address,
        vault_id: address,
        funds_received: u64,
        milestone_status: vector<bool>,
        metadata_hash: vector<u8>,
        document_uri: Url,
        created_at: u64,
        last_stream_check: u64,
    }

    // Updated event to reflect SBT creation
    public struct StudentSBTCreated has copy, drop {
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

    public struct StreamsChecked has copy, drop {
        student_id: address,
        vault_id: address,
        amount_released: u64,
        timestamp: u64,
    }

    // Mint a new student_sbt - Note that we removed the 'store' ability from the type
    // This makes it non-transferable (soul-bound)
    public fun mint(
        recipient: address,
        vault_id: address,
        metadata_hash: vector<u8>,
        document_uri: String,
        initial_milestones: u64,
        ctx: &mut TxContext
    ) {
        let student_sbt = StudentSBT {
            id: object::new(ctx),
            owner: recipient, // Store the recipient address
            vault_id,
            funds_received: 0,
            milestone_status: init_milestones(initial_milestones),
            metadata_hash,
            document_uri: url::new_unsafe(string::to_ascii(document_uri)),
            created_at: tx_context::epoch(ctx),
            last_stream_check: tx_context::epoch(ctx),
        };

        event::emit(StudentSBTCreated {
            student_id: recipient,
            vault_id,
            timestamp: tx_context::epoch(ctx),
        });

        // Use transfer::transfer to send the SBT to the recipient
        transfer::transfer(student_sbt, recipient);
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
        sbt: &mut StudentSBT,
        vault: &mut funding_vault::FundingVault,
        milestone_index: u64,
        status: bool,
        ctx: &mut TxContext
    ) {
        // Verify that the caller is the owner of the SBT
        assert!(tx_context::sender(ctx) == sbt.owner, ENotAuthorized);
        assert!(milestone_index < vector::length(&sbt.milestone_status), EInvalidMilestoneStatus);
        
        *vector::borrow_mut(&mut sbt.milestone_status, milestone_index) = status;

        event::emit(MilestoneUpdated {
            student_id: sbt.owner,
            milestone_index,
            status,
            timestamp: tx_context::epoch(ctx),
        });
        
        // If the milestone is being marked as completed, automatically check and release funds
        if (status == true) {
            let released_amount = funding_vault::check_and_release_funds(
                vault, 
                sbt.owner, 
                milestone_index, 
                status, 
                ctx
            );
            
            // If funds were released, update the SBT's funds received
            if (released_amount > 0) {
                update_funds_received(sbt, released_amount, ctx);
            };
        }
    }

    // New function to check and process streams
    public fun check_streams(
        sbt: &mut StudentSBT,
        vault: &mut funding_vault::FundingVault,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == sbt.owner, ENotAuthorized);
        
        // Call the refactored process_streams function with explicit parameters
        let released_amount = stream_manager::process_streams(
            vault, 
            sbt.owner,
            sbt.vault_id,
            ctx
        );
        
        // Update the last check time
        sbt.last_stream_check = tx_context::epoch(ctx);
        
        // Update funds received if any were released
        if (released_amount > 0) {
            update_funds_received(sbt, released_amount, ctx);
            
            // Emit event
            event::emit(StreamsChecked {
                student_id: sbt.owner,
                vault_id: sbt.vault_id,
                amount_released: released_amount,
                timestamp: tx_context::epoch(ctx),
            });
        };
    }

    public fun update_funds_received(sbt: &mut StudentSBT, amount: u64, ctx: &mut TxContext) {
        sbt.funds_received = sbt.funds_received + amount;

        event::emit(FundsReceived {
            student_id: sbt.owner,
            vault_id: sbt.vault_id,
            amount,
            timestamp: tx_context::epoch(ctx),
        });
    }

    // Add a function to verify ownership (useful for front-end)
    public fun is_owner(sbt: &StudentSBT, addr: address): bool {
        sbt.owner == addr
    }

    public fun owner(sbt: &StudentSBT): address { sbt.owner }
    public fun vault_id(sbt: &StudentSBT): address { sbt.vault_id }
    public fun funds_received(sbt: &StudentSBT): u64 { sbt.funds_received }
    public fun metadata_hash(sbt: &StudentSBT): &vector<u8> { &sbt.metadata_hash }
    public fun document_uri(sbt: &StudentSBT): &Url { &sbt.document_uri }
    public fun created_at(sbt: &StudentSBT): u64 { sbt.created_at }
    public fun last_stream_check(sbt: &StudentSBT): u64 { sbt.last_stream_check }

    public fun milestone_status(sbt: &StudentSBT, index: u64): bool {
        assert!(index < vector::length(&sbt.milestone_status), EInvalidMilestoneStatus);
        *vector::borrow(&sbt.milestone_status, index)
    }

    public fun all_milestone_statuses(sbt: &StudentSBT): &vector<bool> {
        &sbt.milestone_status
    }
}