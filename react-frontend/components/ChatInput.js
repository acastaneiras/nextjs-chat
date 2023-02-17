import React, { useState } from 'react';

const ChatInput = ({ socket, connectedUser }) => {
    const [value, setValue] = useState('');

    const newMessage = (event) => {
        event.preventDefault();

        if (value.length) {
            let message = {
                ...connectedUser,
                message: value,
            }

            socket.emit('storeMessage', message);
            setValue('');
        }
    }

    return (
        <div>
            <form onSubmit={newMessage}>
                <input
                    autoFocus
                    value={value}
                    placeholder="Type message..."
                    onChange={e => setValue(e.target.value)}
                    disabled={connectedUser.alias === '' ? 'disabled' : null}
                />
                <button type='submit'>Send</button>
            </form>
            Your alias: {connectedUser.alias}
            <br />
            Your UUID: {connectedUser.uuid}
        </div>


    );
};

export default ChatInput;