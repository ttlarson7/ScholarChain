module scholarship::student_sbt {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
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

    // Changed struct to use vector<address> for document storage
    public struct StudentSBT has key {
        id: UID,
        owner: address,
        vault_id: address,
        funds_received: u64,
        milestone_status: vector<bool>,
        metadata: vector<String>,
        // Changed from Url to vector of addresses
        documents: vector<address>,
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

    // Updated mint function to accept vector<address> for documents
    public fun mint(
        recipient: address,
        vault_id: address,
        metadata: vector<String>,
        documents: vector<address>,
        initial_milestones: u64,
        ctx: &mut TxContext
    ) {
        let student_sbt = StudentSBT {
            id: object::new(ctx),
            owner: recipient,
            vault_id,
            funds_received: 0,
            milestone_status: init_milestones(initial_milestones),
            metadata,
            documents, // Now takes a vector of BLOBs
            created_at: tx_context::epoch(ctx),
            last_stream_check: tx_context::epoch(ctx),
        };

        event::emit(StudentSBTCreated {
            student_id: recipient,
            vault_id,
            timestamp: tx_context::epoch(ctx),
        });

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

    public fun update_metadata(
        sbt: &mut StudentSBT,
        metadata: vector<String>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == sbt.owner, ENotAuthorized);
        sbt.metadata = metadata;
    }

    // New function to update documents
    public fun update_documents(
        sbt: &mut StudentSBT,
        documents: vector<address>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == sbt.owner, ENotAuthorized);
        sbt.documents = documents;
    }

    // Add a new document to the vector
    public fun add_document(
        sbt: &mut StudentSBT,
        document: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == sbt.owner, ENotAuthorized);
        vector::push_back(&mut sbt.documents, document);
    }

    // Remove a document at a specific index
    public fun remove_document(
        sbt: &mut StudentSBT,
        index: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == sbt.owner, ENotAuthorized);
        assert!(index < vector::length(&sbt.documents), EInvalidMilestoneStatus);
        vector::remove(&mut sbt.documents, index);
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

    // Function to check and process streams
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

    // Function to verify ownership
    public fun is_owner(sbt: &StudentSBT, addr: address): bool {
        sbt.owner == addr
    }

    // Getters
    public fun owner(sbt: &StudentSBT): address { sbt.owner }
    public fun vault_id(sbt: &StudentSBT): address { sbt.vault_id }
    public fun funds_received(sbt: &StudentSBT): u64 { sbt.funds_received }
    public fun metadata(sbt: &StudentSBT): &vector<String> { &sbt.metadata }
    public fun documents(sbt: &StudentSBT): &vector<address> { &sbt.documents }
    public fun document_at(sbt: &StudentSBT, index: u64): address {
        assert!(index < vector::length(&sbt.documents), EInvalidMilestoneStatus);
        *vector::borrow(&sbt.documents, index)
    }
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