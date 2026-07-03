import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ThreeBackground from "./components/ThreeBackground/ThreeBackground";
import Navbar from "./components/Navbar/Navbar";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

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
            success: {
              iconTheme: {
                primary: "#43e97b",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ff6584",
                secondary: "#fff",
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;