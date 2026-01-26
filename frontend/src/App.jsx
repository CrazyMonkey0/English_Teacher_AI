import { Routes, Route } from "react-router-dom";
import ChatBox from "./components/Chat/ChatBox";
import Login from "./components/Auth/LoginForm";
import Register from "./components/Auth/RegistrationForm";
import ForgotPasswordForm from "./components/Auth/ForgotPasswordForm";
import ForgotPasswordSent from "./components/Auth/ForgotPasswordSent";
import ResetPasswordForm from "./components/Auth/ResetPasswordFrom";
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
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/forgot-password/sent" element={<ForgotPasswordSent />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
        </Routes>
      </AuthProvider>

    </div>
  );
}

export default App;
