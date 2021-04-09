import React from 'react';
import './App.css';
import { web3, signTransferPermit } from './web3';

const sign = async () => {
  const signature = await signTransferPermit()
  console.log(signature)
} 

function App() {


  return (
    <div className="App">
      <h1>Hello</h1>
      <button
        onClick={() => sign()}
      >
        Sign
      </button>
    </div>
  );
}

export default App;
