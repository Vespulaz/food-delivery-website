import React, {createContext, useEffect} from "react";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const API_Backend_base = import.meta.env.VITE_API_BASE_URL;

    const [cartItems, setCartItems] = React.useState({});
    const [token, setToken] = React.useState("");
    const [food_list, setFoodlist] = React.useState([]);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems(prev => ({...prev, [itemId]: 1 }));
        }
        else {
            setCartItems(prev => ({...prev, [itemId]: prev[itemId] + 1}));
        }

        if (token) {
            await axios.post(`${API_Backend_base}/api/cart/add`, {foodId: itemId},{headers: {Authorization: `Bearer ${token}`}})
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems(prev => ({...prev, [itemId]: prev[itemId] - 1}));

        if (token) {
            await axios.post(`${API_Backend_base}/api/cart/remove`, {foodId: itemId},{headers: {Authorization: `Bearer ${token}`}})
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(API_Backend_base+"/api/food/list");
        setFoodlist(response.data.data);
    }

    const loadCartData = async (token) => {
        const response = await axios.get(`${API_Backend_base}/api/cart`,{headers: {Authorization: `Bearer ${token}`}});
        setCartItems(response.data.cart);
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[]);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;