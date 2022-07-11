const ethers = require("ethers");
const axios = require("axios");


export const getContract = async (appProvider, address, abi) => {
	const provider = new ethers.providers.Web3Provider(appProvider);
	const signer = provider.getSigner();
	let contract = new ethers.Contract(address, abi, signer)
	return contract;
}

export const getItems = async (contract, transaction) => {
	let sumPrice = 0;
	const items = await Promise.all(transaction.map(async i => {
                const tokenURI = await contract.tokenURI(i.tokenId);
                let meta = await axios.get(tokenURI, {
                    mode: "no-cors"
                });
                meta = meta.data;
    
                let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
                let item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.image,
                    name: meta.name,
                    description: meta.description,
                }
                sumPrice += Number(price);
                return item;
            })
	    )
	return [items , sumPrice];
	}
