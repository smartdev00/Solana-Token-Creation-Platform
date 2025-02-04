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
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createSetAuthorityInstruction,
  createUpdateAuthorityInstruction,
  AuthorityType,
} from '@solana/spl-token';
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  createRemoveKeyInstruction,
  pack,
  TokenMetadata,
} from '@solana/spl-token-metadata';
import { TokenMetaDataType } from './types';

export async function createTokenCreationTransaction(
  connection: Connection,
  tokenMetaData: TokenMetaDataType,
  publicKey: PublicKey,
  uri: string
) {
  try {
    // Generate new keypair for Mint Account
    const mintKeypair = Keypair.generate();
    const tokenMint = mintKeypair.publicKey;

    const transaction: Transaction = new Transaction();
    const metaData: TokenMetadata = {
      updateAuthority: tokenMetaData.updateable ? undefined : publicKey,
      mint: tokenMint,
      name: tokenMetaData.name,
      symbol: tokenMetaData.symbol,
      uri: uri,
      additionalMetadata: [['description', tokenMetaData.description || '']],
    };

    // Size of MetadataExtension 2 bytes for type, 2 bytes for length
    const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
    const metadataLen = pack(metaData).length; // Size of metadata
    const mintLen = getMintLen([ExtensionType.MetadataPointer]); // Size of Mint Account with extension

    // Minimum lamports required for Mint Account
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataExtension + metadataLen);

    // Instruction to invoke System Program to create new account
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: publicKey, // Account that will transfer lamports to created account
      newAccountPubkey: tokenMint, // Address of the account to create
      space: mintLen, // Amount of bytes to allocate to the created account
      lamports, // Amount of lamports transferred to created account
      programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
    });

    // Instruction to initialize the MetadataPointer Extension
    const initializeMetadataPointerInstruction = createInitializeMetadataPointerInstruction(
      tokenMint, // Mint Account address
      tokenMetaData.updateable ? publicKey : null, // Authority that can set the metadata address
      tokenMint, // Account address that holds the metadata
      TOKEN_2022_PROGRAM_ID
    );

    // Instruction to initialize Mint Account data
    const initializeMintInstruction = createInitializeMintInstruction(
      tokenMint, // Mint Account Address
      tokenMetaData.decimals, // Decimals of Mint
      publicKey, // Designated Mint Authority
      tokenMetaData.freezeable ? publicKey : null, // Optional Freeze Authority
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );

    // Instruction to initialize Metadata Account data
    const initializeMetadataInstruction = createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      mint: tokenMint, // Mint Account address
      metadata: tokenMint, // Account address that holds the metadata
      mintAuthority: publicKey, // Designated Mint Authority
      updateAuthority: publicKey, // Authority that can update the metadata
      name: metaData.name,
      symbol: metaData.symbol,
      uri: metaData.uri,
    });

    // Instruction to update metadata, adding custom field
    const updateFieldInstruction = createUpdateFieldInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: tokenMint, // Account address that holds the metadata
      updateAuthority: publicKey, // Authority that can update the metadata
      field: metaData.additionalMetadata[0][0], // key
      value: metaData.additionalMetadata[0][1], // value
    });

    const newATA = await getAssociatedTokenAddress(tokenMint, publicKey, undefined, TOKEN_2022_PROGRAM_ID);
    const createATAInstruction = createAssociatedTokenAccountInstruction(
      publicKey,
      newATA,
      publicKey,
      tokenMint,
      TOKEN_2022_PROGRAM_ID
    );
    console.log('ATA', newATA.toString());

    // Create the mint to instruction
    const mintToInstruction = createMintToInstruction(
      tokenMint,
      newATA,
      publicKey,
      Math.floor(tokenMetaData.supply * 10 ** tokenMetaData.decimals),
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    // Add instructions to new transaction
    transaction.add(
      createAccountInstruction,
      initializeMetadataPointerInstruction,
      initializeMintInstruction,
      initializeMetadataInstruction,
      updateFieldInstruction,
      createATAInstruction,
      mintToInstruction
    );

    // Set update authority as null if the mintable is false
    if (!tokenMetaData.updateable) {
      transaction.add(
        createUpdateAuthorityInstruction({
          metadata: tokenMint,
          newAuthority: null,
          oldAuthority: publicKey,
          programId: TOKEN_2022_PROGRAM_ID,
        })
      );
    }

    // Set mint authority as null if the mintable is false
    if (!tokenMetaData.mintable) {
      transaction.add(
        createSetAuthorityInstruction(
          tokenMint,
          publicKey,
          AuthorityType.MintTokens,
          null,
          undefined,
          TOKEN_2022_PROGRAM_ID
        )
      );
    }

    return { transaction, signers: [mintKeypair], mint: tokenMint };
  } catch (error) {
    console.error(error);
    return { transaction: null, signers: [], mint: null };
  }
}

export async function getTokenInfo(mint: PublicKey) {
  try {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const info = await getMint(connection, mint);
    console.log(info);
  } catch (error) {
    console.error(error);
  }
}
// getTokenInfo(new PublicKey('62Xt9ETKxYFxU8ifdvkZSZLqwULi7DXHv2DZhPzRwD1z'));

export async function updateMetadata(
  connection: Connection,
  mintKeypair: Keypair,
  publicKey: PublicKey,
  metaData: TokenMetadata
) {
  try {
    const transaction = new Transaction();
    // Retrieve mint information
    const mintInfo = await getMint(connection, mintKeypair.publicKey, 'confirmed', TOKEN_2022_PROGRAM_ID);
    console.log('mintInfo:', mintInfo);

    // Retrieve and log the metadata pointer state
    const metadataPointer = getMetadataPointerState(mintInfo);
    console.log('\nMetadata Pointer:', JSON.stringify(metadataPointer, null, 2));

    // Retrieve and log the metadata state
    const metadata = await getTokenMetadata(
      connection,
      mintKeypair.publicKey // Mint Account address
    );
    console.log('\nMetadata:', JSON.stringify(metadata, null, 2));

    // Instruction to remove a key from the metadata
    const removeKeyInstruction = createRemoveKeyInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mintKeypair.publicKey, // Address of the metadata
      updateAuthority: publicKey, // Authority that can update the metadata
      key: metaData.additionalMetadata[0][0], // Key to remove from the metadata
      idempotent: true, // If the idempotent flag is set to true, then the instruction will not error if the key does not exist
    });
    console.log('removeKeyInstruction:');

    // Add instruction to new transaction
    transaction.add(removeKeyInstruction);
    console.log('transaction add 2:');

    // Send transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [mintKeypair]);

    console.log('\nRemove Additional Metadata Field:', `https://solana.fm/tx/${signature}?cluster=devnet-solana`);

    // Retrieve and log the metadata state
    const updatedMetadata = await getTokenMetadata(
      connection,
      mintKeypair.publicKey // Mint Account address
    );
    console.log('\nUpdated Metadata:', JSON.stringify(updatedMetadata, null, 2));

    console.log('\nMint Account:', `https://solana.fm/address/${mintKeypair.publicKey}?cluster=devnet-solana`);
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

// const transactionSignature = await mintTo(
//   connection,
//   mintingFromWallet,
//   mint.address,
//   fromTokenAccount.address,
//   mintingFromWallet,
//   BigInt(tokenMetaData.supply * 10 ** tokenMetaData.decimals)
// );
//       console.log('transactionSignature', transactionSignature);
