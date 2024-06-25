use {
    borsh::{BorshDeserialize, BorshSerialize},
    mpl_token_metadata::instruction as mpl_instruction,
    solana_program::{
        account_info::{next_account_info, AccountInfo},
        entrypoint,
        entrypoint::ProgramResult,
        msg,
        program::invoke,
        program_pack::Pack,
        pubkey::Pubkey,
        rent::Rent,
        system_instruction,
        sysvar::Sysvar,
    },
    spl_token_2022::{instruction as token_instruction, state::Mint},
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CreateTokenArgs {
    pub token_title: String,
    pub token_symbol: String,
    pub token_uri: String,
    pub token_decimals: u8,
}

impl CreateTokenArgs {
    pub fn create_token_mint(&self, accounts: &[AccountInfo]) {}
}
