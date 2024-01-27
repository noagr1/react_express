import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

const UserContext = createContext();

function UserProfile() {
  let { userId } = useParams();
  const { users } = useContext(UserContext);
  const user = users.find(u => u.id === userId);

  return <h2>פרופיל משתמש: {user ? user.name : 'לא נמצא'}</h2>;
}

function Home() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { users, setUsers } = useContext(UserContext);

  function handleSubmit(event) {
    event.preventDefault();
    const userId = 'user_' + new Date().getTime();
    const newUser = { id: userId, name: name };

    fetch('http://localhost:5000/add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
    .then(() => {
      setUsers([...users, newUser]);
      navigate(`/user/${userId}`);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">הוסף משתמש</button>
      </form>
      <div>
        <h3>משתמשים:</h3>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <Link to={`/user/${user.id}`}>{user.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/get-users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <Router>
      <UserContext.Provider value={{ users, setUsers }}>
        <nav>
          <Link to="/">דף הבית</Link>
        </nav>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/user/:userId" element={<UserProfile />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
