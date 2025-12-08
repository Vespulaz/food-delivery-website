import React, {useEffect} from 'react';
import './Verify.css'
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";

function Verify() {
    const API_Backend_base = import.meta.env.VITE_API_BASE_URL;
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const navigate = useNavigate();

    const verifyPayment = async () => {
        const response = await axios.post(`${API_Backend_base}/api/order/verify`, {success, orderId});
        if (response.data.success) {
            navigate("/myorders");
        }
        else {
            navigate("/");
        }
    }

    useEffect(() => {
        verifyPayment();
    },[])

    return (
        <div className="verify">
            <div className="spinner">

            </div>
        </div>
    );
}

export default Verify;