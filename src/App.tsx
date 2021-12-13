import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Main from './pages/Main';
import Transaction from './pages/Main/Transactions';

// import your favorite web3 convenience library here

const App: React.FC = () => {
  return (
    <BrowserRouter basename="up-sample-react-app">
      <Routes>
        <Route path="/tx" element={<Transaction />} />
        <Route
          path="/"
          element={
            <>
              <Main />
              <ToastContainer pauseOnFocusLoss newestOnTop autoClose={10000} />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
