// src/pages/AuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token); // or save to context
      navigate("/"); // redirect to home
    } else {
      navigate("/"); // fallback
    }
  }, [navigate]);

  return <p>Logging in...</p>;
};

export default AuthSuccess;
