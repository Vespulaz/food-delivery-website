import React, {useEffect, useRef, useState} from 'react';
import './ExploreMenu.css';
import {menu_list} from "../../assets/frontend_assets/assets.js";

function ExploreMenu({category, setCategory}) {

    const menuListRef = useRef(null);
    // Add state to track whether the list is scrollable
    const [isScrollable, setIsScrollable] = useState(false);

    // useEffect is just to check if scrolling is needed or not
    useEffect(() => {
        const element = menuListRef.current;
        if (!element) return;

        const checkIfScrollable = () => {
            // Compare the total content width to the visible width of the container
            if (element.scrollWidth > element.clientWidth) {
                setIsScrollable(true);
            } else {
                setIsScrollable(false);
            }
        };

        checkIfScrollable(); // First check when component mount

        // Add listener to check again every time the window size changes
        window.addEventListener('resize', checkIfScrollable);

        return () => {
            window.removeEventListener('resize', checkIfScrollable);
        };
    }, []);

    // This useEffect only runs when isScrollable is true to attach drag-drop events
    useEffect(() => {
        // If no scrolling is needed, do nothing
        if (!isScrollable) return;

        const element = menuListRef.current;
        let isDown = false;
        let startX;
        let scrollLeft;

        const handleMouseDown = (e) => {
            isDown = true;
            element.classList.add('active');
            startX = e.pageX - element.offsetLeft;
            scrollLeft = element.scrollLeft;
        };
        const handleMouseLeave = () => {
            isDown = false;
            element.classList.remove('active');
        };
        const handleMouseUp = () => {
            isDown = false;
            element.classList.remove('active');
        };
        const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - element.offsetLeft;
            const walk = (x - startX);
            element.scrollLeft = scrollLeft - walk;
        };

        element.addEventListener('mousedown', handleMouseDown);
        element.addEventListener('mouseleave', handleMouseLeave);
        element.addEventListener('mouseup', handleMouseUp);
        element.addEventListener('mousemove', handleMouseMove);

        return () => {
            element.removeEventListener('mousedown', handleMouseDown);
            element.removeEventListener('mouseleave', handleMouseLeave);
            element.removeEventListener('mouseup', handleMouseUp);
            element.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isScrollable]); // Only rerun when isScrollable changes

    return (
        <div className="explore-menu">
            <h1>Explore our menu</h1>
            <p className="explore-menu-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquid blanditiis distinctio dolore excepturi, harum libero porro provident repellendus reprehenderit sed tempore vero? Ab aliquam necessitatibus qui ratione sit, voluptate.</p>
            <div className={`explore-menu-list ${isScrollable ? 'is-scrollable' : ''}`}
                 ref={menuListRef}>
                {menu_list.map((item, index) => {
                    return (
                        <div onClick={() => setCategory(prev => prev === item.menu_name?"All":item.menu_name)} key={index} className="explore-menu-list-item">
                            <img className={category === item.menu_name ? "active" : ""}
                                 src={item.menu_image} alt="" draggable="false"/>
                            <p>{item.menu_name}</p>
                        </div>
                    )
                })}
            </div>
            <hr/>
        </div>
    );
}

export default ExploreMenu;