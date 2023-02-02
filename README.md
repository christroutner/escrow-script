# Escrow Script

This is a sandbox repository of JavaScript code. I'm using it to explore the implementation of a Bitcoin Script in Bitcoin Cash (BCH).
I'm trying to implement the double-blind escrow Script that was used by local.bitcoin.com.

## P2PKH
A P2PKH is the simplest, most common type of transaction. I decided to start with this transaction first, as a way to learn the tooling and functions needed to build a transaction with libauth.

- [p2pkh-spend.js](./p2pkh-spend.js)

## Escrow
The escrow Script address can be generated with [this app](./1-escrow-get-address.js), and in the [LocalCrypt blog](https://blog.localcryptos.com/bitcoin-cash-trading-begins/) is funded by the Seller. It has four possible outcomes:

- [Buyer returns the funds to the Seller](./2-escrow-buyer-return.js)
- [Seller releases funds to the Buyer](./3-escrow-released-by-seller.js)
- [Arbiter releases funds to the Buyer](./4-escrow-release-to-buyer-by-arbiter.js)
- [Arbiter returns funds to the Seller](./5-escrow-returned-to-seller-by-arbiter.js)

## Fee

When the Seller funds the escrow Script, they are expected to also [fund a second address](./6-fee-seller-fund.js) which represents a service fee. There are three possible outcomes of this Script:

- [Seller cancels trade and gets the fee back](./7-fee-seller-cancel.js)
- [Arbiter receives the fee](./8-fee-to-arbiter.js) (not working)
- [Arbiter returns fee to Seller](./9-fee-returned-to-seller-by-arbiter.js) (not working)

## Reference Data
Original data from Sam:
- [Sam's video walkthrough](https://rumble.com/v27r0cq-localcryptosscript.html)
- [Sam's source code](https://pastebin.mozilla.org/k03WgtEQ)
- [Local Cryptos Escrow Script](https://blog.localcryptos.com/bitcoin-cash-trading-begins/)
- [BitAuth IDE template for Local Crypto Escrow](https://ide.bitauth.com/import-template/eJztWutu20YWfpWBWmDtQJEdJ90fjpuF4ktsJK3dymmwiANhRI6sWVMzKoeUom0D5CH6Z4Hty-VJ9lyG5JC6REm2QH6oKRJyeM6Zc_nmO0Nxfmt966KRGsvWYWuUZRN3uLenY9UZ6Ezm2agT2fEeXiiT6Uhm2pr7mRpPEpmp-9P9Dut2_uWsabVbsXJRqicoBebO7Uw81VlktRHH0o2EAeUod5mNtUwEyoLEzKZ37sZ0nZjpbCRgpoYcm4TH6sP7_0yViNVUJXaiYjG0qbCgkIoonU8y69rC5mlDveaBnzOysRLaCbBihAOdSHVuzI25HsFgj-ZjvwQoSjGTc_BLZqji9FgnMhWZhQfjPMn0fadvjczyVJVzZak0TkaYh7ZQbyMF9sgARjeRaaYVmp7aZAphxNZAZJkwCm7Q7m2qlMgn1ogROCtNLGaQf1KuRWPzbJJDZiRM7SCUrCOuQcamMkqU-PD-D9DT0UhE0oiBIn2nkkSlbTHI5_gPJFCmUOpUZhZuYwVWYm1uheXpIp1G-dhl0kTgsR3SIEjHbD62yrHvIznlCeRAJzqbYxwAkghMWLCImXCF0Vp2cpPoO-VrD4ZJFMrWTO1MguOZq8oE_8e5wnnQ5hDscYrJktzAVlvAP2U1xgAYgSKgO8zhQeAllCpKcsoLqpRph8Jog5dtLFCqpCtmX4r00CK5mjuY-PKqf3x-evz8pHvd7V08a1M4voQAtkkyJ2A4jPRW-yzPtDEAeymCoKjU8HBO9QbbAqaQBkqhx5QnSLWN7hhGx-cEbXjK4EatkbUuWAfZfKKw5BjKSIK0D2Os4NZoNyZ3HNkjOFFCGGBNKMAaAJ1brjPkT0xUOtbOEQRQjeRLJDbVtclUOlUGBt1CdscK_kEl7TErHfktobbzMawKEWsHVeLQeuQfYNYh2q3TGVq3PjgI3YqxnTYWWiDRDpaRuAWXwGHlGHBldRnNM1tApSMuwXe-QeCiiQIUtpFAKj-RmkazqRrmJpYDQMNQqY64CNcgSBgLsM0jWJ4OYMvegWCx5qNEQvVjMZBQ-cE8cJ6ycWEAagBsmc7ZpKvFN9MAd4A8-lk6CR4j2cRhFBwa0g8uy5IVUvVrrlNFrFzUEBPUET2m0WTeFnoYGGcQEtgjJJ0kiJbpQwPnzwC6UQSe17zFkCvPfLYLwKELI5VMmCKHOsXlHimIXFvO9If3_01VAosY-syfZSmcQgILJGCxQXB_FumjJGBYSyGH4A5xTS5masKLLxbIWgTpAsTsXkPDGiABLoPSBI0gar9a6rVpY62hmsAOPmCABDdSNuQWVhwk3IJBdIik5TAjhvE5iUv8gzA23mKhW8ZYCdWiniVCc1PhswObBCPHCnYHL2wkk2Pu20v5EkQRLcjOrcPfWuSrSvGyvs2oTHa9SLs1hbLimgk1-3dqvqjtH_qeIFCmae9vTjynYWREGMabd-_etVucgnUeeYmGQzy63B_mJ_GK3TmRmWxaW-kOQWCdNyzQcIYGl_vS0FwxMSaCt2hlsglSfY8cHPVmArwVDwtleLp3796NEffEdUEw0tT5xa92fAYpoo49Se1UI84KbiALNfIOiJlon-fr6dtDkj2CqyfwN1u9ygcQFtxfUgfuFe21HCkFumTx6TxTT8AO_Hf6VkK3VoeFxcuZAeE7Ei7tnKV2zCXGUbooLMJG4AF6tHdjjsqi4Abb2DTtl42-A8jo-77ypCY6yQeJjvASxwPUd2KAUWBhDItR3qo-iPQz2ycLTZWaMXDtAPmuqFAYPFPjAC6BQNJUuYnlLWS5nYcem9ObAzQkfKDeqgi4MQYKfXAoTrnCYIWflnxT61Y35uDjohW8bszDZeLI3ZU4xX1jHn1cMjTcwIHv5pwupI9ilww7HHgpog0amsQh7-8emxe-DJyGhtnvG-ig-BdlgKGKux3oU1mKFE5uh_S6S-lY1H6KCSgnePRFEywuGMJFtT8dAvLDvS2k6fT4pNfdqYHp99_FEVcD59zl5hWMcEPRv8LO31neRZdTOGyWuB8aYKrv54gMCYrOeRrBt4fmQtfBBpboIaikHlb9r82bspl24YtUQ4Ps4-L3VsM94ZJMeCbr-FXPf4AReaMOdNpiv_1y7xcv3q2y9_TJRJ-3SgHR-ubMNOqfBkx7VHWgjxNMIFtnmIp5VvBLSSwrOApo5WEtXNh3rIl1sZ_4MLe95C_uJQEEVpSaJdbBhV3a9pBtD9n2kK-kh_ByZyQFrMqvkn54y6nLOPXr6Z9bSt1S6pZSvxpKrf380eDV2q8fW3L9a8l1858_qq3rut8_Hm2Jdku0W6L9uoh22e61-EF_kWK_UmLZ5BeQwgA8XhIqjoZxhtN9NNAVvm3i1YrqgIOoCKv-mj8UTA7c6GC_-ppwGvY1UeoFIUBeTl5eib098UqV5yJyDz3iWnmLn6TpI9VMprEDct4TzxQfsRhB6wOdCph4eqS0E9nxBI9MkAloozs2T131GZrX527xiwX8ffrTy-4LxCZcX5xhwzv6dmcFQrCTnXd75w_-vr_7BANgXkBf0JFCeemOfkHXr9VKGZ150TtFK5wif3WA0t8Xa5VXWEjaJOTDoOuLM8GNG51ZAYG6O8tj2TiapeGwWz6gMCS6flgERd2CYvItywuUAfmQ-HKNSxsFtGF1xeqgGmHVA6O7R4uh1csVRvjL6c8XZ_9EDdr14UmeNAdCVolfEJ53uDfcGTszhYl15Q2TsTIV65LRMLAyET-ecGmq69rV9WX3xXXvunv8HEP8RlzlKxexP0AkE-h6mYzuuGMs2OjhM8yGGg4VdJ-pSuaQa4fswMct6NgOUcZlwyQSBR5mOhSvyQOIbqfWMnfb5Xi4W9gVbyDGI-QMSMY3ojspTyIYa6LyoJLf02N7hZGxvKuVEExQPMfd61ogr0Wn02k39idwv_92_wHuGYINwhufkt6r7hUC9CWBBGwgx6aPxVSlejgPdyJBx8fI-HAE2SDQVmWm67OfL38Ik_0slYOgVmSGAR1WaRHLV9Ws0UhBn8F-8BiSNVviYtm9ODvBeanK4I91TUc183NTIGtDWXTSj9BkMBE2vGV98KPd7kypda2O_Tu9uj7HII5tbgokOv1vVXx7LVxDmRPrT10Rir0wnRHhU3gzK2C9j90_fMNCnYuhmPPhHj46R7md4Rkyf-oD9-gQ3mM-c6bE1fPzhS5T5u5T-kbYfIrEChEktuxqhHj-ooMHLYujiFLctIoXkpuW2NEd1fHftFS8Wx7cavi6rnks9MJP6WRLqXJdG9uA67-Y6TeuxkrvC5L-ErqnVf0J5E0zV9S9MPBJXM79_P_K5p7O0fBn07n4YjYnE8TmYOOz2Xz1Uv5MTl-G2s_l9IoPFlj9l0VG3ziUDamHoQ9vnsDw9e-ZwbtWsfLKE13V6xaBJFQOz9UsMQGPESzFaazSEJT_4LsHoaFVFpapPqyr1t5BVzuxGA6YeoSm8Lt7PpnYNFNx6_B16-nxef9g_-Cgv_8diONd7-r0uPWm3YLSOjowtv_uf046_Gs=)
- [template.js used by Sam's script](https://pastebin.mozilla.org/twJPgG3b)
