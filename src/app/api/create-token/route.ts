import { NextResponse } from 'next/server';

import {
  Connection,
  Keypair,
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
import bs58 from 'bs58';

import { TokenMetaDataType } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    console.log('data:', data);

    const tokenMetaData: TokenMetaDataType = data.tokenMetaData;
    const publicKey = new PublicKey(data.publicKey);
    console.log('api/token-create', tokenMetaData, publicKey.toString(), process.env.RPC_URL);

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // Transaction to send
    let transaction: Transaction;
    // Transaction signature returned from sent transaction
    let transactionSignature: string;

    if (!process.env.WALLET_SECRETKEY) {
      return NextResponse.json({ message: 'error backend secretkey' }, { status: 500 });
    }
    // const backendKeypair = Keypair.fromSecretKey(bs58.decode(process.env.WALLET_SECRETKEY));
    // const backendWallet = backendKeypair.publicKey;

    // Generate new keypair for Mint Account
    const mintKeypair = Keypair.generate();
    // Address for Mint Account
    const mint = mintKeypair.publicKey;
    console.log('mint:', bs58.encode(mintKeypair.secretKey), mint.toString());

    // Metadata to store in Mint Account
    const metaData: TokenMetadata = {
      updateAuthority: tokenMetaData.updateable ? undefined : publicKey,
      mint: mint,
      name: tokenMetaData.name,
      symbol: tokenMetaData.symbol,
      uri: 'https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json',
      additionalMetadata: [['description', tokenMetaData.description || 'Only Possible On Solana']],
    };

    // Size of MetadataExtension 2 bytes for type, 2 bytes for length
    const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
    const metadataLen = pack(metaData).length; // Size of metadata
    const mintLen = getMintLen([ExtensionType.MetadataPointer]); // Size of Mint Account with extension

    // Minimum lamports required for Mint Account
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataExtension + metadataLen);
    console.log('lamports:', lamports);

    // Instruction to invoke System Program to create new account
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: mintKeypair.publicKey, // Account that will transfer lamports to created account
      newAccountPubkey: mint, // Address of the account to create
      space: mintLen, // Amount of bytes to allocate to the created account
      lamports, // Amount of lamports transferred to created account
      programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
    });
    console.log('createAccountInstruction:');

    // Instruction to initialize the MetadataPointer Extension
    const initializeMetadataPointerInstruction = createInitializeMetadataPointerInstruction(
      mint, // Mint Account address
      publicKey, // Authority that can set the metadata address
      mint, // Account address that holds the metadata
      TOKEN_2022_PROGRAM_ID
    );
    console.log('initializeMetadataPointerInstruction:');

    // Instruction to initialize Mint Account data
    const initializeMintInstruction = createInitializeMintInstruction(
      mint, // Mint Account Address
      tokenMetaData.decimals, // Decimals of Mint
      publicKey, // Designated Mint Authority
      null, // Optional Freeze Authority
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );
    console.log('initializeMintInstruction:');

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
    console.log('initializeMetadataInstruction:');

    // Instruction to update metadata, adding custom field
    const updateFieldInstruction = createUpdateFieldInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mint, // Account address that holds the metadata
      updateAuthority: publicKey, // Authority that can update the metadata
      field: metaData.additionalMetadata[0][0], // key
      value: metaData.additionalMetadata[0][1], // value
    });
    console.log('updateFieldInstruction:');

    // Add instructions to new transaction
    transaction = new Transaction().add(
      createAccountInstruction,
      initializeMetadataPointerInstruction,
      initializeMintInstruction,
      initializeMetadataInstruction,
      updateFieldInstruction
    );
    console.log('transaction.add:');

    // Send transaction
    transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [mintKeypair] // Signers
    );

    console.log('\nCreate Mint Account:', `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);

    // Retrieve mint information
    const mintInfo = await getMint(connection, mint, 'confirmed', TOKEN_2022_PROGRAM_ID);
    console.log('mintInfo:', mintInfo);

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
    console.log('removeKeyInstruction:');

    // Add instruction to new transaction
    transaction = new Transaction().add(removeKeyInstruction);
    console.log('transaction add 2:');

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

    return NextResponse.json('Success', { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json('Failed', { status: 500 });
  }
}
