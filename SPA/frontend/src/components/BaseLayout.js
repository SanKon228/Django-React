import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/BaseLayout.css';

const BaseLayout = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsAuthenticated(true);
            const storedUsername = localStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
            }
        } else {
            setIsAuthenticated(false);
            setUsername('');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUsername('');
        navigate('/login');
    };

    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        {isAuthenticated ? (
                            <>
                                <li><button onClick={handleLogout} className="btn btn-link">Logout</button></li>
                                <li>Welcome, {username}</li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            <main className="content">
                {children}
            </main>

            <footer>
                <p>Footer content here</p>
            </footer>
        </div>
    );
};

export default BaseLayout;
