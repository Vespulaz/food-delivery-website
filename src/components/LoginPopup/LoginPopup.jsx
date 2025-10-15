import React from 'react';
import './LoginPopup.css';
import {assets} from "../../assets/frontend_assets/assets.js";

function LoginPopup({setShowLogin}) {

    const [currState, setCurrState] = React.useState("Login");

    return (
        <div className="login-popup">
            <form className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt=""/>
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? <></> : <input type="text" placeholder="Your name" required/>}
                    <input type="email" placeholder="Your email" required/>
                    <input type="password" placeholder="Your password" required/>
                </div>
                {currState === "Login"
                    ? <>
                        <div className="login-popup-condition">
                            <input type="checkbox" required/>
                            <p>Remember account</p>
                        </div>
                        <button>Login</button>
                        <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Sign up here</span></p>
                    </>
                    : <>
                        <div className="login-popup-condition">
                            <input type="checkbox" required/>
                            <p>By continuing, I agree to the terms of use & privacy policy.</p>
                        </div>
                        <button>Create account</button>
                        <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                    </>
                }
            </form>
        </div>
    );
}

export default LoginPopup;