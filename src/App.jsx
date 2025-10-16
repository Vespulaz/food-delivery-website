import React, {useEffect} from 'react';
import Navbar from "./components/Navbar/Navbar.jsx";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LoginPopup from "./components/LoginPopup/LoginPopup.jsx";

function App() {

    const [showLogin, setShowLogin] = React.useState(false);

    // Add body-no-scroll class when showLogin true
    useEffect(() => {
        if (showLogin) {
            document.body.classList.add("body-no-scroll");
        } else {
            document.body.classList.remove("body-no-scroll");
        }

        return () => {
            document.body.classList.remove("body-no-scroll");
        }
    }, [showLogin]);

  return (
      <>
          {showLogin ? <LoginPopup setShowLogin={setShowLogin}/> : <></>}
          <Navbar setShowLogin={setShowLogin}/>
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
