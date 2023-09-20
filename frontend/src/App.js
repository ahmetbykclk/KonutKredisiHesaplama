import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Pages/Login.js";
import AdminPage from "./components/Pages/AdminPage.js";
import KrediHesaplamaPage from "./components/Pages/KrediHesaplamaPage.js";
import SorgulamaPage from "./components/Pages/SorgulamaPage.js";
import DetayPage from "./components/Pages/DetayPage.js";
import KonutFiyatiHesaplamaPage from "./components/Pages/KonutFiyatiHesaplamaPage.js";
import BaşvurularımPage from "./components/Pages/BaşvurularımPage.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/basvurularim" element={<BaşvurularımPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/kredihesaplama" element={<KrediHesaplamaPage />} />
          <Route
            path="/konutfiyatihesaplama"
            element={<KonutFiyatiHesaplamaPage />}
          />
          <Route path="/kredihesaplama/sorgulama" element={<SorgulamaPage />} />
          <Route
            path="/kredihesaplama/sorgulama/detay"
            element={<DetayPage />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
