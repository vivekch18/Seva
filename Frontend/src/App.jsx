// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import CampaignDetail from "./Components/CampaignDetail";
import CreateCampaign from "./Components/CreateCampaign";
import Navbar from "./Components/Navbar";
import CampaignList from "./Components/CampaignList";
import Footer from "./Components/Footer";
import AOS from 'aos';
import 'aos/dist/aos.css';
import About from "./Components/About";
import Login from "./Components/Login";
import Register from "./Components/Register";
import UserProfile from "./Components/UserProfile";
import MyCampaigns from './Components/MyCampaigns';
import AuthSuccess from "./Components/AuthSuccess";


function App() {
  AOS.init({ duration: 700, once: true });

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<CreateCampaign />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
        <Route path="/campaigns" element={<CampaignList />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-campaigns" element={<MyCampaigns />} />
        <Route path="/auth-success" element={<AuthSuccess />} />

      </Routes>
    </>
  );
}

export default App;
