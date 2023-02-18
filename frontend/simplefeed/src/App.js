import {BrowserRouter as Router} from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import NavBar from './NavBar';

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <NavBar></NavBar>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
