/*
  This template is copied directly from the ide.bitauth.com 'Single Signature
  (P2PKH)' template.

  The default HdKey type has been changed to a Key type, so that WIF private
  keys can be used.
*/

export const p2pkhTemplate = {
  $schema: 'https://ide.bitauth.com/authentication-template-v0.schema.json',
  description: 'A standard single-factor authentication template that uses Pay-to-Public-Key-Hash (P2PKH), the most common authentication scheme in use on the network.\n\nThis P2PKH template uses BCH Schnorr signatures, reducing the size of transactions. Because the template uses a Hierarchical Deterministic (HD) key, it also supports watch-only clients.',
  name: 'Single Signature (P2PKH)',
  entities: {
    owner: {
      description: 'The individual who can spend from this wallet.',
      name: 'owner',
      scripts: [
        'lock',
        'unlock'
      ],
      variables: {
        key: {
          description: 'The private key that controls this wallet.',
          name: 'Key',
          type: 'Key'
        }
      }
    }
  },
  scripts: {
    unlock: {
      name: 'Unlock',
      script: '<key.schnorr_signature.all_outputs>\n<key.public_key>',
      unlocks: 'lock'
    },
    lock: {
      lockingType: 'standard',
      name: 'P2PKH Lock',
      script: 'OP_DUP\nOP_HASH160 <$(<key.public_key> OP_HASH160\n)> OP_EQUALVERIFY\nOP_CHECKSIG'
    }
  },
  supported: [
    'BCH_2020_05',
    'BCH_2021_05',
    'BCH_2022_05'
  ],
  version: 0
}
