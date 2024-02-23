use anchor_lang::prelude::*;

declare_id!("AdpBoJus2fSWSCt5Jm3PgKR9nqmn4Qf63aUZdoHjxGy7");

#[program]
pub mod hyper_token {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
