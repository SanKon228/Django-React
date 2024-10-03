import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import CommentItem from './CommentItem';
import './css/Comments.css';

function Comments() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const token = localStorage.getItem('access_token');

    const fetchComments = async () => {
        try {
            const response = await axios.get('/api/comments/');
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/comments/');

        socket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            console.log('New comment:', data.comment);
            setComments(prevComments => [...prevComments, data.comment]);
        };

        return () => {
            socket.close();
        };
    }, []);

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('text', newComment);

            await axios.post('/api/comments/', formData);
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="comments-container">
            <h2>Коментарі</h2>
            {token ? (
                <form onSubmit={handleAddComment} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Ваш коментар"
                        required
                    />
                    <div className="button-container">
                        <button type="submit" className="submit-button">Додати коментар</button>
                    </div>
                </form>
            ) : (
                <p>Щоб залишити коментар, будь ласка, <a href="/login">увійдіть</a>.</p>
            )}
            <ul className="comment-list">
                {comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        refreshComments={fetchComments}
                    />
                ))}
            </ul>
        </div>
    );
}

export default Comments;
