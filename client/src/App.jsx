import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import AdminAdd from "./components/AdminAdd";
import EquipmentDetails from "./components/EquipmentDetails";
import MyRequests from "./pages/Myrequests";
import AdminUsers from "./components/AdminUsers";
import UserRequests from "./components/UserRequests";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/add" element={<AdminAdd />} />
        <Route path="/equipment/:id" element={<EquipmentDetails />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/users/:id/requests" element={<UserRequests />} />
      </Routes>
    </Router>
  );
}

export default App;
