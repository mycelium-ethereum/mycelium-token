# MYC token
This repo holds the code for the Mycelium Token (MYC).

For the token contract itself, see `contracts/MYCToken.sol`.

For the migration contract to migrate from TCR to MYC, see `contracts/TokenMigration.sol`

To learn more about the migration from Tracer to Mycelium, see [here](https://discourse.tracer.finance/)

# Addresses
## Ethereum Mainnet
| Contract      | Address |
| :-----             |    :----:   |
| MYC Token          | 0x4b13006980aCB09645131b91D259eaA111eaF5Ba  |
| Migration Contract | 0x279C803E118609591e13e780269Cd7F77DeA0A72  |
| Mycelium OGs NFT   | 0x72BAAa523a4662856f413B0fc0a9E3068f39fe76  |
## Arbitrum One
| Contract      | Address |
| :-----             |    :----:   |
| MYC Token          | 0xc74fe4c715510ec2f8c61d70d397b32043f55abe  |
| Migration Contract | 0xa18c96947c651B038bc8ef80a43E32f74838BB42  |
| Mycelium OGs NFT   | 0xcf72978cF3f17a6194A394888A1d7a4E6EfFa405  |
# Development

To setup project run:

```
yarn install
```

To compile contracts:

```
yarn compile
```

To Deploy:

- Create a .env file with
  - API_URL=""
  - PRIVATE_KEY=""

```
npx hardhat --network Network run scripts/deploy.js
```
