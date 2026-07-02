import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ThreeBackground from "./components/ThreeBackground/ThreeBackground";
import Navbar from "./components/Navbar/Navbar";
import Landing from "./pages/Landing/Landing";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ThreeBackground />
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#12121a",
              color: "#fff",
              border: "1px solid #2a2a3a",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;