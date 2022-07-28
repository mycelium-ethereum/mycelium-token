To setup project run:

```
npm install
```

To compile contracts:

```
npx hardhat compile
```

To Deploy:

- Create a .env file with
  - API_URL=""
  - PRIVATE_KEY=""

```
npx hardhat --network Network run scripts/deploy.js
```

ifps commands - No need to run

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
