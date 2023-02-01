/*
  This simple example recreates the most common type of transaction, a
  pay-to-pubkey-hash (P2PKH) transaction. The purpose of this example script
  is to illustrate how libauth and the template files work.
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
  encodeTransaction
} from '@bitauth/libauth'
import SlpWallet from 'minimal-slp-wallet'

// Local libraries
import { p2pkhTemplate } from './templates/single_signature_p2pkh.bitauth-template.js'

// Constants
// Private key in WIF format. Address: bitcoincash:qrxlmjwfnpuk0zrf749x6y86puh6e0zlzvdmhkxy00
const OWNER_PRIVATE_KEY = 'L4j4bx9srAiUWMGQ2Vib6iMBHop1tsQqutv5erZ9vRvohMN4v6te'
const OWNER_PUBLIC_KEY = '02ef5c483cfebea014eaddb9fdf7c215db9edb0496b6c9305773aeb70902ae9321'

// Update this information with the UTXO to be spent.
const UTXO = {
  tx_hash: '0ffd2d6d8b78da844b7b10d4b4693aec7f93ed5139094611466febb6df59ea5f',
  tx_pos: 0,
  value: 1000
}

async function sendP2pkh () {
  try {
    const owner = decodePrivateKeyWif(OWNER_PRIVATE_KEY)
    // console.log('owner: ', owner)

    // Import the template
    const template = importAuthenticationTemplate(p2pkhTemplate)

    // Instantiate the BCH VM compiler.
    const compiler = authenticationTemplateToCompilerBCH(template)

    const p2pkhLockingBytecode = compiler.generateBytecode({
      scriptId: 'lock',
      data: {
        keys: {
          privateKeys: {
            key: owner.privateKey
          }
        }
      }
    })

    // Print out the BCH address if compiling the template was successful.
    if (p2pkhLockingBytecode.success) {
      const addr = lockingBytecodeToCashAddress(p2pkhLockingBytecode.bytecode)
      console.log('P2PKH TX will send to this address:')
      console.log(addr)
      console.log('')
    } else {
      throw new Error(p2pkhLockingBytecode.errors)
    }

    const someInput = {
      outpointIndex: 0,
      outpointTransactionHash: hexToBin(UTXO.tx_hash),
      sequenceNumber: 0xffffffff,
      unlockingBytecode: Uint8Array.from([])
    }
    const satsAvailable = 1_000n

    const someOutput = {
      lockingBytecode: hexToBin(OWNER_PUBLIC_KEY),
      valueSatoshis: satsAvailable - 400n
    }

    const p2pkhInput = {
      outpointIndex: someInput.outpointIndex,
      outpointTransactionHash: someInput.outpointTransactionHash,
      sequenceNumber: 0,
      unlockingBytecode: {
        compiler,
        data: {
          keys: { privateKeys: { key: owner.privateKey } }
        },
        valueSatoshis: BigInt(satsAvailable),
        script: 'unlock'
        // token: libAuthToken,
      }
    }

    const inputWithScript = {
      outpointIndex: someInput.outpointIndex,
      outpointTransactionHash: someInput.outpointTransactionHash,
      sequenceNumber: 0xffffffff,
      unlockingBytecode: p2pkhInput.unlockingBytecode
    }

    const transaction = generateTransaction({
      inputs: [inputWithScript],
      locktime: 0,
      outputs: [someOutput],
      version: 2
    })
    console.log('transaction: ', transaction)
    console.log('transaction.transaction.outputs: ', transaction.transaction.outputs)

    let hex = ''
    if (transaction.success) {
      hex = binToHex(encodeTransaction(transaction.transaction))
      console.log('Transaction hex:')
      console.log(hex)
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
    console.log('Error in sendP2pkh(): ', err)
  }
}
sendP2pkh()
