import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Styles/SorgulamaPage.css";
import albarakaLogo from "../albaraka_logo.jpg";
import NavigationBar from "../NavigationBar";
import Footer from "../Footer";

const SorgulamaPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Sorgulama";

    fetch("http://127.0.0.1:5000/get_interest_rate")
      .then((response) => response.json())
      .then((data) => {
        setInterestRate(parseFloat(data.interestRate));
      })
      .catch((error) => {
        console.error("Error fetching interest rate:", error);
      });

    const userType = localStorage.getItem("userType");

    if (userType !== "admin" && userType !== "user") {
      navigate("/");
    }
  }, [navigate]);

  const formatNumber = (number) => {
    const formattedNumber = number
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedNumber;
  };
  const [interestRate, setInterestRate] = useState(0);

  const userId = parseInt(localStorage.getItem("userId"), 10);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [loanAmount, setloanAmount] = useState(
    parseFloat(searchParams.get("amount"))
  );
  const [loanDuration, setloanDuration] = useState(
    parseInt(searchParams.get("maturity"), 10)
  );

  const bankaTahsisOrani = 0.5; // doğru
  const ekspertizUcreti = 3000; // doğru
  const ipotekUcreti = 900; // doğru
  const bankaTahsisUcreti = (bankaTahsisOrani / 100) * loanAmount; // doğru
  const toplamEkÜcretler = bankaTahsisUcreti + ekspertizUcreti + ipotekUcreti;
  const aylikFaizOrani = interestRate / 100;
  const aylikTaksit =
    (loanAmount * aylikFaizOrani) /
    (1 - Math.pow(1 + aylikFaizOrani, -loanDuration)); // Doğru çıkıyor

  const toplamFaiz = aylikTaksit * loanDuration - loanAmount; // doğru
  const toplamKrediMaliyeti = loanAmount + toplamEkÜcretler + toplamFaiz; //doğru
  const yillikMaliyetOrani =
    ((toplamFaiz + toplamEkÜcretler) / loanAmount) * (12 / loanDuration) * 100; //sorunlu

  localStorage.setItem("loanAmount", loanAmount);
  localStorage.setItem("loanDuration", loanDuration);

  const handleDetayClick = () => {
    navigate("/kredihesaplama/sorgulama/detay");
  };

  const handleApplyClick = async () => {
    const newData = {
      UserID: userId,
      KrediMiktarı: loanAmount,
      KrediVadesi: loanDuration,
      FaizOranı: interestRate,
      AylıkTaksit: aylikTaksit,
      ToplamKrediMaliyeti: toplamKrediMaliyeti,
      ToplamFaiz: toplamFaiz,
      YıllıkMaliyetOranı: yillikMaliyetOrani,
      BankaTahsisÜcreti: bankaTahsisUcreti,
      EkspertizÜcreti: ekspertizUcreti,
      İpotekÜcreti: ipotekUcreti,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/insert_loan_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        alert("Başvuru veritabanına kaydedildi!");
      } else {
        const errorData = await response.json();
        alert("Başvuru veritabanına kaydedilirken hata: " + errorData.error);
      }
    } catch (error) {
      console.error("Başvuru veritabanına kaydedilirken hata:", error);
    }
  };
  return (
    <div>
      <NavigationBar />
      <div className="pageContainer">
        <div className="input-group">
          <div className="left-input">
            <label htmlFor="new-loan-amount">Yeni Kredi Tutarı:</label>
            <input
              type="number"
              id="new-loan-amount"
              step="100"
              placeholder="Yeni Kredi Tutarı"
              value={loanAmount}
              onChange={(event) =>
                setloanAmount(parseFloat(event.target.value))
              }
            />
            <span className="addon1">TL</span>
          </div>
          <div className="right-input">
            <label htmlFor="new-loan-duration">Yeni Kredi Vadesi:</label>
            <select
              id="new-loan-duration"
              value={loanDuration}
              onChange={(event) =>
                setloanDuration(parseInt(event.target.value, 10))
              }
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
        </div>
        <div className="resultContainer">
          <img src={albarakaLogo} alt="Albaraka Logo" className="logoImage" />
          <p>Kredi Tutarı: {formatNumber(loanAmount)} TL</p>
          <p>Kredi Vadesi: {loanDuration} Ay</p>
          <p>Faiz Oranı: %{interestRate.toFixed(2)}</p>
          <p>Aylık Taksit: {formatNumber(aylikTaksit)} TL</p>
          <p>Toplam Ödeme: {formatNumber(toplamKrediMaliyeti)} TL</p>
          <button className="applyButton" onClick={handleApplyClick}>
            Hemen Başvur
          </button>
          <button className="detailButton" onClick={handleDetayClick}>
            Detay
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SorgulamaPage;
