import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import albarakaLogo from "./albaraka_logo.jpg";
import logoutIcon from "./logout.png";
import userLogo from "./UserLogo.png";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const handleLogOut = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    navigate("/");
  };
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "");
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType || "");
  }, []);
  const handleBaşvurularımClick = () => {
    navigate("/basvurularim");
    setShowDropdown(false);
  };

  const handleAdminSayfasıClick = () => {
    navigate("/admin");
    setShowDropdown(false);
  };

  return (
    <nav className="navigation-bar">
      <ul className="left-aligned">
        <li>
          <img
            src={albarakaLogo}
            alt="Albaraka Logo"
            className="logoImage"
            onClick={() => navigate("/")}
          />
        </li>
      </ul>
      <ul className="center-aligned">
        <li>
          <p onClick={() => navigate("/kredihesaplama")}>Kredi Hesaplama</p>
        </li>
        <li>
          <p onClick={() => navigate("/konutfiyatihesaplama")}>
            Konut Fiyatı Hesaplama
          </p>
        </li>
      </ul>
      <ul className="right-aligned">
        <li
          className="user-info"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <img src={userLogo} alt="profiepicture" className="userImage" />
          <p>{username}</p>
          {showDropdown && (
            <div className="dropdown-menu">
              <p onClick={handleBaşvurularımClick}>Başvurularım</p>
              {userType === "admin" && (
                <p onClick={handleAdminSayfasıClick}>Admin Sayfası</p>
              )}
            </div>
          )}
        </li>

        <li>
          <img
            src={logoutIcon}
            alt="Logout"
            className="logoutImage"
            onClick={handleLogOut}
          />
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
