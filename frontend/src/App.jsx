import { Routes, Route } from "react-router-dom";
import ChatBox from "./components/Chat/ChatBox";
import Login from "./components/Auth/LoginForm";
import Register from "./components/Auth/RegistrationForm";
import { AuthProvider } from "./context/useAuth";
import "./App.css";


function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ChatBox />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>

    </div>
  );
}

export default App;
