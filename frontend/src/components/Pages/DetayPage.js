import React, { useEffect, useState } from "react";
import { PieChart, Pie } from "recharts";
import { useNavigate } from "react-router-dom";
import "../Styles/DetayPage.css";
import NavigationBar from "../NavigationBar";
import Footer from "../Footer";

const DetayPage = () => {
  const navigate = useNavigate();
  const [interestRate, setInterestRate] = useState(0);
  useEffect(() => {
    document.title = "Detay";
  }, []);

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType !== "admin" && userType !== "user") {
      navigate("/");
    }
  }, [navigate]);
  useEffect(() => {
    fetchInterestRateFromBackend();
  }, []);

  const fetchInterestRateFromBackend = () => {
    fetch("http://127.0.0.1:5000/get_interest_rate")
      .then((response) => response.json())
      .then((data) => {
        setInterestRate(parseFloat(data.interestRate));
      })
      .catch((error) => {
        console.error("Error fetching interest rate:", error);
      });
  };
  const formatNumber = (number) => {
    const formattedNumber = number
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedNumber;
  };
  const [loanAmount, setloanAmount] = useState(
    parseFloat(localStorage.getItem("loanAmount"))
  );
  const [loanDuration, setloanDuration] = useState(
    parseFloat(localStorage.getItem("loanDuration"))
  );
  const userId = parseInt(localStorage.getItem("userId"), 10);

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
  const generatePaymentRows = () => {
    const rows = [];
    let remainingBalance = loanAmount;
    let totalAnapara = 0;
    let totalFaiz = 0;
    let totalTaksit = toplamEkÜcretler;

    for (let i = 1; i <= loanDuration; i++) {
      const faiz = remainingBalance * (interestRate / 100);
      const anaPara = aylikTaksit - faiz;
      remainingBalance -= anaPara;

      totalAnapara += anaPara;
      totalFaiz += faiz;
      totalTaksit += aylikTaksit;

      rows.push(
        <tr key={i}>
          <td>{i}</td>
          <td>{formatNumber(aylikTaksit)} TL</td>
          <td>{formatNumber(anaPara)} TL</td>
          <td>{formatNumber(faiz)} TL</td>
          <td>0 TL</td>
          <td>0 TL</td>
          <td>{formatNumber(remainingBalance)} TL</td>
        </tr>
      );
    }

    rows.push(
      <tr key="total" className="toplam-row">
        <td>Toplam</td>
        <td>{formatNumber(totalTaksit)} TL</td>
        <td>{formatNumber(totalAnapara)} TL</td>
        <td>{formatNumber(totalFaiz)} TL</td>
        <td>0 TL</td>
        <td>0 TL</td>
        <td>-</td>
      </tr>
    );

    return rows;
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
  const data = [
    {
      name: "Kredi Tutarı",
      value: loanAmount,
      fill: "#f75f55",
    },
    { name: "Toplam Faiz", value: toplamFaiz, fill: "#39f3bb" },
    {
      name: "Toplam Ek Ücretler",
      value: toplamEkÜcretler,
      fill: "#ffee08",
    },
  ];

  return (
    <div>
      <NavigationBar />
      <div className="main-container">
        <div className="input-group-detay">
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
        <div className="upper-container">
          <div className="pie-chart-container">
            <PieChart width={300} height={372}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
              />
            </PieChart>
            <ul className="styled-list">
              <li>
                <p>Anapara</p>
                <p>{formatNumber(loanAmount)} TL</p>
              </li>
              <li>
                <p>Toplam Faiz</p>
                <p>{formatNumber(toplamFaiz)} TL</p>
              </li>
              <li>
                <p>Masraf</p>
                <p>{formatNumber(toplamEkÜcretler)} TL</p>
              </li>
            </ul>
          </div>
          <div className="content-container">
            <p>
              Kredi Tutarı: <span>{formatNumber(loanAmount)} TL</span>
            </p>
            <p>
              Kredi Vadesi: <span>{loanDuration} Ay</span>
            </p>
            <p>
              Faiz Oranı: <span>%{interestRate.toFixed(2)}</span>
            </p>
            <p>
              Aylık Taksit: <span>{formatNumber(aylikTaksit)} TL</span>
            </p>
            <p>
              Toplam Ödeme: <span>{formatNumber(toplamKrediMaliyeti)} TL</span>
            </p>
            <p>
              Toplam Faiz: <span>{formatNumber(toplamFaiz)} TL</span>
            </p>
            <p>
              Yıllık Maliyet Oranı:{" "}
              <span>{yillikMaliyetOrani.toFixed(2)}%</span>
            </p>
            <p>
              Banka Tahsis Ücreti:{" "}
              <span>{formatNumber(bankaTahsisUcreti)} TL</span>
            </p>
            <p>
              Ekspertiz Ücreti <span>{formatNumber(ekspertizUcreti)} TL</span>
            </p>
            <p>
              İpotek Ücreti <span>{ipotekUcreti} TL</span>
            </p>
            <button className="applyButton" onClick={handleApplyClick}>
              Hemen Başvur
            </button>
          </div>
        </div>
        <div className="table-container">
          <h1>Ödeme Planı</h1>
          <table>
            <thead>
              <tr>
                <th>Ay</th>
                <th>Taksit</th>
                <th>Anapara</th>
                <th>Faiz</th>
                <th>KKDF</th>
                <th>BSMV</th>
                <th>Bakiye</th>
              </tr>
            </thead>
            <tbody>{generatePaymentRows()}</tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DetayPage;
