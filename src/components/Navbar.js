import fullLogo from '../full_logo.png';
import {
  Link,
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

function Navbar({setAppAddress, setAppProvider, setAppChainId}) {

  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState('0x');
  const [provider, setProvider] = useState(null);
  const [chainId, updateChainId] = useState(null);


  function updateButton() {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  // Connect to the blockchain
  async function connectWebsite() {
      if (!provider) {
        console.log("!provider was false");
        return
      }
      try {
        const chainId = await provider.request({ method: 'eth_chainId' });
        if(chainId !== '0x115C')
        {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x115C' }],
          });
        }
        await provider.request({ method: 'eth_requestAccounts' });
        const accounts = await provider.request({ method: 'eth_accounts' });
        updateButton();
        window.location.replace(location.pathname);
        updateAddress(accounts[0]);
        setAppAddress(accounts[0]);
      } catch (error) {
        // Handle the error here
        console.log('There was an error with connectWebsite');

      }
  }

  // handle event when chainId is changed
  function handleChainChanged(_chainId) {
    window.location.reload();
  }

  // handle event when wallet is disconnected
  function handleDisconnect() {
    updateAddress('0x');
    setAppAddress('0x');
    setAppProvider(null);
    setProvider(null);
    setAppChainId(null);
    updateChainId(null);
    toggleConnect(false);
    window.location.reload();
  }


  // handle event when user changes account
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      console.log('Please connect to Altmasq.');
      updateAddress('0x');
      setAppAddress('0x');
      toggleConnect(false);
      window.location.reload();
    } else if (accounts[0] !== currAddress) {
      updateAddress(accounts[0]);
      setAppAddress(accounts[0]);
    }
  }

  useEffect(() => {
    const init = async () => {

      const provider = window.altmasq;
      if (!provider) {
        alert('Altmasq wallet not found');
        return;
      } else {
          setProvider(provider);
          setAppProvider(provider);
      }
      // Check if chain id is correct
      const chainId = await provider.request({ method: 'eth_chainId' });
      updateChainId(chainId);
      if (chainId !== '0x115C') {
        alert('Incorrect network! Switch your Altmasq network to Htmlcoin testnet');
        return;
      }
      setAppChainId(chainId);
      provider.on('chainChanged', handleChainChanged);

      // Check if account is connected
      const accounts = await provider.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        console.log("no account connected");
        return;
      } else {
        updateAddress(accounts[0]);
        setAppAddress(accounts[0]);
        toggleConnect(true)
        updateButton();
      }
        // subscribe Qtum Wallet event regarding to chain changes
      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('disconnect', handleDisconnect)

    }
    init();


  });

  return (
    <div className="">
      <nav className="w-screen">
        <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
        <li className='flex items-end ml-5 pb-2'>
          <Link to="/">
          <img src={fullLogo} alt="" width={120} height={120} className="inline-block -mt-2"/>
          <div className='inline-block font-bold text-xl ml-2'>
            NFT Marketplace
          </div>
          </Link>
        </li>
        <li className='w-2/6'>
          <ul className='lg:flex justify-between font-bold mr-10 text-lg'>
            {location.pathname === "/" ?
            <li className='border-b-2 hover:pb-0 p-2'>
              <Link to="/">Marketplace</Link>
            </li>
            :
            <li className='hover:border-b-2 hover:pb-0 p-2'>
              <Link to="/">Marketplace</Link>
            </li>
            }
            {location.pathname === "/sellNFT" ?
            <li className='border-b-2 hover:pb-0 p-2'>
              <Link to="/sellNFT">List My NFT</Link>
            </li>
            :
            <li className='hover:border-b-2 hover:pb-0 p-2'>
              <Link to="/sellNFT">List My NFT</Link>
            </li>
            }
            {location.pathname === "/profile" ?
            <li className='border-b-2 hover:pb-0 p-2'>
              <Link to="/profile">Profile</Link>
            </li>
            :
            <li className='hover:border-b-2 hover:pb-0 p-2'>
              <Link to="/profile">Profile</Link>
            </li>
            }
            <li>
              <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={connectWebsite}>{connected? "Connected":"Connect Wallet"}</button>
            </li>
          </ul>
        </li>
        </ul>
      </nav>
      <div className='text-white text-bold text-right mr-1 text-sm'>
        {currAddress !== "0x" ? "Connected with account ":"Not Connected. Please login to interact with your NFTs"} {currAddress !== "0x" ? (currAddress.substring(0,15)+'...'):""}
      </div>
      <div className='text-white text-bold text-right mr-1 text-sm'>
        {chainId !== null ? "(chain id: ":"Not chain detected"} {chainId !== null ? chainId+")":""}
      </div>
    </div>
  );
}

  export default Navbar;
