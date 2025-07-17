import logo from './logo.svg';
import './App.css';
import { Suspense, use, useEffect, useState } from 'react';
import { connectWebSocket } from './services/WebSocketClient';
import DataList from './DataList';

function App() {
  const [message, setMessage] = useState('');
  const [client, setClient] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const client = connectWebSocket((msg) => {
      setTimeout(setData(prev => [...prev, msg]), 5000);
      //setIsLoading(false);
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

      <Suspense fallback={<>Loading....</>}>
        <DataList data={data} />
      </Suspense>
    </div>
  );
}

export default App;
