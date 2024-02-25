use anchor_lang::prelude::*;
use solana_program::{pubkey, pubkey::Pubkey};
mod instructions;
mod state;
// mod program;
use instructions::*;
use crate::state::ProgramConfig;


declare_id!("7cbpSuBQPe7piCq78X16wenJQb2ifTLci41RkZSj9kot");

#[cfg(feature = "local-testing")]
#[constant]
pub const USDC_MINT_PUBKEY: Pubkey = pubkey!("envbp7mfaMj42tHKBsPAVZpAsdMREF244dJz7bSHir7");

#[cfg(not(feature="local-testing"))]
#[constant]
pub const USDC_MINT_PUBKEY: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

pub const SEED_PROGRAM_CONFIG:&[u8]= b"program_config";

#[constant]
pub const ADMIN :Pubkey= pubkey!("HuhzEsyfK89hwnbtjfw5wSQ8bVJWATqyh1sLW3yoUimN");



#[program]
pub mod payment_config {
    use super::*;
    pub fn initialize_program_config(ctx:Context<InitializeProgramConfig>)->Result<()>{
        instructions::initialize_program_config_handler(ctx)
    }
    pub fn update_program_config(
        ctx: Context<UpdateProgramConfig>,
        new_fee:u64
    )->Result<()>{
        instructions::update_program_config_handler(ctx,new_fee)
    }
    pub fn payment(ctx: Context<Payment>, amount: u64) -> Result<()> {
        instructions::payment_handler(ctx, amount)
    }
}