module scholarship::stream_manager {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::vector;
    
    // Import the funding_vault module
    use scholarship::funding_vault;
    
    const ENotAuthorized: u64 = 0;
    const EInvalidStreamConfig: u64 = 1;
    
    // Stream types
    const STREAM_TYPE_NONE: u8 = 0;
    const STREAM_TYPE_TIME: u8 = 1;
    
    public struct StreamProcessed has copy, drop {
        vault_id: address,
        student_id: address,
        donation_id: u64,
        amount: u64,
        timestamp: u64,
    }
    
    // Process streams for a student's vault
    // Modify this function to take direct parameters instead of the StudentSBT
    public fun process_streams(
        vault: &mut funding_vault::FundingVault,
        student_address: address,
        vault_id: address,
        ctx: &mut TxContext
    ): u64 {
        // Ensure the vault and student are properly linked
        assert!(
            funding_vault::student_address(vault) == student_address && 
            object::id_address(vault) == vault_id,
            ENotAuthorized
        );
        
        let current_time = tx_context::epoch(ctx);
        let mut total_released = 0u64;
        
        // Use the function to get streamable donations
        let (donation_ids, releasable_amounts) = 
            funding_vault::get_streamable_donations(vault, current_time);
        
        let donations_length = vector::length(&donation_ids);
        let mut i = 0u64;
        
        while (i < donations_length) {
            let donation_id = *vector::borrow(&donation_ids, i);
            let amount = *vector::borrow(&releasable_amounts, i);
            
            if (amount > 0) {
                // Release the funds for this donation
                let released = funding_vault::release_stream(
                    vault, 
                    donation_id, 
                    ctx
                );
                
                if (released > 0) {
                    // Emit stream processed event
                    event::emit(StreamProcessed {
                        vault_id: object::id_address(vault),
                        student_id: student_address,
                        donation_id,
                        amount: released,
                        timestamp: current_time,
                    });
                    
                    total_released = total_released + released;
                };
            };
            
            i = i + 1;
        };
        
        total_released
    }
}