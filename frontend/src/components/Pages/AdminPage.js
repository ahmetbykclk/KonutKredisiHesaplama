import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/AdminPage.css";
import NavigationBar from "../NavigationBar";
import Footer from "../Footer";

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Sayfası";
  }, []);

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType !== "admin") {
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
  const [applicationDataArray, setApplicationDataArray] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/get_loan_data")
      .then((response) => response.json())
      .then((data) => {
        const processedData = data.map((item) => ({
          ...item,
          KrediMiktarı: parseFloat(item.KrediMiktarı) || 0,
          KrediVadesi: parseInt(item.KrediVadesi) || 0,
          FaizOranı: parseFloat(item.FaizOranı) || 0,
          AylıkTaksit: parseFloat(item.AylıkTaksit) || 0,
          ToplamKrediMaliyeti: parseFloat(item.ToplamKrediMaliyeti) || 0,
          ToplamFaiz: parseFloat(item.ToplamFaiz) || 0,
          YıllıkMaliyetOranı: parseFloat(item.YıllıkMaliyetOranı) || 0,
          BankaTahsisÜcreti: parseFloat(item.BankaTahsisÜcreti) || 0,
          EkspertizÜcreti: parseFloat(item.EkspertizÜcreti) || 0,
          İpotekÜcreti: parseFloat(item.İpotekÜcreti) || 0,
        }));
        setApplicationDataArray(processedData);
      })
      .catch((error) => {
        console.error("Veri çekme hatası:", error);
      });
  }, []);
  const handleAcceptRow = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/accept_loan_application/${id}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();

      if (data.message) {
        const updatedDataArray = applicationDataArray.map((item) =>
          item.ID === id ? { ...item, KrediDurumu: 1 } : item
        );
        setApplicationDataArray(updatedDataArray);
      } else {
        console.error("Acceptance error:", data.error);
      }
    } catch (error) {
      console.error("Acceptance error:", error);
    }
  };
  const handleDeleteRow = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/delete_loan_data/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.message) {
        const updatedDataArray = applicationDataArray.filter(
          (item) => item.ID !== id
        );
        setApplicationDataArray(updatedDataArray);
      } else {
        console.error("Silme hatası:", data.error);
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const [interestRate, setInterestRate] = useState(0);

  useEffect(() => {
    const savedInterestRate = localStorage.getItem("interestRate");
    if (savedInterestRate) {
      setInterestRate(parseFloat(savedInterestRate));
    }
  }, []);

  const handleInterestRateChange = (event) => {
    const newInterestRate = parseFloat(event.target.value);
    setInterestRate(newInterestRate);
  };

  const handleSaveButtonClick = async () => {
    localStorage.setItem("interestRate", interestRate.toString());

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/update_interest_rate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ interestRate }),
        }
      );

      if (response.ok) {
        alert("Faiz oranı kaydedildi!");
      } else {
        const errorData = await response.json();
        alert("Faiz oranı kaydedilirken hata: " + errorData.error);
      }
    } catch (error) {
      console.error("Faiz oranı kaydedilirken hata:", error);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="admin-page-container">
        <div className="admin-form-container">
          <h1 className="admin-centered-text">ADMIN</h1>
          <div className="admin-label-input-container">
            <label>Yeni Faiz Oranı:</label>
            <input
              type="number"
              step="0.01"
              placeholder="Faiz Oranı"
              onChange={handleInterestRateChange}
            />
          </div>
          <div>
            <p>Aktif Faiz Oranı: %{interestRate}</p>{" "}
          </div>
          <div className="admin-button-container">
            <button onClick={handleSaveButtonClick}>KAYDET</button>
          </div>
        </div>
        <div>
          <h2>Kredi Başvuruları</h2>
          {applicationDataArray.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Kredi Tutarı</th>
                  <th>Kredi Vadesi</th>
                  <th>Faiz Oranı</th>
                  <th>Aylık Taksit</th>
                  <th>Toplam Ödeme</th>
                  <th>Toplam Faiz</th>
                  <th>Yıllık Maliyet Oranı</th>
                  <th>Banka Tahsis Ücreti</th>
                  <th>Ekspertiz Ücreti</th>
                  <th>İpotek Ücreti</th>
                  <th>User ID</th>
                  <th>Kredi Durumu</th>
                  <th>Başvuru Onay</th>
                  <th>Başvuru Sil</th>
                </tr>
              </thead>

              <tbody>
                {applicationDataArray.map((data) => (
                  <tr key={data.ID}>
                    <td>{data.ID}</td>
                    <td>
                      {data.KrediMiktarı !== null
                        ? formatNumber(data.KrediMiktarı) + " TL"
                        : ""}
                    </td>
                    <td>
                      {data.KrediVadesi !== null
                        ? data.KrediVadesi + " Ay"
                        : ""}
                    </td>
                    <td>
                      {data.FaizOranı !== null
                        ? data.FaizOranı.toFixed(2) + "%"
                        : ""}
                    </td>
                    <td>
                      {data.AylıkTaksit !== null
                        ? formatNumber(data.AylıkTaksit) + " TL"
                        : ""}
                    </td>
                    <td>
                      {data.ToplamKrediMaliyeti !== null
                        ? formatNumber(data.ToplamKrediMaliyeti) + " TL"
                        : ""}
                    </td>
                    <td>
                      {data.ToplamFaiz !== null
                        ? formatNumber(data.ToplamFaiz) + " TL"
                        : ""}
                    </td>
                    <td>
                      {data.YıllıkMaliyetOranı !== null
                        ? data.YıllıkMaliyetOranı.toFixed(2) + "%"
                        : ""}
                    </td>
                    <td>
                      {data.BankaTahsisÜcreti !== null
                        ? formatNumber(data.BankaTahsisÜcreti) + " TL"
                        : ""}
                    </td>
                    <td>
                      {data.EkspertizÜcreti !== null
                        ? formatNumber(data.EkspertizÜcreti) + " TL"
                        : ""}
                    </td>
                    <td>
                      {data.İpotekÜcreti !== null
                        ? formatNumber(data.İpotekÜcreti) + " TL"
                        : ""}
                    </td>
                    <td>{data.UserID !== null ? data.UserID : ""}</td>
                    <td>
                      <div
                        className={`status-indicator ${
                          data.KrediDurumu === 1 ? "approved" : "pending"
                        }`}
                      ></div>
                    </td>
                    <td>
                      <button
                        className="accept-button"
                        onClick={() => handleAcceptRow(data.ID)}
                        disabled={data.KrediDurumu === 1}
                      >
                        Onayla
                      </button>
                    </td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteRow(data.ID)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Kredi başvurusu bulunmuyor.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
