# MYC token
This repo holds the code for the Mycelium Token (MYC).

For the token contract itself, see `contracts/MYCToken.sol`.

For the migration contract to migrate from TCR to MYC, see `contracts/TokenMigration.sol`

To learn more about the migration from Tracer to Mycelium, see [here](https://discourse.tracer.finance/)

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

## NFT
ifps commands - Only for the setup of the NFT

```
ipfs init
ipfs daemon
ipfs add art.jpeg
ipfs add tokenURI.json
```

For Testing:

- npm run build produces json outputs
- npm test

Deployed to Rinkeby:
https://testnets.opensea.io/assets/rinkeby/0x9f807047ef5cdf5381967e85de01a0d67c9967f3/1
