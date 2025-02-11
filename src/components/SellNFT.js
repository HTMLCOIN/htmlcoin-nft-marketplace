import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import MarketplaceJSON from '../Marketplace.json';
import {getContract} from "../utils/contract";

export default function SellNFT ({address, appProvider, chainId}) {
    const [formParams, updateFormParams] = useState({ name: '', description: '', price: ''});
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');

    async function OnChangeFile(e) {
        var file = e.target.files[0];
        console.log("onChangeFile: ", file);
        try {
            updateMessage("Please wait.. uploading file to IPFS")
            const response = await uploadFileToIPFS(file);
            updateMessage("")
            console.log("uploadFileToIPFS response: ", response.toString());
            if(response.success === true) {
                console.log("Uploaded image to IPFS: ", response.pinataURL)
                setFileURL(response.pinataURL);
            }
        }
        catch(e) {
            console.log("Error during file upload", e);
            updateMessage("Error uploading file to IPFS. Please try again...")
        }
    }

    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const {name, description, price} = formParams;
        console.log("name, description, price: ", name, description, price);
        if( !name || !description || !price || !fileURL)
        {   
            return;
        }

        const nftJSON = {
            name, description, price, image: fileURL
        }

        try {
            const response = await uploadJSONToIPFS(nftJSON);
            console.log("response from uploadJSONToIPFS: ", response);
            if(response.success === true){
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function listNFT(e) {
        e.preventDefault();

        try {
            const metadataURL = await uploadMetadataToIPFS();
            let contract = await getContract(appProvider, MarketplaceJSON.address, MarketplaceJSON.abi);
            updateMessage("Please wait.. minting NFT (up to 5 mins)")

            const price = ethers.utils.parseUnits(formParams.price, 'ether')
            let listingPrice = await contract.getListPrice()
            listingPrice = listingPrice.toString()

            let transaction = await contract.createToken(metadataURL, price, { value: listingPrice })
            console.log("transaction: ", transaction);
            await transaction.wait()
            updateMessage("NFT minted successfully")

            alert("Successfully listed your NFT!");
            updateMessage("");
            updateFormParams({ name: '', description: '', price: ''});
            window.location.replace("/profile")
        }
        catch(e) {
            alert( "Upload error: "+e )
            console.log("error: ", e)
        }
    }

    return (
        <div className="">
        <div className="flex flex-col place-items-center mt-10" id="nftForm">
            <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
            <h3 className="text-center font-bold text-purple-500 mb-8">Upload your NFT to the marketplace</h3>
                <div className="mb-4">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">NFT Name</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Htmlcoin#4563" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
                </div>
                <div className="mb-6">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="description">NFT Description</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" cols="40" rows="5" id="description" type="text" placeholder="Htmlcoin Collection" value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})}></textarea>
                </div>
                <div className="mb-6">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Price (in HTML)</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})}></input>
                </div>
                <div>
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="image">Upload Image</label>
                    <input type={"file"} onChange={OnChangeFile}></input>
                </div>
                <br></br>
                <div className="text-green text-center">{message}</div>
                <button onClick={listNFT} className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg">
                    List NFT
                </button>
            </form>
        </div>
        </div>
    )
}