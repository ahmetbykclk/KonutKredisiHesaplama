import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/KonutFiyatiHesaplamaPage.css";
import NavigationBar from "../NavigationBar";
import Footer from "../Footer";

const KonutFiyatiHesaplamaPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Konut Fiyatı Hesaplama";
  }, []);

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType !== "admin" && userType !== "user") {
      navigate("/");
    }
  }, [navigate]);
  const [prediction, setPrediction] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach((value, key) => (formObject[key] = value));

    const response = await fetch("http://127.0.0.1:5000/model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });

    if (response.ok) {
      const result = await response.json();
      setPrediction(result.prediction);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="konut-fiyati-hesaplama-container">
        <h1 className="title">Konut Fiyat Tahmini</h1>
        <form id="prediction-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="brut">
              Brut Metrekare:
            </label>
            <input
              className="form-input"
              type="number"
              id="brut"
              name="brut"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="yas">
              Bina Yaşı:
            </label>
            <select className="form-input" id="yas" name="yas" required>
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={4}>2</option>
              <option value={6}>3</option>
              <option value={7}>4</option>
              <option value={8}>5-10</option>
              <option value={2}>11-15</option>
              <option value={3}>16-20</option>
              <option value={5}>21 ve üzeri</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="kat1">
              Binanın Kat Sayısı:
            </label>
            <select className="form-input" id="kat1" name="kat1" required>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option>
              <option value={11}>11</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="net">
              Net Metrekare:
            </label>
            <input
              className="form-input"
              type="number"
              id="net"
              name="net"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="oda">
              Oda Sayısı:
            </label>
            <select className="form-input" id="oda" name="oda" required>
              <option value={0}>1</option>
              <option value={1}>1+1</option>
              <option value={2}>2+1</option>
              <option value={3}>3+1</option>
              <option value={4}>3+2</option>
              <option value={5}>3.5+1</option>
              <option value={6}>4+1</option>
              <option value={7}>4+2</option>
              <option value={8}>5+1</option>
              <option value={9}>5+2</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="kat2">
              Bulunduğu Kat:
            </label>
            <select className="form-input" id="kat2" name="kat2" required>
              <option value={0}>-1</option>
              <option value={1}>-2</option>
              <option value={2}>1</option>
              <option value={4}>2</option>
              <option value={5}>3</option>
              <option value={6}>4</option>
              <option value={7}>5</option>
              <option value={8}>7</option>
              <option value={3}>10</option>
              <option value={9}>Bahçe Dubleks</option>
              <option value={10}>Bahçe Katı</option>
              <option value={11}>Düz Giriş</option>
              <option value={12}>Mustakil Kat</option>
              <option value={13}>Yüksek Giriş</option>
              <option value={14}>Çatı Dubleks</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="isitma">
              Isıtma Türü:
            </label>
            <select className="form-input" id="isitma" name="isitma" required>
              <option value={0}>Kat kaloriferi</option>
              <option value={1}>Kombi doğalgaz</option>
              <option value={2}>Merkezi doğalgaz</option>
              <option value={3}>Yerden ısıtma</option>
            </select>
          </div>
          <button className="form-button" type="submit">
            HESAPLA
          </button>
        </form>
        <div className="result" id="result">
          {prediction && <p>Tahmini Fiyat: {prediction}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default KonutFiyatiHesaplamaPage;
