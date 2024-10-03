import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import ReplyForm from './ReplyForm';
import './css/CommentItem.css';

const CommentItem = ({ comment, refreshComments }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const token = localStorage.getItem('access_token');

    const toggleReplyForm = () => {
        setShowReplyForm(!showReplyForm);
    };

    const handleDelete = async () => {
        if (window.confirm('Ви впевнені, що хочете видалити цей коментар?')) {
            try {
                await axios.delete(`/api/comments/${comment.id}/`);
                refreshComments();
            } catch (error) {
                console.error('Error deleting comment:', error);
                alert('Не вдалося видалити коментар.');
            }
        }
    };

    return (
        <li className="comment">
            {comment.parent && (
                <p><em>Відповідь на: "{comment.parent_comment_preview}"</em></p>
            )}
            <p><strong>{comment.user.username}</strong> - <span dangerouslySetInnerHTML={{ __html: comment.text }} /></p>
            <small>Дата: {new Date(comment.created_at).toLocaleString()}</small>

            {comment.image_url && (
                <p><strong>Зображення:</strong> <img src={comment.image_url} alt="Коментар" width="200" /></p>
            )}

            {comment.file_url && (
                <p><strong>Файл:</strong> <a href={comment.file_url} download>Завантажити файл</a></p>
            )}

            {token && (
                <button type="button" className="btn btn-link" onClick={toggleReplyForm}>
                    {showReplyForm ? 'Сховати форму' : 'Відповісти'}
                </button>
            )}
            {token && comment.is_owner && (
                <button type="button" className="btn btn-link text-danger" onClick={handleDelete}>Видалити</button>
            )}

            {showReplyForm && token && (
                <ReplyForm parentId={comment.id} refreshComments={refreshComments} onClose={toggleReplyForm} />
            )}

            {comment.replies && comment.replies.length > 0 && (
                <ul>
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            refreshComments={refreshComments}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default CommentItem;
