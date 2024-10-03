import React from 'react';
import './css/Toolbar.css';

const Toolbar = () => {
    const addTag = (startTag, endTag) => {
        const textArea = document.getElementById('comment-textarea');
        if (!textArea) return;
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const selectedText = textArea.value.substring(start, end);
        const newText = `${startTag}${selectedText}${endTag}`;
        textArea.setRangeText(newText, start, end, 'end');
        textArea.focus();
    };

    return (
        <div id="toolbar" className="toolbar">
            <button type="button" onClick={() => addTag('<strong>', '</strong>')} className="btn btn-secondary btn-sm">
                <strong>Bold</strong>
            </button>
            <button type="button" onClick={() => addTag('<i>', '</i>')} className="btn btn-secondary btn-sm">
                <i>Italic</i>
            </button>
            <button type="button" onClick={() => addTag('<code>', '</code>')} className="btn btn-secondary btn-sm">
                <code>Code</code>
            </button>
        </div>
    );
};

export default Toolbar;
