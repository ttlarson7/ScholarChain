module scholarship::funding_vault {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::event;
    use std::vector;

    const ENotAuthorized: u64 = 0;
    const EInsufficientFunds: u64 = 1;
    const EMilestoneNotCompleted: u64 = 2;
    const EInvalidMilestoneIndex: u64 = 3;
    const EInvalidDonationId: u64 = 4;
    const EStreamNotReady: u64 = 5;

    // Stream types
    const STREAM_TYPE_NONE: u8 = 0;
    const STREAM_TYPE_TIME: u8 = 1;

    // Enhanced Donation struct with stream support
    public struct Donation has store, drop {
        id: u64,
        sponsor: address,
        amount: u64,
        milestone_index: u64,
        // Stream fields
        stream_type: u8,
        stream_release_time: u64,  // Epoch time when funds can be released
        released: bool,
    }

    public struct FundingVault has key, store {
        id: UID,
        student_address: address,
        balance: Balance<SUI>,
        locked_amount: u64,
        sponsors: vector<address>,
        // Add a list of donations with their specific milestones
        donations: vector<Donation>,
        next_donation_id: u64,
        created_at: u64,
    }

    public struct VaultCreated has copy, drop {
        vault_id: address,
        student_address: address,
        timestamp: u64,
    }

    public struct FundsDeposited has copy, drop {
        vault_id: address,
        sponsor: address,
        amount: u64,
        milestone_index: u64,
        stream_type: u8,
        stream_release_time: u64,
        donation_id: u64,
        timestamp: u64,
    }

    public struct FundsWithdrawn has copy, drop {
        vault_id: address,
        student_address: address,
        amount: u64,
        milestone_index: u64,
        timestamp: u64,
    }

    public struct StreamReleased has copy, drop {
        vault_id: address,
        donation_id: u64,
        student_address: address,
        amount: u64,
        timestamp: u64,
    }

    // Create a new funding vault for a student
    public fun create_vault(
        student_address: address,
        ctx: &mut TxContext,
    ): address {
        let vault = FundingVault {
            id: object::new(ctx),
            student_address,
            balance: balance::zero<SUI>(),
            locked_amount: 0,
            sponsors: vector::empty<address>(),
            donations: vector::empty<Donation>(),
            next_donation_id: 0,
            created_at: tx_context::epoch(ctx),
        };

        let vault_id = object::id_address(&vault);

        event::emit(VaultCreated {
            vault_id,
            student_address,
            timestamp: tx_context::epoch(ctx),
        });

        transfer::share_object(vault);
        vault_id
    }

    // Modified deposit function to include stream information
    public fun deposit(
        vault: &mut FundingVault,
        payment: Coin<SUI>,
        milestone_index: u64,
        ctx: &mut TxContext
    ) {
        deposit_with_stream(vault, payment, milestone_index, STREAM_TYPE_NONE, 0, ctx)
    }

    // New deposit function with stream support
    public fun deposit_with_stream(
        vault: &mut FundingVault,
        payment: Coin<SUI>,
        milestone_index: u64,
        stream_type: u8,
        stream_release_time: u64,
        ctx: &mut TxContext
    ) {
        let sponsor = tx_context::sender(ctx);
        let amount = coin::value(&payment);

        // Add sponsor to list if not there
        if (!vector::contains(&vault.sponsors, &sponsor)) {
            vector::push_back(&mut vault.sponsors, sponsor);
        };

        // Adding funding
        let payment_balance = coin::into_balance(payment);
        balance::join(&mut vault.balance, payment_balance);
        vault.locked_amount = vault.locked_amount + amount;

        // Create donation ID
        let donation_id = vault.next_donation_id;
        vault.next_donation_id = vault.next_donation_id + 1;

        // Add donation with stream information
        let donation = Donation {
            id: donation_id,
            sponsor,
            amount,
            milestone_index,
            stream_type,
            stream_release_time,
            released: false,
        };
        vector::push_back(&mut vault.donations, donation);

        event::emit(FundsDeposited {
            vault_id: object::id_address(vault),
            sponsor,
            amount,
            milestone_index,
            stream_type,
            stream_release_time,
            donation_id,
            timestamp: tx_context::epoch(ctx)
        });
    }

    // Replace check_and_release_funds to avoid dependency cycle
    // Instead of taking a StudentNFT, take the student address and milestone status
    public fun check_and_release_funds(
        vault: &mut FundingVault,
        student_address: address,
        milestone_index: u64,
        is_milestone_completed: bool,
        ctx: &mut TxContext
    ): u64 {
        assert!(student_address == vault.student_address, ENotAuthorized);
        assert!(is_milestone_completed, EMilestoneNotCompleted);
        
        let mut total_release_amount = 0u64;
        let donations_count = vector::length(&vault.donations);
        let mut i = 0u64;
        
        // Check each donation to see if it's tied to this milestone
        while (i < donations_count) {
            let donation = vector::borrow_mut(&mut vault.donations, i);
            
            // If donation is for this milestone, not yet released, and either has no stream
            // or the stream is ready to be released
            if (donation.milestone_index == milestone_index && !donation.released && 
                (donation.stream_type == STREAM_TYPE_NONE || 
                 (donation.stream_type == STREAM_TYPE_TIME && 
                  donation.stream_release_time <= tx_context::epoch(ctx)))) {
                total_release_amount = total_release_amount + donation.amount;
                donation.released = true;
            };
            
            i = i + 1;
        };
        
        // If there are funds to release
        if (total_release_amount > 0) {
            assert!(balance::value(&vault.balance) >= total_release_amount, EInsufficientFunds);
            
            vault.locked_amount = vault.locked_amount - total_release_amount;
            let coin_to_send = coin::from_balance(balance::split(&mut vault.balance, total_release_amount), ctx);
            transfer::public_transfer(coin_to_send, vault.student_address);
            
            event::emit(FundsWithdrawn {
                vault_id: object::id_address(vault),
                student_address: vault.student_address,
                amount: total_release_amount,
                milestone_index,
                timestamp: tx_context::epoch(ctx),
            });
        };
        
        total_release_amount
    }

    // Keep the original release_funds function for manual releases if needed
    // But modify it to not depend on StudentNFT
    public fun release_funds(
        vault: &mut FundingVault,
        student_address: address,
        milestone_index: u64,
        is_milestone_completed: bool,
        amount: u64,
        ctx: &mut TxContext
    ): u64 {
        assert!(student_address == vault.student_address, ENotAuthorized);
        assert!(is_milestone_completed, EMilestoneNotCompleted);
        assert!(balance::value(&vault.balance) >= amount, EInsufficientFunds);

        vault.locked_amount = vault.locked_amount - amount;
        let coin_to_send = coin::from_balance(balance::split(&mut vault.balance, amount), ctx);
        transfer::public_transfer(coin_to_send, vault.student_address);

        event::emit(FundsWithdrawn {
            vault_id: object::id_address(vault),
            student_address: vault.student_address,
            amount,
            milestone_index,
            timestamp: tx_context::epoch(ctx),
        });
        
        amount
    }

    // New function to release a specific stream
    public fun release_stream(
        vault: &mut FundingVault, 
        donation_id: u64,
        ctx: &mut TxContext
    ): u64 {
        let current_time = tx_context::epoch(ctx);
        let donations_length = vector::length(&vault.donations);
        let mut donation_idx = donations_length; // Invalid value
        let mut i = 0u64;
        
        // Find the donation with the given ID
        while (i < donations_length) {
            let donation = vector::borrow(&vault.donations, i);
            if (donation.id == donation_id && !donation.released) {
                donation_idx = i;
                break
            };
            i = i + 1;
        };
        
        assert!(donation_idx < donations_length, EInvalidDonationId);
        
        let donation = vector::borrow_mut(&mut vault.donations, donation_idx);
        
        // For time-based streams, check if it's ready
        if (donation.stream_type == STREAM_TYPE_TIME) {
            assert!(current_time >= donation.stream_release_time, EStreamNotReady);
        };
        
        // Mark as released and calculate amount
        let amount = donation.amount;
        donation.released = true;
        
        // Process the payment
        assert!(balance::value(&vault.balance) >= amount, EInsufficientFunds);
        vault.locked_amount = vault.locked_amount - amount;
        let coin_to_send = coin::from_balance(balance::split(&mut vault.balance, amount), ctx);
        transfer::public_transfer(coin_to_send, vault.student_address);
        
        // Emit event
        event::emit(StreamReleased {
            vault_id: object::id_address(vault),
            donation_id,
            student_address: vault.student_address,
            amount,
            timestamp: current_time,
        });
        
        amount
    }

    // Function to get streamable donations (ready for release)
    public fun get_streamable_donations(
        vault: &FundingVault,
        current_time: u64
    ): (vector<u64>, vector<u64>) {
        let mut donation_ids = vector::empty<u64>();
        let mut amounts = vector::empty<u64>();
        
        let donations_length = vector::length(&vault.donations);
        let mut i = 0u64;
        
        while (i < donations_length) {
            let donation = vector::borrow(&vault.donations, i);
            
            // Check if this donation has a time-based stream and is ready
            if (!donation.released && 
                donation.stream_type == STREAM_TYPE_TIME && 
                current_time >= donation.stream_release_time) {
                
                vector::push_back(&mut donation_ids, donation.id);
                vector::push_back(&mut amounts, donation.amount);
            };
            
            i = i + 1;
        };
        
        (donation_ids, amounts)
    }

    // Helper function to get unreleased funds by milestone
    public fun get_unreleased_funds_by_milestone(vault: &FundingVault, milestone_index: u64): u64 {
        let donations_count = vector::length(&vault.donations);
        let mut unreleased_amount = 0u64;
        let mut i = 0u64;
        
        while (i < donations_count) {
            let donation = vector::borrow(&vault.donations, i);
            if (donation.milestone_index == milestone_index && !donation.released) {
                unreleased_amount = unreleased_amount + donation.amount;
            };
            i = i + 1;
        };
        
        unreleased_amount
    }

    public fun student_address(vault: &FundingVault): address { vault.student_address }
    public fun balance(vault: &FundingVault): u64 { balance::value(&vault.balance) }
    public fun locked_amount(vault: &FundingVault): u64 { vault.locked_amount }
    public fun sponsors(vault: &FundingVault): &vector<address> { &vault.sponsors }
    public fun created_at(vault: &FundingVault): u64 { vault.created_at }
}