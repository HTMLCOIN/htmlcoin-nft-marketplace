# NFT Marketplace on Qtum testnet

## A. About
Full stack NFT market place based on [Qtum](https://qtum.info) testnet network

Live demo: https://remix.qtum.info/nftmarketplace/

---

<img src="./home.png" height="400px">

----

### - Stack
- Web App: React.js
- Solidity development environment: [Truffle Qtum Box](https://github.com/qtumproject/react-box)
- File Storage: IPFS ([Pinata](https://www.pinata.cloud/))
- Wallet: Qtum [Qnekt wallet](https://github.com/earlgreytech/metamask-extension/releases)  

### - Project description

When a user lists an NFT for sale, the ownership of the item will be transferred from the creator to the marketplace contract.

When another user purchases an NFT, the purchase price will be transferred from the buyer to the seller and the item will be transferred from the marketplace to the buyer.

The marketplace owner will be able to set a listing fee. This fee will be taken from the seller and transferred to the contract owner upon completion of any sale, enabling the owner of the marketplace to earn recurring revenue from any sale transacted in the marketplace.

The marketplace logic consists of just one ECR721 smart contract

---

## B. Deploying the smart contract

1. Create a qtum wallet

    You can use `qnekt` wallet extension or create a [qtum web wallet](https://qtumwallet.org/) (choose option `create from mnemonic`)

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
truffle migrate --network testnet
```

6. Verify contract

    Go to qtum testnet [block explorer](https://testnet.qtum.info/) and search the address of the contract returned by `truffle migrate` from previous step 

---

## C. Bring up the NFT Market Place Web UI

Dev environment

```
npm run start
```

Production (docker based)
```
docker build -t qtum/nftstore .
docker run -d -p 3000:3000 --name qtumnft qtum/nftstore
```

---

## D. Accessing the NFT Market place

On your Chrome browser go to http://localhost:3000/nftmarketplace

Make sure you have installed the Qtum [Qnekt wallet](https://github.com/earlgreytech/metamask-extension/releases) browser extension
