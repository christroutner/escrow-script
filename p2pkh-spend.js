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
  lockingBytecodeToCashAddress
} from '@bitauth/libauth'

// Local libraries
import { p2pkhTemplate } from './templates.js'

// Constants
// Private key in WIF format. Address: bitcoincash:qrxlmjwfnpuk0zrf749x6y86puh6e0zlzvdmhkxy00
const ARBITER_PRIVATE_KEY = 'L4j4bx9srAiUWMGQ2Vib6iMBHop1tsQqutv5erZ9vRvohMN4v6te'

// Update this information with the UTXO to be spent.
// const UTXO = {
//   tx_hash: '0ffd2d6d8b78da844b7b10d4b4693aec7f93ed5139094611466febb6df59ea5f',
//   tx_pos: 0,
//   value: 1000
// }

async function sendP2pkh () {
  try {
    const arbiter = decodePrivateKeyWif(ARBITER_PRIVATE_KEY)
    console.log('arbiter: ', arbiter)

    // Import the template
    const template = importAuthenticationTemplate(p2pkhTemplate)

    // Instantiate the BCH VM compiler.
    const compiler = authenticationTemplateToCompilerBCH(template)

    const p2pkhLockingBytecode = compiler.generateBytecode({
      scriptId: 'lock',
      data: {
        keys: {
          privateKeys: {
            arbiter_key: arbiter.privateKey
          }
        }
      }
    })
    console.log('p2pkhLockingBytecode: ', p2pkhLockingBytecode)
    console.log(
      p2pkhLockingBytecode.success
        ? lockingBytecodeToCashAddress(p2pkhLockingBytecode.bytecode)
        // ? binToHex(p2pkhLockingBytecode.bytecode)
        : p2pkhLockingBytecode.errors
    )
  } catch (err) {
    console.log('Error in sendP2pkh(): ', err)
  }
}
sendP2pkh()
