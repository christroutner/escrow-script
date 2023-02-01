/*
  This JS app generates spends from the escrow script funded with the
  1-escrow-get-address.js app. This app simulates the scenario where the
  Buyer returns the funds to the Seller. This corresponds to ActionByte 3.
  https://blog.localcryptos.com/bitcoin-cash-trading-begins/
*/

// Global npm libraries
import {
  decodePrivateKeyWif,
  importAuthenticationTemplate,
  authenticationTemplateToCompilerBCH,
  lockingBytecodeToCashAddress,
  hexToBin,
  generateTransaction,
  binToHex,
  encodeTransaction,
  cashAddressToLockingBytecode
} from '@bitauth/libauth'
import SlpWallet from 'minimal-slp-wallet'

// Local libraries
import { localCryptosTemplate } from './templates/templates.js'

// Constants
// Private keys in WIF format.
// Arbiter Address: bitcoincash:qrwe6kxhvu47ve6jvgrf2d93w0q38av7s5xm9xfehr
const ARBITER_PRIVATE_KEY = 'KyBwDMQwESjk5jvuNzrDjZesuMtHkPn4rUewJp6dwutqKL315fai'
// Seller Address: bitcoincash:qqwvnnjv6rz382c3sp37qynlcrr76zzhwqkdcqrzev
const SELLER_PRIVATE_KEY = 'L2DA2N9tJyKtPBT4YWqVZs3G4jpGKRpKnG7XAhLotFU7jWpGmCsZ'
// Buyer Address: bitcoincash:qpwq6sjmzmp8tdhsk28sf6pz0kg7vr4elc834gk3k6
const BUYER_PRIVATE_KEY = 'Ky5Y2MUVn7kTakELCVG4TfsT3s2zBhF5a2LmpTKsCmwgH5MGrkCE'

const SELLER_CASH_ADDRESS = 'bitcoincash:qqwvnnjv6rz382c3sp37qynlcrr76zzhwqkdcqrzev'

// Update this information with the UTXO to be spent.
const UTXO = {
  tx_hash: 'cf544fae0f386b5cada41fa0c796093c77972170dff9edbbe2aefdd58b5c4a47',
  tx_pos: 0,
  value: 10000
}

async function getEscrowAddr () {
  try {
    // Import the private key for the 'owner' of the BCH.
    const arbiter = decodePrivateKeyWif(ARBITER_PRIVATE_KEY)
    const seller = decodePrivateKeyWif(SELLER_PRIVATE_KEY)
    const buyer = decodePrivateKeyWif(BUYER_PRIVATE_KEY)

    // Import the P2PKH template
    const template = importAuthenticationTemplate(localCryptosTemplate)

    // Instantiate the BCH VM compiler.
    const compiler = authenticationTemplateToCompilerBCH(template)

    // Compile the template into bytecode.
    const escrowLockingBytecode = compiler.generateBytecode({
      scriptId: "escrow_output_template",
      data: {
        keys: {
          privateKeys: {
            arbiter_key: arbiter.privateKey,
            seller_key: seller.privateKey,
            buyer_key: buyer.privateKey,
          },
        },
      },
    });

    // Print out the BCH address if compiling the template was successful.
    if (escrowLockingBytecode.success) {
      const addr = lockingBytecodeToCashAddress(escrowLockingBytecode.bytecode)
      console.log('Escrow P2SH address:')
      console.log(addr)
      console.log('')
    } else {
      throw new Error(escrowLockingBytecode.errors)
    }

    const satsAvailable = BigInt(UTXO.value)

    // Generate the output script from the cash address of the receiver.
    const outputScript = cashAddressToLockingBytecode(SELLER_CASH_ADDRESS)
    // console.log('outputScript: ', outputScript)

    // Generate the output of the transaction.
    const txOutput = {
      lockingBytecode: outputScript.bytecode,
      valueSatoshis: satsAvailable - 600n // 400 sats for tx fee
    }

    // Generate the input of the transaction.
    const inputWithScript = {
      outpointIndex: UTXO.tx_pos,
      outpointTransactionHash: hexToBin(UTXO.tx_hash),
      sequenceNumber: 0,
      unlockingBytecode: {
        compiler,
        data: {
          keys: {
            privateKeys: {
              arbiter_key: arbiter.privateKey,
              seller_key: seller.privateKey,
              buyer_key: buyer.privateKey,
            },
          },
        },
        valueSatoshis: BigInt(satsAvailable),
        script: "buyer_return"
      },
    }


    // Generate the transaction.
    const transaction = generateTransaction({
      inputs: [inputWithScript],
      locktime: 0,
      outputs: [txOutput],
      version: 2
    })
    // console.log('transaction: ', transaction)
    // console.log('transaction.transaction.outputs: ', transaction.transaction.outputs)

    // Convert the transaction to a hex representation.
    let hex = ''
    if (transaction.success) {
      hex = binToHex(encodeTransaction(transaction.transaction))
      console.log('Transaction hex:')
      console.log(hex)
      console.log('')
    } else {
      throw new Error(transaction.errors[0])
    }
    // console.log(transaction)

    // Instantiate minimal-slp-wallet
    const slpWallet = new SlpWallet(undefined, { interface: 'consumer-api' })
    await slpWallet.walletInfoPromise

    // Broadcast the transaction
    const txid = await slpWallet.broadcast(hex)
    console.log('TX Broadcast successful! TXID:')
    console.log(txid)
  } catch (err) {
    console.log('Error in getEscrowAddr(): ', err)
  }
}
getEscrowAddr()
