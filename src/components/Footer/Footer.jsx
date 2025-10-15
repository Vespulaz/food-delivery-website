import React from 'react';
import './Footer.css';
import {assets} from "../../assets/frontend_assets/assets.js";

function Footer() {
    return (
        <div className="footer">
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt=""/>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur consectetur debitis ducimus est excepturi facilis fuga harum ipsam iste iusto modi molestias nisi optio, pariatur perferendis quas quia tenetur!</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt=""/>
                        <img src={assets.twitter_icon} alt=""/>
                        <img src={assets.linkedin_icon} alt=""/>
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+84 12 345 678</li>
                        <li>contact@tomato.xyz</li>
                    </ul>
                </div>
            </div>
            <hr/>
            <p className="footer-copyright">
                Copyright 2025 © Dang and Cuong - All rights reserved.
            </p>
        </div>
    );
}

export default Footer;