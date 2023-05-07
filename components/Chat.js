import React, { useEffect, useRef, useState } from 'react';
import { IoChatbubblesSharp } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import colorConfig from '../theme/config';

function Chat({ socket, connectedUser, className, onEmojiClick, pickerShow }) {
    const [messages, setMessages] = useState([]);
    const lastMessageRef = useRef(null);

    useEffect(() => {
        socket.on('updateMessages', (newMessages) => {
            setMessages(newMessages);
        })

        return () => {
            socket.off('updateMessages');
            socket.disconnect();
        }
    }, [socket]);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


    const getGradientClass = (color) => {
        let colorClass = colorConfig[color]
        return colorClass.chat;
    };

    const emojiClicked = (emojiData, MouseEvent) => {
        if (emojiData) {
            onEmojiClick(emojiData.emoji);
        }
    }

    return (
        <div className={className}>
            <div className='chat-header w-100 py-4 px-6 bg-blue-50 border-b-2 border-gray-200'><span className='flex'><IoChatbubblesSharp className='text-xl mr-2 text-gray-600' /> General chat</span> </div>
            <div className="message-list pb-4 flex flex-col overflow-y-auto bg-chat-white h-full px-4 max-h-[80vh]">
                {pickerShow ?
                    <div className='absolute right-0 bottom-16 pb-8 pr-5'>
                        <EmojiPicker skinTonesDisabled={true} onEmojiClick={emojiClicked} emojiStyle="native" />
                    </div>
                    : ''}
                {
                    messages && messages.map((message, index) => {
                        let lastUser = index !== 0 ? messages[index - 1] : null;
                        const isLastMessage = index === messages.length - 1;
                        const gradientClass = getGradientClass(message.color);

                        return (
                            <div ref={isLastMessage ? lastMessageRef : null} className={`${connectedUser.uuid === message.uuid ? 'self-end' : 'self-start'} ${(!lastUser || lastUser.uuid !== message.uuid) ? 'mt-3' : 'mt-1'} max-w-[80%]`} key={index}>
                                {
                                    (!lastUser || lastUser.uuid !== message.uuid) && (
                                        <div className={`${connectedUser.uuid === message.uuid ? 'self-end mr-1' : 'self-start ml-1'} flex text-sm text-gray-500`}>
                                            <span className={`${connectedUser.uuid === message.uuid ? 'text-right' : 'text-left'} w-full`}>{message.alias}</span>
                                        </div>
                                    )
                                }
                                <div className={`${gradientClass} bg-gradient-to-br px-4 py-2  text-white rounded-xl whitespace-pre-wrap`}>
                                    {message.message}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Chat;
