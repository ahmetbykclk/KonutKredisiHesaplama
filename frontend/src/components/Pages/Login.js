import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";
import Footer from "../Footer";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [loginSuccess, setLoginSuccess] = useState(true);

  useEffect(() => {
    document.title = "Kayıt Ol - Giriş Yap";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          userType,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok && data.authenticated) {
        console.log("Giriş başarılı");

        localStorage.setItem("userType", userType);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);

        if (userType === "admin") {
          navigate("/admin");
        } else {
          navigate("/kredihesaplama");
        }
      } else {
        console.log("Giriş başarısız");
        localStorage.removeItem("userType");
        localStorage.removeItem("userId");
        setLoginSuccess(false);
      }
    } catch (error) {
      console.error("Giriş sırasında hata:", error);
    }
  };
  const handleRegistration = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        console.log("Kayıt başarılı!");
        window.alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      } else {
        console.log("Kayıt başarısız");
        window.alert("Kayıt başarısız. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Kayıt sırasında hata:", error);
      window.alert("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const toggleUserType = () => {
    setUserType(userType === "user" ? "admin" : "user");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Giriş Yap</h1>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Kullanıcı Adı:</label>
            <input
              type="text"
              value={username}
              placeholder="Kullanıcı Adı"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Şifre:</label>
            <input
              type="password"
              value={password}
              placeholder="Şifre"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="user-type-toggle">
            <label>Admin Girişi: </label>
            <input
              type="checkbox"
              id="user-type-toggle"
              className="toggle-switch"
              checked={userType === "admin"}
              onChange={toggleUserType}
            />
            <label htmlFor="user-type-toggle" className="toggle-label">
              <span className="toggle-inner"></span>
              <span className="toggle-switch"></span>
            </label>
          </div>

          <button type="submit">Giriş Yap</button>

          <button type="button" onClick={handleRegistration}>
            Kayıt Ol
          </button>

          {!loginSuccess && (
            <p className="warning-message">
              Kullanıcı adı, şifre veya tür hatalı.
            </p>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
