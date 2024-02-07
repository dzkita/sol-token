use anchor_lang::prelude::*;
use instructions::deposit::*;
use instructions::withdraw::*;
use instructions::withdraw_closed_feed::*;
use state::*;

pub mod errors;
pub mod instructions;
pub mod state;

declare_id!("Cib1qo5fLDNtpSHMv3usbqN2o8SPJ2DQhHhiaDEunX2J");

#[program]
pub mod burry_escrow {
    use super::*;

    pub fn deposit(ctx: Context<Deposit>, escrow_amt: u64, unlock_price: f64) -> Result<()> {
        deposit_handler(ctx, escrow_amt, unlock_price)
    }
    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        withdraw_handler(ctx)
    }
    pub fn withdraw_closed_feed(ctx: Context<WithdrawClosedFeed>) -> Result<()> {
        withdraw_closed_feed_handler(ctx)
    }
}
