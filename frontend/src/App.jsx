import ChatBox from "./components/Chat/ChatBox";
import "./App.css";
import { initCsrf } from "./services/csrf";

initCsrf()
function App() {
  return (
    <div className="App">
      <ChatBox />
    </div>
  );
}

export default App;
