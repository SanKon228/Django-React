import React, { useState, useRef } from 'react';
import axios from '../utils/axiosConfig';
import ReCAPTCHA from 'react-google-recaptcha';
import './css/AddComment.css';

const AddComment = ({ addComment }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [captchaToken, setCaptchaToken] = useState('');
    const [captchaError, setCaptchaError] = useState(false);

    const recaptchaRef = useRef();

    const RECAPTCHA_SITE_KEY = '6LdMIlcqAAAAAHUKb9LNrUXUtxkzf1sd9h3NaTGe';

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImage(null);
            setPreviewImage(null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== 'text/plain') {
            alert('Файл повинен бути у форматі .txt.');
            e.target.value = null;
        } else {
            setFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Будь ласка, увійдіть або зареєструйтеся, щоб додати коментар.');
            return;
        }

        if (!captchaToken) {
            setCaptchaError(true);
            return;
        }

        const formData = new FormData();
        formData.append('text', text)
        if (image) formData.append('image', image);
        if (file) formData.append('file', file);
        formData.append('captcha_token', captchaToken);

        try {
            const response = await axios.post('/api/comments/', formData);
            setText('');
            setImage(null);
            setFile(null);
            setPreviewImage(null);
            setCaptchaToken('');
            setCaptchaError(false);
            addComment(response.data);
            recaptchaRef.current.reset();
        } catch (error) {
            console.error('Error submitting comment:', error);
            if (error.response && error.response.data) {
                alert('Не вдалося додати коментар: ' + JSON.stringify(error.response.data));
            } else {
                alert('Не вдалося додати коментар. Перевірте свої дані та спробуйте ще раз.');
            }
        }
    };

    const onRecaptchaChange = (token) => {
        setCaptchaToken(token);
        setCaptchaError(false);
    };

    return (
        <form onSubmit={handleSubmit} className="add-comment-form">
            <div className="form-group">
                <label htmlFor="text">Текст:</label>
                <textarea
                    id="comment-textarea"
                    name="text"
                    className="form-control"
                    rows="2"
                    placeholder="Ваш коментар"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="image">Зображення:</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="form-control-file"
                    onChange={handleImageChange}
                />
                {previewImage && (
                    <img 
                        src={previewImage} 
                        alt="Попередній перегляд" 
                        style={{ maxWidth: '300px', marginTop: '10px' }} 
                    />
                )}
            </div>

            <div className="form-group">
                <label htmlFor="file">Файл (.txt):</label>
                <input
                    type="file"
                    name="file"
                    accept=".txt"
                    className="form-control-file"
                    onChange={handleFileChange}
                />
                <small className="form-text text-muted">Файл повинен бути у форматі .txt.</small>
            </div>

            <div className="form-group">
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={onRecaptchaChange}
                />
                {captchaError && <p style={{ color: 'red' }}>Будь ласка, підтвердіть, що ви не робот.</p>}
            </div>

            <button type="submit" className="btn btn-primary">Додати коментар</button>
        </form>
    );
};

export default AddComment;
