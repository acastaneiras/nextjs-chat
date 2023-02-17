import Head from 'next/head';
import styles from '../styles/Index.module.css';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Chat from '../components/Chat';
import ChatInput from '../components/ChatInput';

export default function Home() {
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
      }
    });

    newSocket.on('updateUsers', (updatedUsers) => {
      setConnectedUsers(updatedUsers);
    });

    return () => {
      newSocket.off('assignUser');
      newSocket.off('updateUsers');
      newSocket.close();
    };
  }, [setSocket]);

  const changeAlias = (event) => {
    event.preventDefault();
    connectedUser.alias = alias;
    socket.emit('setAlias', connectedUser);
    setAlias('');
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>NextJS Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {socket ? (
          <div className="chat-container">
            <Chat socket={socket} />
            <ChatInput socket={socket} connectedUser={connectedUser} />
          </div>
        ) : (
          <div>Not Connected</div>
        )}
        <br />

        <div>
          <form onSubmit={changeAlias}>
            <div>Alias</div>
            <input
              autoFocus
              value={alias}
              placeholder="Type your alias..."
              onChange={e => setAlias(e.target.value)}
            />
            <button type="submit">Change alias</button>
          </form>
        </div>


        <br />
        {
          connectedUsers.length > 0 ? (
            <div>
              <div>Connected Users:</div>
              {
                connectedUsers.map((user) =>
                  <div key={user.uuid}>{user.alias} - {user.uuid}</div>
                )
              }
            </div>
          ) : null
        }
      </main>
    </div>
  )
}
