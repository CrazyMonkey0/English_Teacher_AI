import { Routes, Route } from "react-router-dom";
import ChatBox from "./components/Chat/ChatBox";
import Login from "./components/Auth/LoginForm";
import { AuthProvider } from "./context/useAuth";
import "./App.css";
import { initCsrf } from "./services/csrf";

initCsrf();

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ChatBox />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>

    </div>
  );
}

export default App;
