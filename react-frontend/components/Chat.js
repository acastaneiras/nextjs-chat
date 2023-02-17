import React, { useEffect, useState } from 'react';

function Chat({ socket }) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('updateMessages', (newMessages) => {
            setMessages(newMessages);
        })

        return () => {
            socket.off('updateMessages');
            socket.close();
        }
    }, [socket]);

    return (
        <div className="message-list">
            {
            messages ?
            messages.map((message, index) => 
                    <div key={index}>{message.alias} - {message.uuid}: {message.message}</div>
                )
                : 'No messages'
            }
        </div>
    );
}

export default Chat;