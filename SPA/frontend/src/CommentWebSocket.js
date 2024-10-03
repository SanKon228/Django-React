const socket = new WebSocket('ws://localhost:8000/ws/comments/');

socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log('New comment: ', data.comment);
};

function sendComment(comment) {
    socket.send(JSON.stringify({
        'comment': comment
    }));
}

export { sendComment };
