import { useState, useEffect} from 'react'
import './App.css'
import Header from './components/Header'
import Comments from './components/Comments';
import io from "socket.io-client";

const SERVER_ADDRESS = "http://localhost:4000";
const socket = io.connect(`${SERVER_ADDRESS}`);

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");


  const fetchUsers = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/users`);
    const users = await response.json();
    setUsers(users);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <Header users={users} selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId} />
      <Comments selectedUserId={selectedUserId} socket={socket}/>
    </div>)
}

export default App
