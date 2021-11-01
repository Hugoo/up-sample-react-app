import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Main from './pages/Main';

// import your favorite web3 convenience library here

const App: React.FC = () => {
  return (
    <>
      <Main />
      <ToastContainer pauseOnFocusLoss newestOnTop autoClose={10000} />
    </>
  );
};

export default App;
