// src/components/Layout.js
import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </ul>
                </nav>
            </header>
            <main>{children}</main>
            <footer>
                <p>© 2024 My Website</p>
            </footer>
        </div>
    );
};

export default Layout;
