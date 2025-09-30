import React from 'react';
import './Navbar.css';
import {assets} from "../../assets/frontend_assets/assets.js";

function Navbar() {

    // menu stores the currently active menu key.
    // setMenu updates that value when a user clicks a menu item
    const [menu, setMenu] = React.useState("home");

    return (
        <div className="navbar">
            {/*Logo image*/}
            <img src={assets.logo} alt="Logo" className="logo"/>

            {/*Menu*/}
            <ul className="navbar-menu">
                <li onClick={() => setMenu("home")} className={menu==="home"?"active":""}>home</li>
                <li onClick={() => setMenu("menu")} className={menu==="menu"?"active":""}>menu</li>
                <li onClick={() => setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>mobile-app</li>
                <li onClick={() => setMenu("contact-us")} className={menu==="contact-us"?"active":""}>contact us</li>
            </ul>

            {/*Search, cart, and sign in button*/}
            <div className="navbar-right">
                <img src={assets.search_icon} alt=""/>
                <div className="navbar-search-icon">
                    <img src={assets.basket_icon} alt=""/>
                    {/*This dot is shown if have any items in the cart*/}
                    <div className="dot"></div>
                </div>
                <button>sign in</button>
            </div>
        </div>
    );
}

export default Navbar;

