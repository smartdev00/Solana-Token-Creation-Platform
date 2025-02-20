import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
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
      updateAuthority: !tokenMetaData.updateable ? undefined : publicKey,
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

    // const setComputeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
    //   microLamports: 1000000,
    // });

    // const setComputeUnitLimitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
    //   units: 500000
    // })
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
      !tokenMetaData.updateable ? publicKey : null, // Authority that can set the metadata address
      tokenMint, // Account address that holds the metadata
      TOKEN_2022_PROGRAM_ID
    );

    // Instruction to initialize Mint Account data
    const initializeMintInstruction = createInitializeMintInstruction(
      tokenMint, // Mint Account Address
      tokenMetaData.decimals, // Decimals of Mint
      publicKey, // Designated Mint Authority
      !tokenMetaData.freezeable ? publicKey : null, // Optional Freeze Authority
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
    console.log(
      'ATA',
      newATA.toString(),
      'total supply',
      BigInt(tokenMetaData.supply) * BigInt(10 ** tokenMetaData.decimals)
    );

    // Create the mint to instruction
    const mintToInstruction = createMintToInstruction(
      tokenMint,
      newATA,
      publicKey,
      BigInt(tokenMetaData.supply) * BigInt(10 ** tokenMetaData.decimals),
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
    if (tokenMetaData.updateable) {
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
    if (tokenMetaData.mintable) {
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
