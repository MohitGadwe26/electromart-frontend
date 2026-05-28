import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function VerifyEmail() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); 
  // loading | success | error

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await api.post(`/auth/verify-email?token=${token}`);
        console.log(res.data);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div style={styles.container}>

      {status === "loading" && (
        <h2>Verifying your email... ⏳</h2>
      )}

      {status === "success" && (
        <>
          <h2>✅ Email Verified Successfully!</h2>
          <p>You can now login to your account.</p>

          <button onClick={() => navigate("/")}>
            Go to Login
          </button>
        </>
      )}

      {status === "error" && (
        <>
          <h2>❌ Verification Failed</h2>
          <p>Invalid or expired token.</p>

          <button onClick={() => navigate("/")}>
            Back to Login
          </button>
        </>
      )}

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px"
  }
};

export default VerifyEmail;