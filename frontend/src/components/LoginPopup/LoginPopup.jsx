import React, {useContext, useState} from 'react';
import './LoginPopup.css';
import {assets} from "../../assets/frontend_assets/assets.js";
import axios from "axios";
import {StoreContext} from "../../context/StoreContext.jsx";
import { toast } from 'react-toastify';

function LoginPopup({setShowLogin}) {

    const API_Backend_base = import.meta.env.VITE_API_BASE_URL;
    const {setToken} = useContext(StoreContext);

    const [currState, setCurrState] = React.useState("Login");
    const [data, setData] = useState({
        name:"",
        email:"",
        password:"",
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({...data, [name]: value}));
    }

    const onLogin = async (event) => {
        event.preventDefault();

        let newUrl = API_Backend_base;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        }
        else {
            newUrl += "/api/user/register";
        }

        const response = await axios.post(newUrl, data);

        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);
        }
        else {
            toast.error(response.data.message);
        }
    }

    return (
        <div className="login-popup">
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt=""/>
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? <></> : <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Your name" required/>}
                    <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Your email" required/>
                    <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Your password" required/>
                </div>
                {currState === "Login"
                    ? <>
                        <button type="submit">Login</button>
                        <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Sign up here</span></p>
                    </>
                    : <>
                        <div className="login-popup-condition">
                            <input type="checkbox" required/>
                            <p>By continuing, I agree to the terms of use & privacy policy.</p>
                        </div>
                        <button type="submit">Create account</button>
                        <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                    </>
                }
            </form>
        </div>
    );
}

export default LoginPopup;