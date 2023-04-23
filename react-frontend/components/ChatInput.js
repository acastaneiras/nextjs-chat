import React, { useState } from 'react';

import { IoSendSharp } from "react-icons/io5";

const ChatInput = ({ socket, connectedUser, className }) => {
    const [value, setValue] = useState('');

    const newMessage = (event) => {
        event.preventDefault();

        if (value.length) {
            let message = {
                ...connectedUser,
                message: value,
            }
            console.log(message)
            socket.emit('storeMessage', message);
            setValue('');
        }
    }

    return (
        <div className={className}>
            <form onSubmit={newMessage} className='flex px-4'>
                <textarea
                    autoFocus
                    value={value}
                    placeholder="Type message..."
                    onChange={e => setValue(e.target.value)}
                    className='w-full mx-2 rounded-xl px-4 py-2 border border-gray-300 h-10 focus:outline-gray-300 resize-none overflow-hidden'
                    disabled={connectedUser.alias === '' ? 'disabled' : null}
                />
                <button className='h-full text-white bg-gradient-to-br from-indigo-600 to-sky-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center' type='submit'>
                    <span className='flex justify-center items-center'>
                        <IoSendSharp className='mr-2'/>
                            Send
                    </span>
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
