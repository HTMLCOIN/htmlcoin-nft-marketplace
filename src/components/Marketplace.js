import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import { useState } from "react";
import { useEffect } from "react";
import {getItems} from "../utils/contract";
const PRIV_KEY = process.env.REACT_APP_QTUM_PRIV_KEY;
const QTUM_NETWORK = process.env.REACT_APP_QTUM_NETWORK;

export default function Marketplace({ appProvider, chainId}) {

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

            let [items, sumPrice] = await getItems(contract, transaction);
            console.log("items: ", items);
        
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