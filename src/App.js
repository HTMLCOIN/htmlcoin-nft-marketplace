import './App.css';
import Navbar from './components/Navbar.js';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import SellNFT from './components/SellNFT';
import NFTPage from './components/NFTpage';
import {useState } from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";

function App() {

  const [currAddress, updateAddress] = useState('0x');
  const [provider, setProvider] = useState(null);
  const [chainId, updateChainId] = useState(null);
  return (
    <div className="container">
      <Navbar setAppAddress={updateAddress} setAppProvider={setProvider} setAppChainId={updateChainId}/>
        <Routes>
          <Route path="/" element={<Marketplace address={currAddress} appProvider={provider} chainId={chainId} />}/>
          <Route path="/nftPage/:tokenId" element={<NFTPage />}/>        
          <Route path="/profile" element={<Profile address={currAddress} appProvider={provider} chainId={chainId} />}/>
          <Route path="/sellNFT" element={<SellNFT />}/>             
        </Routes>
    </div>
  );
}

export default App;
