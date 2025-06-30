import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [input, setInput] = useState(""); // mobile number only
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isPasswordLogin, setIsPasswordLogin] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  // Countdown logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(input.trim())) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    try {
      await axios.post(`${process.env.SERVER_URL}/api/auth/send-otp`, {
        contact: input.trim(),
      });
      setOtpSent(true);
      setTimer(30); // Start 30 seconds delay
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter OTP");
      return;
    }
    try {
      const res = await axios.post(`${process.env.SERVER_URL}/api/auth/verify-otp`, {
        contact: input.trim(),
        otp: otp.trim(),
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed");
    }
  };

  const loginWithPassword = async () => {
    if (!/^\d{10}$/.test(input.trim())) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!password.trim()) {
      setError("Password cannot be empty");
      return;
    }

    try {
      const res = await axios.post(`${process.env.SERVER_URL}/api/auth/login`, {
        phone: input.trim(),
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid phone number or password");
    }
  };

  const handleGoogleLogin = () => {
    window.open(`${process.env.SERVER_URL}/api/auth/google`, "_self");
  };

  const toggleLoginMode = () => {
    setIsPasswordLogin(!isPasswordLogin);
    setError(null);
    setOtpSent(false);
    setOtp("");
    setPassword("");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5 mt-5">
      <div className="w-100" style={{ maxWidth: "420px" }}>
        {/* Promo Banner */}
        <div
          className="alert alert-success text-center small rounded-pill py-2 mb-4"
          role="alert"
        >
          🎁 Save a life with just ₹10 on the Seva App.{" "}
          <strong>
            <a href="#" className="text-decoration-underline">
              Download Now
            </a>
          </strong>
        </div>

        {/* Login Box */}
        <div className="border rounded shadow-sm p-4 bg-white">
          <h3 className="text-center fw-bold mb-4">Login</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Mobile Number Field */}
          <input
            type="text"
            placeholder="Mobile Number *"
            className="form-control mb-3"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
          />

          {/* Conditional Form Fields */}
          {isPasswordLogin ? (
            <>
              <input
                type="password"
                placeholder="Password"
                className="form-control mb-3"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
              />
              <button
                className="btn btn-info text-white w-100 fw-semibold"
                onClick={loginWithPassword}
              >
                Login
              </button>
            </>
          ) : !otpSent ? (
            <button
              className="btn btn-info text-white w-100 fw-semibold"
              onClick={sendOtp}
              disabled={timer > 0}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Get OTP"}
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                className="form-control mb-3"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (error) setError(null);
                }}
              />
              <button
                className="btn btn-success w-100 fw-semibold mb-2"
                onClick={verifyOtp}
              >
                Verify OTP
              </button>
              <button
                className="btn btn-link text-info text-decoration-none fw-medium w-100 p-0"
                onClick={sendOtp}
                disabled={timer > 0}
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>
            </>
          )}

          {/* Toggle Login Mode */}
          <div className="text-center my-2">
            <button
              className="btn btn-link text-info text-decoration-none fw-medium p-0"
              onClick={toggleLoginMode}
            >
              {isPasswordLogin ? "Login via OTP" : "Login via Password"}
            </button>
          </div>

          {/* Divider */}
          <div className="d-flex align-items-center my-3">
            <div className="flex-grow-1 border-top"></div>
            <span className="mx-2 text-muted">OR</span>
            <div className="flex-grow-1 border-top"></div>
          </div>

          {/* Google Sign In */}
          <button
            className="text-dark btn btn-outline-light border w-100 d-flex align-items-center justify-content-center shadow-sm"
            onClick={handleGoogleLogin}
            style={{
              backgroundColor: "#fff",
              borderColor: "#ccc",
              fontWeight: 500,
            }}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              style={{ width: 20, marginRight: 12 }}
            />
            Sign in
          </button>

          {/* Terms + CTA */}
          <div className="text-center small text-muted mt-4">
            By continuing you agree to our{" "}
            <a href="#" className="text-info">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-info">
              Privacy Policy
            </a>
          </div>

          <div className="text-center mt-3 fw-medium">
            SignUp? <a href="/register" className="text-info">Click here</a>
          </div>
        </div>
      </div>
    </div>
  );
}
