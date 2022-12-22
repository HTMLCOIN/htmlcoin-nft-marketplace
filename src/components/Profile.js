import MarketplaceJSON from "../Marketplace.json";
import { useState } from "react";
import NFTTile from "./NFTTile";
import { useEffect } from "react";
import {getContract, getItems} from "../utils/contract";

export default function Profile ({address, appProvider, chainId}) {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [totalPrice, updateTotalPrice] = useState("0");

    useEffect(() => {
        async function getNFTData() {
            if (!appProvider || address === "0x") {
                return
            }
            let contract = await getContract(appProvider, MarketplaceJSON.address, MarketplaceJSON.abi);
            let transaction = await contract.getMyNFTs()
            let [items, sumPrice] = await getItems(contract, transaction);

            updateData(items);
            updateFetched(true);
            updateTotalPrice(sumPrice.toPrecision(3));
        }
        getNFTData();
    }, [address, chainId, appProvider]);

    return (
        <div className="profileClass" style={{"minHeight":"100vh"}}>
            <div className="profileClass">
                <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
                    <div className="mb-5">
                        <h2 className="font-bold">Wallet Address</h2>
                        {address === "0x" ? <h3>Please connect your wallet</h3> : <h3>{address}</h3>}
                    </div>
                </div>
                {!dataFetched ?  <div className="flex text-center flex-col mt-11 md:text-2xl text-white">Loading... </div>:
                    <div>
                        <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
                            <div>
                                <h2 className="font-bold">No. of NFTs</h2>
                                {data.length}
                            </div>
                            <div className="ml-20">
                                <h2 className="font-bold">Total Value</h2>
                                {totalPrice} HTMLCOIN
                            </div>
                        </div>
                        <div className="flex flex-col text-center items-center mt-11 text-white">
                            <h2 className="font-bold">Your NFTs</h2>
                        <div className="flex justify-center flex-wrap max-w-screen-xl">
                            {data.map((value, index) => {
                            return <NFTTile data={value} key={index}></NFTTile>;
                            })}
                        </div>
                        <div className="mt-10 text-xl">
                            {data.length === 0 ? "Oops, No NFT data to display (Are you logged in?)":""}
                        </div>
                    </div>
                 </div>
                }

            </div>
        </div>
    )
};
