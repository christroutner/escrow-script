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
  encodeTransaction,
  cashAddressToLockingBytecode
} from '@bitauth/libauth'
import SlpWallet from 'minimal-slp-wallet'

// Local libraries
import { p2pkhTemplate } from './templates/single_signature_p2pkh.bitauth-template.js'

// Constants
// Private key in WIF format. Address: bitcoincash:qrxlmjwfnpuk0zrf749x6y86puh6e0zlzvdmhkxy00
const OWNER_PRIVATE_KEY = 'L4j4bx9srAiUWMGQ2Vib6iMBHop1tsQqutv5erZ9vRvohMN4v6te'
// const OWNER_CASH_ADDRESS = 'bitcoincash:qrxlmjwfnpuk0zrf749x6y86puh6e0zlzvdmhkxy00'
const RECEIVER_CASH_ADDRESS = 'bitcoincash:qqlrzp23w08434twmvr4fxw672whkjy0py26r63g3d'

// Update this information with the UTXO to be spent.
const UTXO = {
  tx_hash: 'e7fa1f829f8a461d118fb7e2e6d38bebd4ec0b09ba8949869f64f782b0b87e16',
  tx_pos: 0,
  value: 10000
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

    // const someInput = {
    //   outpointIndex: 0,
    //   outpointTransactionHash: hexToBin(UTXO.tx_hash),
    //   sequenceNumber: 0xffffffff,
    //   unlockingBytecode: Uint8Array.from([])
    // }
    const satsAvailable = 10_000n

    const outputScript = cashAddressToLockingBytecode(RECEIVER_CASH_ADDRESS)
    console.log('outputScript: ', outputScript)

    const someOutput = {
      lockingBytecode: outputScript.bytecode,
      valueSatoshis: satsAvailable - 400n
    }

    // const p2pkhInput = {
    //   outpointIndex: someInput.outpointIndex,
    //   outpointTransactionHash: someInput.outpointTransactionHash,
    //   sequenceNumber: 0,
    //   unlockingBytecode: {
    //     compiler,
    //     data: {
    //       keys: { privateKeys: { key: owner.privateKey } }
    //     },
    //     valueSatoshis: BigInt(satsAvailable),
    //     script: 'unlock'
    //     // token: libAuthToken,
    //   }
    // }

    const inputWithScript = {
      outpointIndex: UTXO.tx_pos,
      outpointTransactionHash: hexToBin(UTXO.tx_hash),
      // sequenceNumber: 0xffffffff,
      sequenceNumber: 0,
      // unlockingBytecode: p2pkhInput.unlockingBytecode
      unlockingBytecode: {
        compiler,
        data: {
          keys: { privateKeys: { key: owner.privateKey } }
        },
        valueSatoshis: BigInt(satsAvailable),
        script: 'unlock'
      }
    }

    console.log('Generating transaction...')
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
