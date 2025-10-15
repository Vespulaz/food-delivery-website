import React from 'react';
import Navbar from "./components/Navbar/Navbar.jsx";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";
import Footer from "./components/Footer/Footer.jsx";

function App() {
  return (
      <>
          <Navbar />
          <div className="app">
              {/*Navigation bar*/}
              <Routes>
                  <Route path="/" element={<Home/>} />
                  <Route path="/cart" element={<Cart/>} />
                  <Route path="/order" element={<PlaceOrder/>} />
              </Routes>
          </div>
          <div id="contact-us">
              <Footer />
          </div>
      </>
  )
}

export default App
