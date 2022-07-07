# Qtum NFT Marketplace on testnet

<img src="./home.png" height="400px">

## Smart contract deployment

1. Create a qtum wallet

You can use `qnekt` wallet extension or create a [web](https://qtumwallet.org/) wallet (choose option `create from mnemonic`)
Save your `mnemonic` for later use.

2. Fund your account with testnet qtum coins

Go to [qtum testnet faucet](http://testnet-faucet.qtum.info/#!/) and paste the address generated in step 1, to receive some funds.

3. Clone the repo

4. Create an `.env` file with the following variables

```
REACT_APP_PINATA_KEY= < paste key from https://www.pinata.cloud/ >
REACT_APP_PINATA_SECRET= < paste secret from https://www.pinata.cloud/ >
REACT_APP_QTUM_NETWORK="https://testnet-janus.qiswap.com/api/"
REACT_APP_QTUM_PRIV_KEY= < a private key from a valid Qtum address >
MNEMONIC= < mnemonic seed phrase >
```
Note: The `NMENOMIC` seed phrase from step 1.

5. Deploy smart contract to qtum testnet

Run the following:

```
truffle migrate testnet
```

## Bring up the NFT Market Place

Dev environment

```
npm run start
```

Docker (production)
```
docker build -t qtum/nftstore .
docker run --rm -p 3000:3000 -v $(pwd):/app --name qtumnft qtum/nftstore
```

## Accessing the NFT Market place

Open your chrome browser and go to (http://localhost:3000)

Make sure you have installed the Qtum [Qnekt wallet](https://github.com/earlgreytech/metamask-extension/releases) browser extension
