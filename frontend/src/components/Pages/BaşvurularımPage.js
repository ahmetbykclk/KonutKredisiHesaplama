import React, { useState, useEffect } from "react";
import "../Styles/BaşvurularımPage.css";
import Footer from "../Footer";
import NavigationBar from "../NavigationBar";

const BaşvurularımPage = () => {
  const [loanData, setLoanData] = useState([]);
  const userId = localStorage.getItem("userId");

  const formatNumber = (number) => {
    const formattedNumber = number
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedNumber;
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/get_loan_data?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
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
        setLoanData(processedData);
      })
      .catch((error) => console.error("Error fetching loan data:", error));
  }, [userId]);

  const handleDeleteLoanData = (dataId) => {
    fetch(`http://127.0.0.1:5000/delete_loan_data/${dataId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setLoanData((prevData) =>
          prevData.filter((data) => data.ID !== dataId)
        );
      })
      .catch((error) => console.error("Error deleting loan data:", error));
  };

  return (
    <div>
      <NavigationBar />
      <div className="Başvurularım-Page">
        <h2>Kredi Başvurularım</h2>
        {loanData.length > 0 ? (
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
                <th>Kredi Durumu</th>
                <th>Başvuru Sil</th>
              </tr>
            </thead>

            <tbody>
              {loanData.map((data) => (
                <tr key={data.ID}>
                  <td>{data.ID}</td>
                  <td>
                    {data.KrediMiktarı !== null
                      ? formatNumber(data.KrediMiktarı) + " TL"
                      : ""}
                  </td>
                  <td>
                    {data.KrediVadesi !== null ? data.KrediVadesi + " Ay" : ""}
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
                  <td>
                    <div
                      className={`status-indicator ${
                        data.KrediDurumu === 1 ? "approved" : "pending"
                      }`}
                    ></div>
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteLoanData(data.ID)}
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
        <Footer />
      </div>
    </div>
  );
};

export default BaşvurularımPage;
