import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import LandingPage from "./pages/LandingPage";
import Login from "./pages/login";
import Registration from "./pages/register";
import HomePage from "./pages/home";
import ManageBookings from "./pages/bookings";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/manage-bookings" element={<ManageBookings/>}/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;