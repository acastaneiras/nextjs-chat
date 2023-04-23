import Head from 'next/head';
import styles from '../styles/Home.module.css'

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MdMode } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi";
import { IoCheckmarkCircleOutline, IoPeopleSharp } from "react-icons/io5";


import Chat from '../components/Chat';
import ChatInput from '../components/ChatInput';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useState("#fff");
  const [socket, setSocket] = useState(null);
  const [alias, setAlias] = useState('');
  const [connectedUser, setConnectedUser] = useState({});
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('assignUser', (newUser) => {
      if (!connectedUser.hasOwnProperty('uuid')) {
        console.log(newUser)
        setConnectedUser(newUser);
        setConnected(true);
      }
    });

    newSocket.on('updateUsers', (updatedUsers) => {
      setConnectedUsers(updatedUsers);
    });

    newSocket.on('resetConnection', () => {
      console.log('eyy')
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

  const changeAlias = (event) => {
    event.preventDefault();
    if (alias !== '') {
      connectedUser.alias = alias;
      socket.emit('setAlias', connectedUser);
      setAlias('');
    }
  }

  const handleChangeColor = (color) => {
    setColor(color.hex)
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
                    <MdMode className='my-1 mr-2' /> Assign alias
                  </span>
                </div>
                <div className='relative w-full p-4'>
                  <input
                    autoFocus
                    value={alias}
                    placeholder="Type your alias..."
                    className='w-full rounded-xl border border-gray-300 focus:outline-gray-300 p-3 my-auto'
                    onChange={e => setAlias(e.target.value)}
                    required
                  />
   

                </div>
                <div className=' inset-x- bottom-0 h-16 w-full p-2 '>
                  <button type="submit" className='h-full w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-2xl text-sm px-5 py-2.5 text-center flex justify-center items-center '>
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
        <div className="container md:mx-auto sm:mx-auto min-h-screen flex relative">
          <Head>
            <title>NextJS Chat</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className='flex my-8 rounded-3xl min-h-full w-full overflow-hidden shadow-2xl '>
            <div id="connected-users" className='md:w-1/3 bg-gradient-to-b from-indigo-500 text-white to-sky-400'>
              {
                connectedUsers.length > 0 ? (
                  <div className='p-4'>
                    <div className='flex justify-center items-center'><IoPeopleSharp className='text-xl mr-2' /> Connected Users</div>
                    {
                      connectedUsers.map((user, i) =>
                        <div key={i}><span className='flex items-center'><HiOutlineUserCircle className='mr-2'/> {user.alias}</span></div>
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
            <div id="chat-container" className='md:w-2/3 bg-blue-50 h-full'>
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
