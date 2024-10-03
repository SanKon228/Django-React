import React, { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axiosConfig';
import AddComment from './AddComment';
import CommentList from './CommentList';
import BaseLayout from './BaseLayout';
import Toolbar from './Toolbar';
import './css/Home.css';

const Home = () => {
    const [comments, setComments] = useState([]);
    const [filters, setFilters] = useState({
        username: '',
        email: '',
        date: ''
    });

    const token = localStorage.getItem('access_token');

    const fetchComments = useCallback(async () => {
        try {
            const response = await axios.get('/api/comments/', {
                params: { ...filters }
            });
            console.log(response.data);
            setComments(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }, [filters]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const addComment = (newComment) => {
        setComments(prevComments => [newComment, ...prevComments]);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    return (
        <BaseLayout>
            <div className="container">
                <h1>Коментарі</h1>
                <Toolbar />

                {token ? (
                    <div className="add-comment-container">
                        <AddComment addComment={addComment} />
                    </div>
                ) : (
                    <p>Щоб додати коментар, будь ласка, <a href="/login">увійдіть у систему</a> або <a href="/register">зареєструйтеся</a>.</p>
                )}

                <h2>Фільтрувати коментарі:</h2>
                <div className="form-group">
                    <label htmlFor="username">Ім'я користувача:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={filters.username}
                        onChange={handleFilterChange}
                        className="form-control"
                        placeholder="Введіть ім'я користувача"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={filters.email}
                        onChange={handleFilterChange}
                        className="form-control"
                        placeholder="Введіть E-mail"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Дата додавання:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={filters.date}
                        onChange={handleFilterChange}
                        className="form-control"
                    />
                </div>

                <hr />

                <h3>Список коментарів:</h3>
                <CommentList comments={comments} refreshComments={fetchComments} />
            </div>
        </BaseLayout>
    );

};

export default Home;
