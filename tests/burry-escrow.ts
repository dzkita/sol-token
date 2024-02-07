import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BurryEscrow } from "../target/types/burry_escrow";
import { Big } from "@switchboard-xyz/common";

import { AggregatorAccount, AnchorWallet, SwitchboardProgram } from "@switchboard-xyz/solana.js"
import { assert } from "chai";
export const solUsedSwitchboardFeed = new anchor.web3.PublicKey("GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR")
describe("burry-escrow", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider= anchor.AnchorProvider.env();
  const program = anchor.workspace.BurryEscrow as Program<BurryEscrow>;
  const payer=(provider.wallet as AnchorWallet).payer;


  it ("Create Burry escrow bellow price",async()=>{
    //  fetch switchboard devnet program object
    const switchboardProgram = await SwitchboardProgram.load(
      new anchor.web3.Connection("https://api.devnet.solana.com"),payer)
    
    const aggregatorAccount= new AggregatorAccount(switchboardProgram,solUsedSwitchboardFeed);
    // derive escrow state account
    const [escrowSate]= await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("MICHAEL BURRY"), payer.publicKey.toBuffer()],program.programId
    )
    // fetch latest SOL price

    const solPrice:Big|null = await aggregatorAccount.fetchLatestValue()
    if (solPrice==null){
      throw new Error("Agregator holds no value")
    }
    const failUnlcokPrice= solPrice.minus(10).toNumber()
    const amountToLockUp=new anchor.BN(100)

    try {
      const tx= await program.methods.deposit(
        amountToLockUp,failUnlcokPrice
      ).accounts({
        user:payer.publicKey,
        escrowAccount:escrowSate,
        systemProgram:anchor.web3.SystemProgram.programId
      }).signers([payer]).rpc()
      await provider.connection.confirmTransaction(tx,'confirmed')
      const newAccount= await program.account.escrowState.fetch(escrowSate)

      const escrowBalance= await provider.connection.getBalance(escrowSate,'confirmed')
      console.log("On-chain unlock price:", newAccount.unlockPrice)
      console.log("Amount in escrow:", escrowBalance)
      // Check whether the data on-chain is equal to local 'data'
      assert(failUnlcokPrice == newAccount.unlockPrice)

      assert(escrowBalance > 0)

    } catch (e) {
      console.log(e)
      assert.fail(e)
    }



  })
  it ("Withdrwa from escrow",async ()=>{
    const [escrowSate]= await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("MICHAEL BURRY"), payer.publicKey.toBuffer()],program.programId
    )
    // send tx
    const tx= await program.methods.withdraw().accounts({
      user:payer.publicKey,
      escrowAccount:escrowSate,
      feedAgregator:solUsedSwitchboardFeed,
      systemProgram:anchor.web3.SystemProgram.programId
    }).signers([payer]).rpc()

    await provider.connection.confirmTransaction(tx,'confirmed')

    let accountFetchFail= false;
    try{
      await program.account.escrowState.fetch(escrowSate)
    }catch(e){
      accountFetchFail=true
    }
    assert(accountFetchFail)
  })
  it("Create Burry Escrow Above Price", async () => {

    // fetch switchboard devnet program object
    const switchboardProgram = await SwitchboardProgram.load(
      new anchor.web3.Connection("https://api.devnet.solana.com"),payer
    )
    const aggregatorAccount = new AggregatorAccount(switchboardProgram, solUsedSwitchboardFeed)

    // derive escrow state account
    const [escrowState] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("MICHAEL BURRY"), payer.publicKey.toBuffer()],program.programId
    )
    console.log("Escrow Account: ", escrowState.toBase58())
    const solPrice:Big|null = await aggregatorAccount.fetchLatestValue()
    if (solPrice===null){
      throw new Error("Agregator holds no value");
    }
    const failUnlcokPrice= solPrice.plus(10).toNumber()
    const amountToLockUp= new anchor.BN(100)

    try {
      const tx =await program.methods.deposit(amountToLockUp,failUnlcokPrice).accounts({
        user:payer.publicKey,
        escrowAccount:escrowState,
        systemProgram:anchor.web3.SystemProgram.programId
      }).signers([payer]).rpc()

      await provider.connection.confirmTransaction(tx,'confirmed')
      console.log('Your tx signature',tx)
      // Fetch the created account
      const newAccount = await program.account.escrowState.fetch(escrowState)

      const escrowBalance= await provider.connection.getBalance(escrowState,'confirmed')
      console.log("On-chain unlock price:", newAccount.unlockPrice)
      console.log("Amount in escrow:", escrowBalance)
      // Check whether the data on-chain is equal to local 'data'
      assert(failUnlcokPrice == newAccount.unlockPrice)
      assert(escrowBalance > 0)
    } catch (e) {
      console.log(e)
      assert.fail(e)
    }
  })
  it("Attempt to withdraw while price is below UnlockPrice", async () => {
    let didFail = false;
    // derive escrow address
    const [escrowState] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("MICHAEL BURRY"), payer.publicKey.toBuffer()],program.programId
    )
    // send tx
    try {
      const tx = await program.methods.withdraw()
      .accounts({
        user: payer.publicKey,
        escrowAccount: escrowState,
        feedAgregator:solUsedSwitchboardFeed,
        systemProgram: anchor.web3.SystemProgram.programId
      }).signers([payer]).rpc()

      await provider.connection.confirmTransaction(tx, "confirmed")
      console.log("Your transaction signature", tx)
    } catch (e) {
      // verify tx returns expected error
      didFail = true;
      console.log(e.error.errorMessage)
      assert(e.error.errorMessage == 'Current SOL price is not above Escrow unlock price.')
    }
    assert(didFail)
  })

});
