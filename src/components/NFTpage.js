import { useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import {getContract} from "../utils/contract";

export default function NFTPage ({address, appProvider, chainId}) {

const [data, updateData] = useState({});
const [dataFetched, updateDataFetched] = useState(false);
const [message, updateMessage] = useState("");
const [currAddress, updateCurrAddress] = useState("0x");

async function getNFTData(tokenId) {
    let contract = await getContract(appProvider, MarketplaceJSON.address, MarketplaceJSON.abi);
    const tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);
    let meta = await axios.get(tokenURI,{
        mode: "no-cors"
    });
    meta = meta.data;
    console.log(listedToken);

    let item = {
        price: meta.price,
        tokenId: tokenId,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
    }
    console.log(item);
    updateData(item);
    updateDataFetched(true);
    updateCurrAddress(address);
}

async function buyNFT(tokenId) {
    try {
        const ethers = require("ethers");
        let contract = await getContract(appProvider, MarketplaceJSON.address, MarketplaceJSON.abi);
        const salePrice = ethers.utils.parseUnits(data.price, 'ether')
        updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
        let transaction = await contract.executeSale(tokenId, {value:salePrice});
        await transaction.wait();

        alert('You successfully bought the NFT!');
        updateMessage("");
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);

    return(
        <div style={{"minHeight":"100vh"}}>
            {!dataFetched ?  <div className="flex text-center flex-col mt-11 md:text-2xl text-white">Loading... </div>: 
            <div className="flex ml-20 mt-20">
                <img src={data.image} alt="" className="w-2/5" />
                <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
                    <div>
                        Name: {data.name}
                    </div>
                    <div>
                        Description: {data.description}
                    </div>
                    <div>
                        Price: <span className="">{data.price + " QTUM"}</span>
                    </div>
                    <div>
                        Owner: <span className="text-sm">{data.owner}</span>
                    </div>
                    <div>
                        Seller: <span className="text-sm">{data.seller}</span>
                    </div>
                    <div>
                    { currAddress === data.owner || currAddress === data.seller ?
                        <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
                        : <div className="text-emerald-700">You are the owner of this NFT</div>
                    }
                    
                    <div className="text-green text-center mt-3">{message}</div>
                    </div>
                </div>
            </div>
    }
        </div>
    )
}