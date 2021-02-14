import React, {useEffect, useState} from 'react';
import './App.css';
import Chat from './components/Chat';
import Sidebar from "./components/Sidebar";
import Pusher from 'pusher-js';
import axios from "./axios";
 

function App() {

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('messages/sync')
      .then(response => {
        setMessages(response.data);
      });
  }, []);

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_ID, {
      cluster: process.env.REACT_APP_PUSHER_REGION
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  
  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
