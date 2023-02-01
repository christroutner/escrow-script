export const localCryptosTemplate = {
  $schema: 'https://ide.bitauth.com/authentication-template-v0.schema.json',
  description:
    'How Bitcoin Cash non-custodial escrow works\nAs with the non-custodial scripts we’ve developed for other cryptos, our non-custodial Bitcoin Cash escrow code is open source.\n\nThis Script works in a way that is similar to a multi-signature Bitcoin transaction, except that the parties involved don’t need to agree upon how and when the Bitcoin Cash outputs are spent. The oracle — which can be the seller, buyer, or arbitrator, depending on the circumstances of the trade — doesn’t have the ability to place conditions on the transaction, unlike with traditional multi-signature wallets.\n\nThis is due to the fact that with a traditional multi-signature wallet, all parties must sign a full transaction including all outputs and inputs, whereas with a non-custodial escrow transaction that uses OP_CHECKDATASIG, the oracle simply needs to give the winner a signature which they can use at any time to unlock the BCH in any way they choose.\n\nThis type of on-chain escrow mechanism gives the buyer and seller the ability to exchange without permission, and the arbitrator the ability to intervene as a non-custodial mediator in the case of a payment dispute.\n\nSeller’s deposit into escrow\nTo move Bitcoin Cash into escrow, the seller generates a transaction with two outputs. One output is the escrow to the buyer and the other is a refundable fee. If the trade is not successful, the fee can be claimed back by the seller.\n\nIn ordinary trades, the seller will allow the buyer to spend the escrow output. This doesn’t require our intervention. Similarly, if the buyer chooses to cancel the trade on their own accord, the seller can spend the output without our help. The first scenario is a “release” and the second is a “return”.\n\nIn the event of a payment dispute, an arbitrator can step in and act as a mediator. The arbitrator can only allow either the seller or the buyer to spend, by design. The fee script allows the arbitrator to collect a fee after a released escrow, or for seller to claim a refund if the trade is unsuccessful.',
  name: 'LocalCryptos non-custodial escrow',
  entities: {
    arbiter: {
      description: '',
      name: 'arbiter',
      variables: {
        arbiter_key: {
          description: 'arbiter wallet key',
          name: "Arbiter's Key",
          type: 'Key'
        }
      }
    },
    seller: {
      description: '',
      name: 'seller',
      variables: {
        seller_key: {
          description: 'Seller Wallet key',
          name: "seller's Key",
          type: 'Key'
        }
      }
    },
    buyer: {
      description: '',
      name: 'buyer',
      variables: {
        buyer_key: {
          description: 'buyer Wallet key',
          name: "buyer's Key",
          type: 'Key'
        }
      }
    }
  },
  scripts: {
    arbitrator_release: {
      name: 'arbitrator release',
      script:
        '/**\n * To spend an escrow output, the spender must provide in their \n * Bitcoin Cash transaction’s scriptSig:\n * <Sig> <SpenderPubKey> <OracleSignature> <OraclePubKey> <ActionByte>\n    Example: <Sig> <OwnPubkey> <SignatureFromSeller> <SellerPubKey> OP_1\n */\n<buyer_key.schnorr_signature.all_outputs>\n<buyer_key.public_key>\n<arbiter_key.data_signature.message_arb_to_buyer>\n<arbiter_key.public_key>\nOP_2\n\n/**\n * <ActionByte> is a byte corresponding with the situation being executed.\n1: Escrow is being released by the seller\n2: Escrow is being released by the arbitrator\n3: Escrow is being returned by the buyer\n4: Escrow is being returned by the arbitrator\n<OraclePubKey> is the public key of the person signing the release/return message.\n1: <OraclePubKey> = <SellerPubKey>\n2: <OraclePubKey> = <ArbPubKey> (controlled by LocalCryptos)\n3: <OraclePubKey> = <BuyerPubKey>\n4: <OraclePubKey> = <ArbPubKey> (controlled by LocalCryptos)\n<OracleSignature> is a signature from the oracle of ECDSA(<ActionByte> || <EscrowKey>). The <EscrowKey> is unique so that signatures cannot be re-used across escrows.\n<SpenderPubKey> is the buyer’s public key if a release, otherwise the seller’s public key.\n<Sig> is the transaction signature from the spender.\n */\n\n\n\n',
      unlocks: 'escrow_output_template'
    },
    seller_spend_cancel: {
      name: 'seller spend cancel',
      script:
        '<seller_key.schnorr_signature.all_outputs>\n<seller_key.public_key>\n<buyer_key.data_signature.message_buyer>\n<buyer_key.public_key>\nOP_3',
      unlocks: 'fee_output_template'
    },
    seller_release: {
      name: 'seller release',
      script:
        '/**\n * To spend an escrow output, the spender must provide in their \n * Bitcoin Cash transaction’s scriptSig:\n * <Sig> <SpenderPubKey> <OracleSignature> <OraclePubKey> <ActionByte>\n    Example: <Sig> <OwnPubkey> <SignatureFromSeller> <SellerPubKey> OP_1\n */\n<buyer_key.schnorr_signature.all_outputs>\n<buyer_key.public_key>\n<seller_key.data_signature.message_seller>\n<seller_key.public_key>\nOP_1\n\n/**\n * <ActionByte> is a byte corresponding with the situation being executed.\n1: Escrow is being released by the seller\n2: Escrow is being released by the arbitrator\n3: Escrow is being returned by the buyer\n4: Escrow is being returned by the arbitrator\n<OraclePubKey> is the public key of the person signing the release/return message.\n1: <OraclePubKey> = <SellerPubKey>\n2: <OraclePubKey> = <ArbPubKey> (controlled by LocalCryptos)\n3: <OraclePubKey> = <BuyerPubKey>\n4: <OraclePubKey> = <ArbPubKey> (controlled by LocalCryptos)\n<OracleSignature> is a signature from the oracle of ECDSA(<ActionByte> || <EscrowKey>). The <EscrowKey> is unique so that signatures cannot be re-used across escrows.\n<SpenderPubKey> is the buyer’s public key if a release, otherwise the seller’s public key.\n<Sig> is the transaction signature from the spender.\n */\n\n\n\n',
      unlocks: 'escrow_output_template'
    },
    buyer_return: {
      name: 'buyer return',
      script:
        '/**\n * To spend an escrow output, the spender must provide in their \n * Bitcoin Cash transaction’s scriptSig:\n * <Sig> <SpenderPubKey> <OracleSignature> <OraclePubKey> <ActionByte>\n    Example: <Sig> <OwnPubkey> <SignatureFromSeller> <SellerPubKey> OP_1\n */\n<seller_key.schnorr_signature.all_outputs>\n<seller_key.public_key>\n<buyer_key.data_signature.message_buyer>\n<buyer_key.public_key>\nOP_3\n\n/**\n * <ActionByte> is a byte corresponding with the situation being executed.\n1: Escrow is being released by the seller\n2: Escrow is being released by the arbitrator\n3: Escrow is being returned by the buyer\n4: Escrow is being returned by the arbitrator\n<OraclePubKey> is the public key of the person signing the release/return message.\n1: <OraclePubKey> = <SellerPubKey>\n2: <OraclePubKey> = <ArbPubKey> (controlled by LocalCryptos)\n3: <OraclePubKey> = <BuyerPubKey>\n4: <OraclePubKey> = <ArbPubKey> (controlled by LocalCryptos)\n<OracleSignature> is a signature from the oracle of ECDSA(<ActionByte> || <EscrowKey>). The <EscrowKey> is unique so that signatures cannot be re-used across escrows.\n<SpenderPubKey> is the buyer’s public key if a release, otherwise the seller’s public key.\n<Sig> is the transaction signature from the spender.\n */\n\n\n\n',
      unlocks: 'escrow_output_template'
    },
    arbitrator_return: {
      name: 'arbitrator return',
      script:
        '/**\n * To spend an escrow output, the spender must provide in their \n * Bitcoin Cash transaction’s scriptSig:\n * <Sig> <SpenderPubKey> <OracleSignature> <OraclePubKey> <ActionByte>\n    Example: <Sig> <OwnPubkey> <SignatureFromSeller> <SellerPubKey> OP_1\n */\n<seller_key.schnorr_signature.all_outputs>\n<seller_key.public_key>\n<arbiter_key.data_signature.message_arb_to_seller>\n<arbiter_key.public_key>\nOP_4\n\n/**\n * <ActionByte> is a byte corresponding with the situation being executed.\n1: Escrow is being released by the seller\n2: Escrow is being released by the arbitrator\n3: Escrow is being returned by the buyer\n4: Escrow is being returned by the arbitrator\n<OraclePubKey> is the public key of the person signing the release/return message.\n1: <OraclePubKey> = <SellerPubKey>\n2: <OraclePubKey> = <ArbPubKey> (controlled by LocalCryptos)\n3: <OraclePubKey> = <BuyerPubKey>\n4: <OraclePubKey> = <ArbPubKey> (controlled by LocalCryptos)\n<OracleSignature> is a signature from the oracle of ECDSA(<ActionByte> || <EscrowKey>). The <EscrowKey> is unique so that signatures cannot be re-used across escrows.\n<SpenderPubKey> is the buyer’s public key if a release, otherwise the seller’s public key.\n<Sig> is the transaction signature from the spender.\n */\n\n\n\n',
      unlocks: 'escrow_output_template'
    },
    escrow_output_template: {
      lockingType: 'p2sh20',
      name: 'Escrow output template',
      script:
        'OP_DUP // We need to use the byte again afterwards\n// Get the hashed public keys we need to compare against (ours, and the oracle)\nOP_1\nOP_EQUAL\n\nOP_IF\n  <$(<seller_key.public_key> OP_HASH160)> // Oracle pub key\n  <$(<buyer_key.public_key> OP_HASH160)> // Spender pub key\nOP_ELSE\n  OP_DUP\n  OP_2 // = release from arbitrator\n  OP_EQUAL\n  OP_IF \n    <$(<arbiter_key.public_key> OP_HASH160)>  // Oracle pub key\n    <$(<buyer_key.public_key> OP_HASH160)>  // Spender pub key\n  OP_ELSE\n    OP_DUP\n    OP_3 // = return from buyer\n    OP_EQUAL\n    OP_IF\n      <$(<buyer_key.public_key>OP_HASH160)>  // Oracle pub key\n      <$(<seller_key.public_key> OP_HASH160 )>  // Spender pub key\n    OP_ELSE\n      OP_DUP\n      OP_4 // = return from arbitrator\n      OP_EQUALVERIFY // must be true, else the message is unknown\n       <$(<arbiter_key.public_key>OP_HASH160)>// Oracle pub key\n        <$(<seller_key.public_key>OP_HASH160)>// Spender pub key\n    OP_ENDIF\n  OP_ENDIF\nOP_ENDIF\nOP_TOALTSTACK // # Put the hashed public keys on the alt stack\n\n\nOP_TOALTSTACK // Stack is effectively reset to the input\n// On the alt stack we have: [ hash160(SpenderPubKey), hash160(OraclePubKey) ]\n <OP_1>//# Append the nonce to the escrow key to make the message\n \nOP_CAT // Stack is [ ..., <OraclePubKey>, <0x01 || EscrowKey> ]\n\nOP_SWAP  //Use this later; verify the oracle public key hash first\nOP_DUP\nOP_HASH160\nOP_FROMALTSTACK // Grab hashed pub key from alt stack\n\nOP_EQUALVERIFY // Public key checks out; now verify the oracle signature\nOP_CHECKDATASIGVERIFY // Now verify the sender\n\nOP_DUP\n\nOP_HASH160\nOP_FROMALTSTACK\n\nOP_EQUALVERIFY\n\nOP_CHECKSIG'
    },
    fee_output_template: {
      lockingType: 'p2sh20',
      name: 'Fee output template',
      script:
        '\nOP_DEPTH // Count stack size\nOP_2\nOP_EQUAL // Does the input stack only have two items?\nOP_IF // If yes, this is the owner collecting fee; simple PKH\n  OP_DUP\n  OP_HASH160\n   <$(<arbiter_key.public_key> OP_HASH160)> \n  OP_EQUALVERIFY\n  OP_CHECKSIG\nOP_ELSE // Seller is spending a "returned" (i.e. canceled) escrow\n  OP_DUP\n  OP_3 // = return from buyer\n  OP_EQUAL\n  OP_IF\n    <$(<buyer_key.public_key> OP_HASH160)>// Oracle pub key\n  OP_ELSE\n    OP_DUP\n    OP_4 // = return from arbitrator\n    OP_EQUALVERIFY // must be true, else the message is unknown\n    <$(<arbiter_key.public_key> OP_HASH160)> // Oracle pub key\n  OP_ENDIF\n  <$(<seller_key.public_key>OP_HASH160)>// Spender pub key\n  // Put the hashed public keys on the alt stack\n  OP_TOALTSTACK\n  OP_TOALTSTACK // Stack is effectively reset to the input\n  // On the alt stack we have: [ hash160(SpenderPubKey), hash160(OraclePubKey) ]\n  <OP_1> // Append the nonce to the escrow key to make the message\n  OP_CAT // Stack is [ ..., <OraclePubKey>, <0x01 || EscrowKey> ]\n  OP_SWAP // Use this later; verify the oracle public key hash first\n  OP_DUP\n  OP_HASH160\n  OP_FROMALTSTACK // Grab hashed pub key from alt stack\n  OP_EQUALVERIFY // Public key checks out; now verify the oracle signature\n  OP_CHECKDATASIGVERIFY // Verify the sender\n  OP_DUP\n  OP_HASH160\n  OP_FROMALTSTACK\n  OP_EQUALVERIFY\n  OP_CHECKSIG\nOP_ENDIF\n\n'
    },
    message_seller: {
      name: 'message seller',
      script: '<OP_1>'
    },
    message_arb_to_buyer: {
      name: 'message arb to buyer',
      script: '0x0251'
    },
    message_buyer: {
      name: 'message buyer',
      script: '0x0351'
    },
    message_arb_to_seller: {
      name: 'message arb to seller',
      script: '0x0451'
    },
    arbiter_return: {
      name: 'arbiter return',
      script:
        '<seller_key.schnorr_signature.all_outputs>\n<seller_key.public_key>\n<arbiter_key.data_signature.message_arb_to_seller>\n<arbiter_key.public_key>\nOP_4',
      unlocks: 'fee_output_template'
    },
    arbiter_fee: {
      name: 'arbiter fee',
      script:
        '<arbiter_key.schnorr_signature.all_outputs>\n<arbiter_key.public_key>',
      unlocks: 'fee_output_template'
    }
  },
  supported: ['BCH_2022_05', 'BCH_SPEC'],
  version: 0
}

