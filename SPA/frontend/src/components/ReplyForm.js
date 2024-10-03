import React, { useState, useRef } from 'react';
import axios from '../utils/axiosConfig';
import ReCAPTCHA from 'react-google-recaptcha';
import './css/ReplyForm.css';

const ReplyForm = ({ parentId, refreshComments, onClose }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [captchaToken, setCaptchaToken] = useState('');
    const [captchaError, setCaptchaError] = useState(false);

    const recaptchaRef = useRef();

    const RECAPTCHA_SITE_KEY = '6LdMIlcqAAAAAHUKb9LNrUXUtxkzf1sd9h3NaTGe';

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Будь ласка, увійдіть або зареєструйтеся для відповіді на коментар.');
            return;
        }

        if (!captchaToken) {
            setCaptchaError(true);
            return;
        }

        const formData = new FormData();
        formData.append('text', text);
        if (parentId) formData.append('parent', parentId);
        if (image) formData.append('image', image);
        if (file) formData.append('file', file);
        formData.append('captcha_token', captchaToken);

        try {
            const response = await axios.post('/api/comments/', formData);
            if (response.status === 201) {
                setText('');
                setImage(null);
                setFile(null);
                refreshComments();
                onClose();
                recaptchaRef.current.reset();
            } else {
                throw new Error('Failed to submit reply');
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    const onRecaptchaChange = (token) => {
        setCaptchaToken(token);
        setCaptchaError(false);
    };

    return (
        <form onSubmit={handleSubmit} className="reply-form">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ваша відповідь"
                required
            />
            <div className="form-group">
                <label htmlFor="image">Зображення:</label>
                <input type="file" name="image" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div className="form-group">
                <label htmlFor="file">Файл (.txt):</label>
                <input type="file" name="file" accept=".txt" onChange={(e) => setFile(e.target.files[0])} />
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

            <button type="submit">Відправити</button>
        </form>
    );
};

export default ReplyForm;
