import React from 'react';
import './Header.css';

function Header() {
    return (
        <div className="header">
            <div className="header-contents">
                <h2>Food is your best friend!</h2>
                <p>Choose your best friend below!</p>
                <button>View Menu</button>
            </div>
        </div>
    );
}

export default Header;