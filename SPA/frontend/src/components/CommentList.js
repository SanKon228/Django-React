import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments, refreshComments }) => {
    if (!comments.length) {
        return <p>Немає коментарів.</p>;
    }

    return (
        <ul>
            {comments.map(comment => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    refreshComments={refreshComments}
                />
            ))}
        </ul>
    );
};

export default CommentList;
