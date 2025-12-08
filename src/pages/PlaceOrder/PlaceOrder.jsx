import React, {useContext, useEffect} from 'react';
import './PlaceOrder.css';
import {StoreContext} from "../../context/StoreContext.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function PlaceOrder() {

    const API_Backend_base = import.meta.env.VITE_API_BASE_URL;
    const {getTotalCartAmount, token, food_list, cartItems} = useContext(StoreContext);

    const [data, setData] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        ward: "",
        phone: ""
    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data => ({...data, [name]: value}));
    }

    const placeOrder = async (e) => {
        e.preventDefault();

        let orderItems = [];
        food_list.map((item) => {
             if (cartItems[item._id] > 0) {
                 let itemInfo = item;
                 itemInfo["quantity"] = cartItems[item._id];
                 orderItems.push(itemInfo);
             }
        })

        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 2,
        }

        let response = await axios.post(`${API_Backend_base}/api/order/place`, orderData, {headers: {Authorization: `Bearer ${token}`}});
        if (response.data.success) {
            const {session_url} = response.data;
            window.location.replace(session_url);
        }
        else {
            alert("Error occurred while proceeding your order");
        }
    }

    const navigate = useNavigate();

    useEffect(() => {
       if (!token) {
           alert("You must log in first!")
           navigate("/")
       }
       else if (getTotalCartAmount() === 0) {
           alert("You must choose an item first!")
           navigate("/")
       }
    },[token])

    return (
        <form onSubmit={placeOrder} className="place-order">
            <div className="place-order-left">
                <p className="title">Delivery information</p>
                <div className="multi-fields">
                    <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First name"/>
                    <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last name"/>
                </div>
                <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address"/>
                <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street"/>
                <div className="multi-fields">
                    <input required name="ward" onChange={onChangeHandler} value={data.ward} type="text" placeholder="Ward"/>
                    <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City/Province"/>
                </div>
                <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone"/>
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart total</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <div className="cart-total-details">
                            <p>Delivery fee</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                        </div>
                        <hr/>
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                        </div>
                    </div>
                    <button type='submit'>Payment</button>
                </div>
            </div>
        </form>
    );
}

export default PlaceOrder;