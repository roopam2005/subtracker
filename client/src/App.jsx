import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ThreeBackground from "./components/ThreeBackground/ThreeBackground";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Analytics from "./pages/Analytics/Analytics";
import Calendar from "./pages/Calendar/Calendar";
import Settings from "./pages/Settings/Settings";

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  const protectedRoutes = ["/dashboard", "/analytics", "/calendar", "/settings"];
  const showSidebar = user && protectedRoutes.includes(location.pathname);
  const showNavbar = !showSidebar;

  return (
    <>
      <ThreeBackground />
      {showNavbar && <Navbar />}
      {showSidebar && <Sidebar />}

      <main className={showSidebar ? "with-sidebar" : ""}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Router>
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
          <AppContent />
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;