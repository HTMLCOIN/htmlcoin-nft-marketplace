const MarketPlace = artifacts.require("NFTMarketplace");
const fs = require("fs");

module.exports = async function (deployer) {
    await deployer.deploy(MarketPlace);
    let marketplace = await MarketPlace.deployed();

    let src = "./build/contracts/NFTMarketplace.json";
    let dest = "./src/Marketplace.json";

  try {
    // const jsonstring = fs.readFileSync(src);
    const data = {
      address: marketplace.address,
      abi: marketplace.abi,
      // abi: JSON.parse(jsonstring).abi 
    }
    console.log("...writing address & abi to " + dest);
        
    fs.writeFileSync(dest, JSON.stringify(data))

  } catch (err) {
      console.log(err);
      return;
  }
};
