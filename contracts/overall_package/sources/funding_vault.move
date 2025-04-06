module scholarship::funding_vault {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::event;
    use std::vector;

    // Remove the direct dependency on student_nft

    const ENotAuthorized: u64 = 0;
    const EInsufficientFunds: u64 = 1;
    const EMilestoneNotCompleted: u64 = 2;
    const EInvalidMilestoneIndex: u64 = 3;

    // New struct to track donations with their associated milestones
    public struct Donation has store, drop {
        sponsor: address,
        amount: u64,
        milestone_index: u64,
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
        timestamp: u64,
    }

    public struct FundsWithdrawn has copy, drop {
        vault_id: address,
        student_address: address,
        amount: u64,
        milestone_index: u64,
        timestamp: u64,
    }

    // Create a new funding vault for a student
    public fun create_vault(
        student_address: address,
        ctx: &mut TxContext,
    ): address {
        let vault = FundingVault {
            id: object::new(ctx),
            student_address: tx_context::sender(ctx),
            balance: balance::zero<SUI>(),
            locked_amount: 0,
            sponsors: vector::empty<address>(),
            donations: vector::empty<Donation>(),
            created_at: tx_context::epoch(ctx),
        };

        let vault_id = object::id_address(&vault);

        event::emit(VaultCreated {
            vault_id,
            student_address: tx_context::sender(ctx),
            timestamp: tx_context::epoch(ctx),
        });

        transfer::share_object(vault);
        vault_id
    }

    // Modified deposit function to include milestone information
    public fun deposit(
        vault: &mut FundingVault,
        payment: Coin<SUI>,
        milestone_index: u64,
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

        // Add donation with milestone information
        let donation = Donation {
            sponsor,
            amount,
            milestone_index,
            released: false,
        };
        vector::push_back(&mut vault.donations, donation);

        event::emit(FundsDeposited {
            vault_id: object::id_address(vault),
            sponsor,
            amount,
            milestone_index,
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
            
            // If donation is for this milestone and not yet released
            if (donation.milestone_index == milestone_index && !donation.released) {
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