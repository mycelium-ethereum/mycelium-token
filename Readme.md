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
  - Added waffle to easily check revert statements
  - added mocha chai
  - npm run build produces json outputs
