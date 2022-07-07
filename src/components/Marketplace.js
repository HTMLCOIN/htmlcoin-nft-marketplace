import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
const PRIV_KEY = process.env.REACT_APP_QTUM_PRIV_KEY;
const QTUM_NETWORK = process.env.REACT_APP_QTUM_NETWORK;

export default function Marketplace() {

    const [data, updateData] = useState(null);
    const [dataFetched, updateFetched] = useState(false);


    useEffect(() => { 
        async function getAllNFTs() {
            const {QtumProvider, QtumWallet} = require("qtum-ethers-wrapper");
            const testnetProvider = new QtumProvider(QTUM_NETWORK);
            const signer = new QtumWallet(
                PRIV_KEY,
                testnetProvider,
            )
            const ethers = require("ethers");
            let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
            let transaction = await contract.getAllNFTs()

            //Fetch all the details of every NFT from the contract and display
            const items = await Promise.all(transaction.map(async (i, j) => {
                const tokenURI = await contract.tokenURI(i.tokenId);
                let meta = await axios.get(tokenURI, {
                    mode: 'no-cors'
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
                return item;
            }))
        
            updateFetched(true);
            updateData(items);
        }
        getAllNFTs();
    }, []);

    return (
        <div>
            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold text-white">
                    Top NFTs
                </div>
                <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                    {!dataFetched ?   <div className="md:text-xl text-white">Loading... </div> : ((data !== null)  ? data.map((value, index) => {
                        return <NFTTile data={value} key={index}></NFTTile>;
                    }) : "No NFTs found")}
                </div>
            </div>            
        </div>
    );

}