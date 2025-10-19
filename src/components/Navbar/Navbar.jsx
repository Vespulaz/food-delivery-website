import React, {useContext, useEffect} from 'react';
import './Navbar.css';
import {assets} from "../../assets/frontend_assets/assets.js";
import {Link} from "react-router-dom";
import {StoreContext} from "../../context/StoreContext.jsx";

function Navbar({setShowLogin}) {

    // menu stores the currently active menu key.
    // setMenu updates that value when a user clicks a menu item
    const [menu, setMenu] = React.useState("home");

    const [isScroll, setIsScroll] = React.useState(false);

    // Create a reference to the menu's ul tag
    const menuRef = React.useRef(null);

    // Handle scroll when user scrolls
    useEffect(() => {
        // Variable to store the timeout ID, helps detect when the scroll stops
        let scrollTimeout;

        // 1. Handle Navbar's style when scroll down
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScroll(true);
            } else {
                setIsScroll(false);
            }

            // 2. Handle active menu
            const sections = document.querySelectorAll('div[id]');
            let currentSection = "home"; // Defaults 'home' if at the top
            const activationLine = 100; // Define a virtual "trigger line" that sits just below the navbar

            // HIGHEST PRIORITY: Check if already at the bottom of the page
            // This logic ensures "contact-us" is always active when at the bottom
            const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
            if (isAtBottom) {
                setMenu('contact-us');
                return;
            }

            for (const section of sections) {
                const rect = section.getBoundingClientRect();

                // If the top of the section has crossed the activation line
                if (rect.top <= activationLine) {
                    // ...then it becomes the current active section.
                    // Since we iterate through the sections in order,
                    // the last section that satisfies this condition will be the correct section.
                    currentSection = section.id;
                }
            }

            setMenu(currentSection);

            // 3. Handle hover while scrolling
            if (menuRef.current) {
                menuRef.current.classList.add("is-scrolling"); // Add immediately when scroll starts
                clearTimeout(scrollTimeout);

                // After 150ms of no more scrolling, we consider it stopped
                scrollTimeout = setTimeout(() => {
                    menuRef.current.classList.remove("is-scrolling");
                }, 150)
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [])

    // Function to handle when clicking on menu item
    const handleMenuClick = (targetId) => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            // Add class is-scrolling immediately on click
            if (menuRef.current) {
                menuRef.current.classList.add("is-scrolling");
            }

            // Smoothly scroll to the section position
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }

    const {getTotalCartAmount} = useContext(StoreContext);

    return (
        <div className={`navbar ${isScroll ? "scrolled" : ""}`} id="home">
            <div className="navbar-container">
                {/*Logo image*/}
                <Link to="/"><img src={assets.logo} alt="Logo" className="logo"/></Link>

                {/*Menu*/}
                <ul className="navbar-menu" ref={menuRef}>
                    <li onClick={() => {
                        handleMenuClick("home");
                        window.scrollTo(0, 0);
                    }} className={menu === "home" ? "active" : ""}><Link to="/">home</Link></li>
                    <li onClick={() => handleMenuClick("explore-menu")}
                        className={menu === "explore-menu" ? "active" : ""}><a href="#explore-menu">menu</a></li>
                    <li onClick={() => handleMenuClick("contact-us")} className={menu === "contact-us" ? "active" : ""}>
                        <a href="#contact-us">contact us</a></li>
                </ul>

                {/*Search, cart, and sign in button*/}
                <div className="navbar-right">
                    <img src={assets.search_icon} alt=""/>
                    <div className="navbar-search-icon">
                        <Link to="/cart"><img src={assets.basket_icon} alt=""/></Link>
                        {/*This dot is shown if have any items in the cart*/}
                        <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                    </div>
                    <button onClick={() => setShowLogin(true)}>sign in</button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;

