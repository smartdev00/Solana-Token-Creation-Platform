import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  getMint,
  getMetadataPointerState,
  getTokenMetadata,
  TYPE_SIZE,
  LENGTH_SIZE,
} from '@solana/spl-token';
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  createRemoveKeyInstruction,
  pack,
  TokenMetadata,
} from '@solana/spl-token-metadata';
import { TokenMetaDataType } from './types';

export async function createTokenTransaction(publicKey: PublicKey, tokenMetadata: TokenMetaDataType) {
  try {
    // Connection to devnet cluster
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // Transaction to send
    let transaction: Transaction;
    // Transaction signature returned from sent transaction
    let transactionSignature: string;

    // Generate new keypair for Mint Account
    const mintKeypair = Keypair.generate();
    // Address for Mint Account
    const mint = mintKeypair.publicKey;
    // Decimals for Mint Account
    const decimals = 2;

    // Metadata to store in Mint Account
    const metaData: TokenMetadata = {
      updateAuthority: publicKey,
      mint: mint,
      name: tokenMetadata.name,
      symbol: tokenMetadata.symbol,
      uri: 'https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json',
      additionalMetadata: [['description', tokenMetadata.description || 'Only Possible On Solana']],
    };

    // Size of MetadataExtension 2 bytes for type, 2 bytes for length
    const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
    // Size of metadata
    const metadataLen = pack(metaData).length;

    // Size of Mint Account with extension
    const mintLen = getMintLen([ExtensionType.MetadataPointer]);

    // Minimum lamports required for Mint Account
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataExtension + metadataLen);

    // Instruction to invoke System Program to create new account
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: mintKeypair.publicKey, // Account that will transfer lamports to created account
      newAccountPubkey: mint, // Address of the account to create
      space: mintLen, // Amount of bytes to allocate to the created account
      lamports, // Amount of lamports transferred to created account
      programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
    });

    // Instruction to initialize the MetadataPointer Extension
    const initializeMetadataPointerInstruction = createInitializeMetadataPointerInstruction(
      mint, // Mint Account address
      publicKey, // Authority that can set the metadata address
      mint, // Account address that holds the metadata
      TOKEN_2022_PROGRAM_ID
    );

    // Instruction to initialize Mint Account data
    const initializeMintInstruction = createInitializeMintInstruction(
      mint, // Mint Account Address
      decimals, // Decimals of Mint
      publicKey, // Designated Mint Authority
      null, // Optional Freeze Authority
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );

    // Instruction to initialize Metadata Account data
    const initializeMetadataInstruction = createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mint, // Account address that holds the metadata
      updateAuthority: publicKey, // Authority that can update the metadata
      mint: mint, // Mint Account address
      mintAuthority: publicKey, // Designated Mint Authority
      name: metaData.name,
      symbol: metaData.symbol,
      uri: metaData.uri,
    });

    // Instruction to update metadata, adding custom field
    const updateFieldInstruction = createUpdateFieldInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mint, // Account address that holds the metadata
      updateAuthority: publicKey, // Authority that can update the metadata
      field: metaData.additionalMetadata[0][0], // key
      value: metaData.additionalMetadata[0][1], // value
    });

    // Add instructions to new transaction
    transaction = new Transaction().add(
      createAccountInstruction,
      initializeMetadataPointerInstruction,
      initializeMintInstruction,
      initializeMetadataInstruction,
      updateFieldInstruction
    );

    // Send transaction
    transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [mintKeypair] // Signers
    );

    console.log('\nCreate Mint Account:', `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);

    // Retrieve mint information
    const mintInfo = await getMint(connection, mint, 'confirmed', TOKEN_2022_PROGRAM_ID);

    // Retrieve and log the metadata pointer state
    const metadataPointer = getMetadataPointerState(mintInfo);
    console.log('\nMetadata Pointer:', JSON.stringify(metadataPointer, null, 2));

    // Retrieve and log the metadata state
    const metadata = await getTokenMetadata(
      connection,
      mint // Mint Account address
    );
    console.log('\nMetadata:', JSON.stringify(metadata, null, 2));

    // Instruction to remove a key from the metadata
    const removeKeyInstruction = createRemoveKeyInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mint, // Address of the metadata
      updateAuthority: publicKey, // Authority that can update the metadata
      key: metaData.additionalMetadata[0][0], // Key to remove from the metadata
      idempotent: true, // If the idempotent flag is set to true, then the instruction will not error if the key does not exist
    });

    // Add instruction to new transaction
    transaction = new Transaction().add(removeKeyInstruction);

    // Send transaction
    transactionSignature = await sendAndConfirmTransaction(connection, transaction, [mintKeypair]);

    console.log(
      '\nRemove Additional Metadata Field:',
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );

    // Retrieve and log the metadata state
    const updatedMetadata = await getTokenMetadata(
      connection,
      mint // Mint Account address
    );
    console.log('\nUpdated Metadata:', JSON.stringify(updatedMetadata, null, 2));

    console.log('\nMint Account:', `https://solana.fm/address/${mint}?cluster=devnet-solana`);
  } catch (error) {
    console.error(error);
  }
}

export async function getNativeBalance(connection: Connection, publicKey: PublicKey) {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance;
  } catch (error) {
    console.error(error);
  }
}

export function createTransferSolTransaction(source: PublicKey, destination: PublicKey, amount: number) {
  try {
    const transaction = new Transaction();

    const transferSolInstruction = SystemProgram.transfer({
      toPubkey: destination,
      fromPubkey: source,
      lamports: amount * LAMPORTS_PER_SOL,
    });

    transaction.add(transferSolInstruction);
    return transaction;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// const connection = new Connection(clusterApiUrl('devnet'), 'confirmed'); // Test
//       if (!(publicKey && connected && signTransaction)) {
//         console.log('Connect your wallet at first.');
//         return;
//       }

//       // Generate wallet to mint token
//       const mintingFromWallet = await Keypair.generate();
//       console.log('mintingFromWallet', mintingFromWallet.secretKey.toString(), mintingFromWallet.publicKey.toString());

//       // Airdrop 1 SOL to minting wallet on devnet
//       const fromAirdropSignature = await connection.requestAirdrop(mintingFromWallet.publicKey, 1000000000);
//       await connection.confirmTransaction(fromAirdropSignature, 'confirmed');
//       console.log('airdroped');

//       const tokenMint = await createMint(
//         connection,
//         mintingFromWallet,
//         mintingFromWallet.publicKey,
//         tokenMetaData.freezeable ? mintingFromWallet.publicKey : null,
//         tokenMetaData.decimals
//       );
//       const mint = await getMint(connection, tokenMint);
//       console.log('tokenMint', tokenMint.toString(), 'mint', mint.address.toString());

//       const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
//         connection,
//         mintingFromWallet,
//         mint.address,
//         mintingFromWallet.publicKey
//       );

//       const fromTokenAccountInfo = await getAccount(connection, fromTokenAccount.address);
//       console.log('fromTokenAccountInfo', fromTokenAccountInfo);

//       const transactionSignature = await mintTo(
//         connection,
//         mintingFromWallet,
//         mint.address,
//         fromTokenAccount.address,
//         mintingFromWallet,
//         BigInt(tokenMetaData.supply * 10 ** tokenMetaData.decimals)
//       );
//       console.log('transactionSignature', transactionSignature);
