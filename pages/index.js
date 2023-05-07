import Head from 'next/head';
import styles from '../styles/Home.module.css'
import colorConfig from '../theme/config';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MdMode } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi";
import { IoCheckmarkCircleOutline, IoPeopleSharp } from "react-icons/io5";
import { FaPaintBrush, FaPencilAlt } from "react-icons/fa"
import ColorButton from '../components/ColorButton';


import Chat from '../components/Chat';
import ChatInput from '../components/ChatInput';

export default function Home() {
  const [connected, setConnected] = useState(false);

  const [color, setColor] = useState(null);
  const [socket, setSocket] = useState(null);
  const [alias, setAlias] = useState('');
  const [connectedUser, setConnectedUser] = useState({});
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('assignUser', (newUser) => {
      if (!connectedUser.hasOwnProperty('uuid')) {
        setConnectedUser(newUser);
        setConnected(true);
      }
    });

    newSocket.on('updateUsers', (updatedUsers) => {
      setConnectedUsers(updatedUsers);
    });

    newSocket.on('resetConnection', () => {
      setConnectedUser({});
      setAlias('');
      setConnected(false);
    })

    newSocket.on('closeConnection', () => {
      setConnectedUser({});
      setAlias('');
      setConnectedUsers([]);
      setSocket(null);
      setConnected(false);
    });

    return () => {
      newSocket.off('assignUser');
      newSocket.off('updateUsers');
      newSocket.off('closeConnection');
      newSocket.off('resetConnection');
      newSocket.disconnect();
    };
  }, [setSocket]);


  const handleSetColor = (selectedColor) => {
    setColor(selectedColor);
  }

  const changeAlias = (event) => {
    event.preventDefault();
    if (alias !== '' && color !== null) {
      connectedUser.alias = alias;
      connectedUser.color = color;

      socket.emit('setAlias', connectedUser);
      setAlias('');
    }
  }
  return (
    <div>
      {!connected ? (
        <div>
          <div className='absolute min-h-full w-full bg-gray-900/80 z-10'>

            <div className={`my-10 translate-y-1/2 left-0 right-0 bg-slate-50 rounded-3xl md:w-1/3 absolute w-4/5 overflow-hidden shadow-2xl mx-auto`}>
              <form onSubmit={changeAlias} className='h-full'>
                <div className='w-full py-4 px-4 bg-blue-50 border-b-2 font-bold border-gray-200'>
                  <span className='flex'>
                    <MdMode className='my-1 mr-2' /> Your details
                  </span>
                </div>
                <div className='relative w-[80%] flex flex-col justify-center m-auto p-4'>
                  <div className='flex flex-col justify-center items-center'>
                    <label className='ml-1 flex justify-center items-center mb-2'>
                      <FaPencilAlt className='mr-1' /> Alias
                    </label>
                    <input
                      autoFocus
                      value={alias}
                      placeholder="Type your alias..."
                      className='w-full rounded-xl border border-gray-300 focus:outline-gray-300 p-3 my-auto'
                      onChange={e => setAlias(e.target.value)}
                      required
                    />
                  </div>
                  <div className='mt-4'>
                    <label className='ml-1 flex justify-center align-center items-center mb-2'>
                      <FaPaintBrush className='mr-1' /> Pick color
                    </label>
                    <div className='colors flex flex-wrap justify-center'>
                      <ColorButton onClick={handleSetColor} selectedColor={color} color="red" />
                      <ColorButton onClick={handleSetColor} selectedColor={color} color="pink" />
                      <ColorButton onClick={handleSetColor} selectedColor={color} color="purple" />
                      <ColorButton onClick={handleSetColor} selectedColor={color} color="green" />
                      <ColorButton onClick={handleSetColor} selectedColor={color} color="blue" />
                      <ColorButton onClick={handleSetColor} selectedColor={color} color="cyan" />
                      <ColorButton onClick={handleSetColor} selectedColor={color} color="yellow" />
                      <ColorButton onClick={handleSetColor} selectedColor={color} color="orange" />
                    </div>
                  </div>
                </div>
                <div className=' inset-x- bottom-0 h-16 w-full p-2 '>
                  <button type="submit" className='h-full w-full text-white bg-gradient-to-br from-blue1 to-blue2 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-2xl text-sm px-5 py-2.5 text-center flex justify-center items-center '>
                    <span className='flex justify-center items-center'>
                      <IoCheckmarkCircleOutline className='mr-1 text-[24px]' />Change alias
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : ""}
      <div className='bg-gradient-to-tr from-blue-300/50 to-sky-300/50'>
        <div className="container mx-auto min-h-screen flex relative">
          <Head>
            <title>NextJS Chat</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className='flex flex-col mx-2 md:mx-0 md:flex-row my-8 rounded-3xl min-h-full w-full overflow-hidden shadow-2xl'>
            <div id="connected-users" className='w-full md:w-1/3 bg-gradient-to-b from-blue1 text-white to-blue2'>
              {
                
                connectedUsers.length > 0 ? (
                  <div className='p-4'>
                    <div className='flex justify-center items-center'><IoPeopleSharp className='text-xl mr-2' /> Connected Users</div>
                    {
                      connectedUsers.map((user, i) =>
                      <div key={i}>
                        <span className='flex items-center'>
                          <HiOutlineUserCircle
                            className={`mr-2 ${colorConfig[user.color].text}`}
                          />
                          {user.alias}
                        </span>
                      </div>
                    )
                    }
                  </div>
                ) : (
                  <div className='p-4'>
                    No users yet
                  </div>
                )
              }

            </div>
            <div id="chat-container" className='w-full md:w-2/3 bg-blue-50 h-full'>
              {socket ? (
                <div className='h-full relative'>
                  <Chat socket={socket} connectedUser={connectedUser} className="h-5/6" />
                  <ChatInput socket={socket} connectedUser={connectedUser} className="absolute inset-x-0 bottom-0 h-16" />
                </div>
              ) : (
                <div>Not Connected</div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>

  )
}
