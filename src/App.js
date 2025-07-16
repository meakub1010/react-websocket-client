import logo from './logo.svg';
import './App.css';
import { use, useEffect, useState } from 'react';
import { connectWebSocket } from './services/WebSocketClient';

function App() {
  const [message, setMessage] = useState('');
  const [client, setClient] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const client = connectWebSocket((msg) => {
      setData(prev => [...prev, msg]);
    });
    setClient(client);
    return () => client.deactivate(); // clean up
  },[])

  function sendMessage(){
    if(client && client.connected){
      console.log(client);
      client.publish({
        destination: '/app/sendMessage',
        body: message
      });
      console.log('Message sent: ', message);
      setMessage('');
    }
  }

  return (
    <div className="App">
      <h2>Websocket Message</h2>
      <input type='text' id="msg" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send Message</button>

      <h3>Data Received</h3>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))
        }
      </ul>
      

    </div>
  );
}

export default App;
