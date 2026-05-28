import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import "./Auth.css";
import api from "../api/axios";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

function AuthPage() {
  const navigate = useNavigate(); // Add this hook
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  // EMAIL VERIFICATION STATES
  const [emailSent, setEmailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // TIMER LOGIC
  useEffect(() => {
    if (emailSent) {
      setTimer(30);
      setCanResend(false);

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setCanResend(true);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [emailSent]);

  // LOGIN / SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password
        });

        localStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        toast.success("Login Successful 🚀");
        
        // ✅ REDIRECT TO HOMEPAGE AFTER LOGIN
        navigate("/");
        
      } else {
        await api.post("/auth/signup", form);

        setRegisteredEmail(form.email);
        setEmailSent(true);

        toast.success("Verification email sent 📧");

        setForm({ name: "", email: "", password: "", phone: "" });
      }

    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data || {}).join(", ") ||
        "Something went wrong";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // RESEND EMAIL
  const handleResend = async () => {
    try {
      await api.post(`/auth/resend-verification?email=${registeredEmail}`);

      toast.success("Verification email resent 📧");

      setTimer(30);
      setCanResend(false);

    } catch {
      toast.error("Failed to resend email");
    }
  };

  // FORGOT PASSWORD
  const handleForgotPassword = async () => {
    const email = prompt("Enter your email:");
    if (!email) return;

    try {
      const res = await api.post("/auth/forgot-password", { email });
      toast.success(res.data.message);
    } catch {
      toast.error("Error sending reset link");
    }
  };

  // GOOGLE LOGIN HANDLER
  const handleGoogleLogin = async (response) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/api/auth/google",
        { token: response.credential }
      );

      localStorage.setItem("accessToken", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      toast.success("Google Login Successful 🚀");
      
      // ✅ REDIRECT TO HOMEPAGE AFTER GOOGLE LOGIN
      navigate("/");
      
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(err.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* VERIFY EMAIL UI */}
        {emailSent && (
          <div className="verify-message">
            <h3>📧 Verify Your Email</h3>
            <p>
              A verification link has been sent to <b>{registeredEmail}</b>
            </p>
            <p className="sub-text">
              Please check your inbox (and spam folder)
            </p>

            {/* TIMER / RESEND */}
            {!canResend ? (
              <p className="timer">Resend in {timer}s</p>
            ) : (
              <button onClick={handleResend} className="resend-btn">
                Resend Email
              </button>
            )}

            <button
              className="login-btn"
              onClick={() => {
                setEmailSent(false);
                setIsLogin(true);
              }}
            >
              Go to Login
            </button>
          </div>
        )}

        {/* AUTH FORM */}
        {!emailSent && (
          <>
            {loading && <p className="loading">Processing...</p>}

            <h2>{isLogin ? "Login" : "Sign Up"}</h2>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (10 digits)"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password (Eg: Test@123)"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>

              {isLogin && (
                <p className="forgot" onClick={handleForgotPassword}>
                  Forgot Password?
                </p>
              )}

              <button type="submit" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Log In"
                  : "Create Account"}
              </button>
            </form>

            <div className="divider">
              <span>{isLogin ? "Or log in with" : "Or sign up with"}</span>
            </div>
            
            {/* GOOGLE LOGIN BUTTON */}
            <div className="google-login-container">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.log('Google Login Failed');
                  toast.error('Google login failed');
                }}
                useOneTap={false}
                theme="outline"
                size="large"
                shape="rectangular"
                text={isLogin ? "signin_with" : "signup_with"}
              />
            </div>
            
            <p className="switch">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? " Sign Up" : " Log In"}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;