export const p2pkhTemplate = {
  $schema: 'https://ide.bitauth.com/authentication-template-v0.schema.json',
  description: 'A very insecure transaction.',
  name: 'No Signature (P2SH)',
  entities: {
    arbiter: {
      description: 'The individual who can spend from this wallet.',
      name: 'Owner',
      scripts: ['lock', 'unlock'],
      variables: {
        key: {
          description: 'The key that controls this wallet.',
          name: 'Key',
          type: 'Key'
        }
      }
    }
  },
  scripts: {
    unlock: {
      name: 'Unlock',
      // script: "<key.public_key> <key.public_key>  <OP_CAT OP_HASH256 <$(<key.public_key> <key.public_key> OP_CAT OP_HASH256)> OP_EQUAL>", //
      script: '<key.schnorr_signature.all_outputs> <key.public_key>', //
      unlocks: 'lock'
    },
    lock: {
      lockingType: 'standard',
      name: 'P2SH Lock',
      // script: "OP_CAT OP_HASH256 <$(<key.public_key> <key.public_key> OP_CAT OP_HASH256)> OP_EQUAL",
      script:
        'OP_DUP OP_HASH160 <$(<key.public_key> OP_HASH160 \n)>OP_EQUALVERIFY OP_CHECKSIG'
    }
  },
  supported: ['BCH_2020_05', 'BCH_2021_05', 'BCH_2022_05'],
  version: 0
}
