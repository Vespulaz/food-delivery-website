import React from 'react';
import './Home.css';
import Header from "../../components/Header/Header.jsx";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu.jsx";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay.jsx";

function Home() {

    const [category, setCategory] = React.useState("All");

    return (
        <div>
            <div id="home">
                <Header />
            </div>
            <div id="explore-menu">
                <ExploreMenu category={category} setCategory={setCategory} />
                <FoodDisplay category={category} />
            </div>
        </div>
    );
}

export default Home;