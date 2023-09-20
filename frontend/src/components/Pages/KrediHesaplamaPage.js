import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/KrediHesaplamaPage.css";
import NavigationBar from "../NavigationBar";
import Footer from "../Footer";

const KrediHesaplamaPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Kredi Hesaplama";
  }, []);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "admin" && userType !== "user") {
      navigate("/");
    }
  }, [navigate]);

  const [loanAmount, setLoanAmount] = useState("");
  const [loanDuration, setLoanDuration] = useState(12);

  const handleLoanAmountChange = (event) => {
    const newLoanAmount = parseFloat(event.target.value);
    setLoanAmount(newLoanAmount);
  };

  const handleLoanDurationChange = (event) => {
    const newLoanDuration = parseInt(event.target.value, 10);
    setLoanDuration(newLoanDuration);
  };

  const handleCalculateButtonClick = () => {
    localStorage.setItem("loanAmount", loanAmount);
    localStorage.setItem("loanDuration", loanDuration);
    navigate(
      `/kredihesaplama/sorgulama?amount=${loanAmount}&maturity=${loanDuration}`
    );
  };
  const handleKonutFiyatiHesaplamaClick = () => {
    navigate("/konutfiyatihesaplama");
  };

  return (
    <div>
      <NavigationBar />
      <div className="kredi-hesaplama-container">
        <div className="kredi-hesaplama-form">
          <h1 className="kredi-hesaplama-title">KREDİ HESAPLAMA</h1>
          <div className="input-group">
            <label htmlFor="loan-amount">Kredi Tutarı: </label>
            <div className="input-with-addon">
              <input
                type="number"
                id="loan-amount"
                placeholder={loanAmount === "" ? "Kredi Tutarı" : ""}
                value={loanAmount}
                onChange={handleLoanAmountChange}
              />
              <span className="addon">TL</span>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="loan-duration">Kredi Vadesi:</label>
            <select
              id="loan-duration"
              value={loanDuration}
              onChange={handleLoanDurationChange}
            >
              <option value={12}>1 Yıl (12 Ay)</option>
              <option value={24}>2 Yıl (24 Ay)</option>
              <option value={36}>3 Yıl (36 Ay)</option>
              <option value={48}>4 Yıl (48 Ay)</option>
              <option value={60}>5 Yıl (60 Ay)</option>
              <option value={72}>6 Yıl (72 Ay)</option>
              <option value={84}>7 Yıl (84 Ay)</option>
              <option value={96}>8 Yıl (96 Ay)</option>
              <option value={108}>9 Yıl (108 Ay)</option>
              <option value={120}>10 Yıl (120 Ay)</option>
              <option value={132}>11 Yıl (132 Ay)</option>
              <option value={144}>12 Yıl (144 Ay)</option>
              <option value={156}>13 Yıl (156 Ay)</option>
              <option value={168}>14 Yıl (168 Ay)</option>
              <option value={180}>15 Yıl (180 Ay)</option>
            </select>
          </div>
          <div className="button-container">
            <button onClick={handleCalculateButtonClick}>HESAPLA</button>
          </div>
          <div className="konut-fiyati-link">
            <p onClick={handleKonutFiyatiHesaplamaClick}>
              Konut Fiyatı Hesaplama
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default KrediHesaplamaPage;
